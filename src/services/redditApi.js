const BASE_URL = 'https://www.reddit.com';
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes cache
const RATE_LIMIT_INTERVAL = 100; // Reduced to 100ms
const MAX_RETRIES = 2; // Reduced retries

class RedditAPI {
  constructor() {
    this.cache = new Map();
    this.lastRequestTime = 0;
    this.pendingRequests = new Map();
  }

  async makeRequest(endpoint, params = {}, retryCount = 0) {
    try {
      // Build URL
      const searchParams = new URLSearchParams({
        raw_json: '1',
        ...params
      }).toString();

      const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}${searchParams}`;

      // Check for pending request for the same URL
      if (this.pendingRequests.has(url)) {
        return this.pendingRequests.get(url);
      }

      // Check cache
      if (retryCount === 0) {
        const cached = this.cache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          return cached.data;
        }
      }

      // Basic rate limiting
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < RATE_LIMIT_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_INTERVAL - timeSinceLastRequest));
      }
      this.lastRequestTime = Date.now();

      // Create the request promise
      const requestPromise = (async () => {
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'web:reddit-clone:v1.0.0',
          },
          cache: 'no-cache'
        });

        if (response.status === 429) {
          if (retryCount < MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return this.makeRequest(endpoint, params, retryCount + 1);
          }
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        if (!response.ok) {
          throw new Error(`Reddit API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Cache successful responses
        if (retryCount === 0) {
          this.cache.set(url, {
            data,
            timestamp: Date.now()
          });
        }

        return data;
      })();

      // Store the pending request
      this.pendingRequests.set(url, requestPromise);

      // Clean up after request completes
      requestPromise.finally(() => {
        this.pendingRequests.delete(url);
      });

      return requestPromise;
    } catch (error) {
      console.error('Reddit API request failed:', error);
      
      if (error.message.includes('Failed to fetch') && retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced retry delay
        return this.makeRequest(endpoint, params, retryCount + 1);
      }
      
      throw new Error('Failed to fetch data from Reddit. Please try again later.');
    }
  }

  async fetchPosts({ section = 'popular', sortBy = 'hot', after = null, limit = 25 }) {
    let endpoint;
    const params = { 
      limit: Math.min(limit, 50).toString()
    };
    
    if (after) {
      params.after = after;
      params.count = limit;
    }

    switch (section) {
      case 'home':
        switch (sortBy) {
          case 'best':
            endpoint = '/best.json';
            break;
          case 'hot':
            endpoint = '/hot.json';
            break;
          case 'new':
            endpoint = '/new.json';
            break;
          case 'top':
            endpoint = '/top.json';
            params.t = 'day'; // Default time filter for top posts
            break;
          default:
            endpoint = '/best.json';
        }
        break;
      case 'popular':
        endpoint = `/r/popular/${sortBy}.json`;
        break;
      case 'all':
        endpoint = `/r/all/${sortBy}.json`;
        break;
      default:
        endpoint = '/r/popular.json';
    }

    return this.makeRequest(endpoint, params);
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