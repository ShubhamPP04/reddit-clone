import React from 'react';
import '../App.css';

function Post({ post }) {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num;
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp * 1000);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  };

  return (
    <article className="post">
      <div className="post-votes">
        <button className="vote-button" aria-label="Upvote">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 4L4 14h16L12 4z" fill="currentColor"/>
          </svg>
        </button>
        <span className="vote-count">{formatNumber(post.score)}</span>
        <button className="vote-button" aria-label="Downvote">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 20l8-10H4l8 10z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="post-content">
        <div className="post-header">
          <div className="post-meta">
            <span className="post-subreddit">r/{post.subreddit}</span>
            <span className="post-author">Posted by u/{post.author}</span>
            <span className="post-time">{formatTime(post.created_utc)}</span>
          </div>
          <button className="post-more" aria-label="More options">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <h3 className="post-title">{post.title}</h3>

        {post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && (
          <div className="post-media">
            <img src={post.thumbnail} alt="" loading="lazy" />
          </div>
        )}

        <div className="post-actions">
          <button className="post-action">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M10.5 5h-7C2.67 5 2 5.67 2 6.5v7c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-7-2h7c1.93 0 3.5 1.57 3.5 3.5v7c0 1.93-1.57 3.5-3.5 3.5h-7A3.5 3.5 0 0 1 0 13.5v-7C0 4.57 1.57 3 3.5 3zm16 2.5v7c0 .83-.67 1.5-1.5 1.5h-2v-2h2v-7h-2v-2h2c.83 0 1.5.67 1.5 1.5z" fill="currentColor"/>
            </svg>
            {formatNumber(post.num_comments)} Comments
          </button>
          <button className="post-action">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M16 6l-1.41 1.41L16.17 9H4v2h12.17l-1.58 1.59L16 14l4-4-4-4z" fill="currentColor"/>
            </svg>
            Share
          </button>
          <button className="post-action">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M14.5 3A3.5 3.5 0 0 0 11 6.5v7a3.5 3.5 0 1 0 7 0v-7A3.5 3.5 0 0 0 14.5 3zm0 2a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-3 0v-7A1.5 1.5 0 0 1 14.5 5zM3.5 5A1.5 1.5 0 0 0 2 6.5v7A1.5 1.5 0 0 0 3.5 15h7a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 10.5 5h-7z" fill="currentColor"/>
            </svg>
            Save
          </button>
        </div>
      </div>
    </article>
  );
}

export default Post; 