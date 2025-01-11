const BASE_URL = 'https://www.reddit.com';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache
const RATE_LIMIT_INTERVAL = 1000; // 1 second
const MAX_RETRIES = 3;

class RedditAPI {
  constructor() {
    this.cache = new Map();
    this.lastRequestTime = 0;
    this.pendingRequests = new Map();
  }

  async makeRequest(endpoint, params = {}, retryCount = 0) {
    try {
      const searchParams = new URLSearchParams({
        raw_json: '1',
        ...params
      }).toString();

      const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${searchParams}`;
      console.log('Making request to:', url);

      if (this.pendingRequests.has(url)) {
        return this.pendingRequests.get(url);
      }

      const cached = this.cache.get(url);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_INTERVAL - timeSinceLastRequest));
      }
      this.lastRequestTime = Date.now();

      const requestPromise = fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      }).then(async response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.cache.set(url, {
          data,
          timestamp: Date.now()
        });
        return data;
      });

      this.pendingRequests.set(url, requestPromise);
      requestPromise.finally(() => {
        this.pendingRequests.delete(url);
      });

      return requestPromise;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async fetchPosts({ section = 'popular', sortBy = 'hot', after = null, limit = 25 }) {
    try {
      let endpoint;
      const params = { limit: Math.min(limit, 100) };
      
      if (after) {
        params.after = after;
      }

      // Simplified endpoint logic
      switch (section) {
        case 'home':
          endpoint = sortBy === 'best' ? '/best' : `/${sortBy}`;
          break;
        case 'popular':
          endpoint = `/r/popular/${sortBy}`;
          break;
        case 'all':
          endpoint = `/r/all/${sortBy}`;
          break;
        default:
          endpoint = '/r/popular';
      }

      endpoint = `${endpoint}.json`;
      console.log(`Fetching posts from ${endpoint}`);

      const data = await this.makeRequest(endpoint, params);
      
      if (!data?.data?.children) {
        throw new Error('Invalid response from Reddit');
      }

      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw new Error(`Failed to load ${section} posts: ${error.message}`);
    }
  }

  async searchPosts({ query, sortBy = 'relevance', after = null, limit = 25 }) {
    const params = {
      q: query,
      sort: sortBy,
      limit: Math.min(limit, 50).toString(),
      type: 'link'
    };
    
    if (after) {
      params.after = after;
      params.count = limit;
    }
    
    return this.makeRequest('/search.json', params);
  }

  async fetchSubredditInfo(subreddit) {
    return this.makeRequest(`/r/${subreddit}/about.json`);
  }

  async fetchPopularSubreddits() {
    return this.makeRequest('/subreddits/popular.json', { limit: '10' });
  }

  async fetchSubredditPosts({ subreddit, sortBy = 'hot', after = null, limit = 25 }) {
    const params = { 
      limit: Math.min(limit, 50).toString()
    };
    
    if (after) {
      params.after = after;
      params.count = limit;
    }

    const endpoint = sortBy === 'best' 
      ? `/r/${subreddit}.json`
      : `/r/${subreddit}/${sortBy}.json`;

    return this.makeRequest(endpoint, params);
  }

  async fetchComments({ subreddit, postId, sortBy = 'confidence' }) {
    return this.makeRequest(`/r/${subreddit}/comments/${postId}.json`, { sort: sortBy });
  }

  clearCache() {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  async searchSubreddits(query, limit = 5) {
    const params = {
      query,
      limit: limit.toString(),
      include_over_18: 'false'
    };
    
    return this.makeRequest('/api/subreddit_autocomplete_v2.json', params);
  }
}

const redditAPI = new RedditAPI();
export default redditAPI; 