import React, { useState, useEffect, useCallback, useRef } from 'react';
import redditAPI from '../services/redditApi';

function MainContent({ currentSection }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState(currentSection === 'home' ? 'best' : 'hot');
  const [after, setAfter] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const abortControllerRef = useRef(null);
  const retryCountRef = useRef(0);
  // eslint-disable-next-line no-unused-vars
  const maxRetries = 2;

  // Reset sort when changing sections
  useEffect(() => {
    setSortBy(currentSection === 'home' ? 'best' : 'hot');
  }, [currentSection]);

  const fetchPosts = useCallback(async (reset = false, isRetry = false) => {
    try {
      if (abortControllerRef.current && !isRetry) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      if (reset && !isRetry) {
        setLoading(true);
        setError(null);
        setPosts([]);
        setAfter(null);
        retryCountRef.current = 0;
      } else if (!reset) {
        setLoadingMore(true);
      }

      const data = await redditAPI.fetchPosts({
        section: currentSection,
        sortBy,
        after: reset ? null : after,
        limit: 25
      });

      if (!data?.data?.children) {
        throw new Error('No posts available at the moment. Please try again later.');
      }

      const newPosts = data.data.children
        .filter(child => child.data && child.kind === 't3')
        .map(child => ({
          id: child.data.id,
          title: child.data.title,
          author: child.data.author,
          subreddit: child.data.subreddit,
          created_utc: child.data.created_utc,
          num_comments: child.data.num_comments,
          score: child.data.score,
          thumbnail: child.data.thumbnail,
          url: child.data.url,
          permalink: child.data.permalink
        }));

      setPosts(prevPosts => reset ? newPosts : [...prevPosts, ...newPosts]);
      setAfter(data.data.after);
      setError(null);
      retryCountRef.current = 0;
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Error fetching posts:', err);
      setError('Failed to load posts from Reddit. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [currentSection, sortBy, after]);

  useEffect(() => {
    fetchPosts(true);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentSection, sortBy, fetchPosts]);

  const handleSortChange = (newSort) => {
    if (newSort === sortBy) return;
    setSortBy(newSort);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  if (loading && !posts.length) {
    return (
      <div className="loading">
        <div className="loading-spinner" />
        <span>Loading posts...</span>
      </div>
    );
  }

  return (
    <main className="main-content">
      <div className="content-header">
        <h1 className="content-title">
          {currentSection === 'home' ? 'Home' : 
           currentSection === 'popular' ? 'Popular' : 
           currentSection === 'all' ? 'All of Reddit' : 'Popular'}
        </h1>
        
        <div className="sort-options">
          <button 
            className={`sort-button ${sortBy === 'hot' ? 'active' : ''}`}
            onClick={() => handleSortChange('hot')}
          >
            Hot
          </button>
          <button 
            className={`sort-button ${sortBy === 'new' ? 'active' : ''}`}
            onClick={() => handleSortChange('new')}
          >
            New
          </button>
          {currentSection !== 'home' && (
            <>
              <button 
                className={`sort-button ${sortBy === 'controversial' ? 'active' : ''}`}
                onClick={() => handleSortChange('controversial')}
              >
                Controversial
              </button>
              <button 
                className={`sort-button ${sortBy === 'rising' ? 'active' : ''}`}
                onClick={() => handleSortChange('rising')}
              >
                Rising
              </button>
            </>
          )}
          <button 
            className={`sort-button ${sortBy === 'top' ? 'active' : ''}`}
            onClick={() => handleSortChange('top')}
          >
            Top
          </button>
        </div>
      </div>

      <div className="posts-list">
        {posts.map(post => (
          <article key={post.id} className="post">
            <div className="vote-section">
              <button className="vote-button" aria-label="Upvote">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 2.5l-6 6h4v5h4v-5h4l-6-6z"/>
                </svg>
              </button>
              <span className="vote-count">
                {post.score >= 1000 ? `${(post.score/1000).toFixed(1)}K` : post.score}
              </span>
              <button className="vote-button" aria-label="Downvote">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 13.5l-6-6h4v-5h4v5h4l-6 6z"/>
                </svg>
              </button>
            </div>

            <div className="post-content">
              <div className="post-main">
                <h2 className="post-title">{post.title}</h2>
                <div className="post-meta">
                  <span>Posted by u/{post.author}</span>
                  <span>{formatTimestamp(post.created_utc)}</span>
                </div>
                
                <div className="post-footer">
                  <button className="post-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z"/>
                    </svg>
                    {post.num_comments} Comments
                  </button>
                  <button className="post-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M7 2.5L2 6h3v7h4V6h3L7 2.5z"/>
                    </svg>
                    Share
                  </button>
                  <button className="post-action">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M3 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && (
                <div className="post-thumbnail">
                  <img src={post.thumbnail} alt="" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={() => fetchPosts(true)}>
            Try Again
          </button>
        </div>
      )}

      {loadingMore && (
        <div className="loading">
          <div className="loading-spinner" />
          <span>Loading more posts...</span>
        </div>
      )}
    </main>
  );
}

export default MainContent; 