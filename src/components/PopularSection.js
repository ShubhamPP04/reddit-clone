import React, { useState, useEffect } from 'react';
import redditAPI from '../services/redditApi';
import '../App.css';

function PopularSection() {
  const [popularTopics, setPopularTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularTopics = async () => {
      try {
        setLoading(true);
        const data = await redditAPI.fetchPosts({
          section: 'popular',
          sortBy: 'top',
          limit: 5
        });

        const topics = data.data.children.map(child => ({
          id: child.data.id,
          title: child.data.title,
          upvotes: child.data.score,
          subreddit: child.data.subreddit
        }));

        setPopularTopics(topics);
        setError(null);
      } catch (err) {
        console.error('Error fetching popular topics:', err);
        setError('Failed to load popular topics');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularTopics();
  }, []);

  if (loading) {
    return (
      <div className="popular-section">
        <h2>Popular Today</h2>
        <div className="loading">
          <div className="loading-spinner" />
          <span>Loading popular topics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="popular-section">
        <h2>Popular Today</h2>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-section">
      <h2>Popular Today</h2>
      <div className="popular-topics">
        {popularTopics.map(topic => (
          <div key={topic.id} className="popular-topic">
            <h3>{topic.title}</h3>
            <div className="topic-meta">
              <span>r/{topic.subreddit}</span>
              <span>{topic.upvotes.toLocaleString()} upvotes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularSection; 