import React, { useState } from 'react';

function Sidebar() {
  const [expandedSections, setExpandedSections] = useState({
    favorites: true,
    redditFeeds: true,
    community: true
  });
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="sidebar">
      <div className="filter-section">
        <button 
          className="filter-dropdown-button"
          onClick={() => setShowFilterOptions(!showFilterOptions)}
        >
          Filter by
          <svg 
            className={`chevron-icon ${showFilterOptions ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M12.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 9.586l4.293-4.293z"/>
          </svg>
        </button>
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('favorites')}
        >
          <h2>FAVORITES</h2>
          <svg 
            className={`chevron-icon ${expandedSections.favorites ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M12.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 9.586l4.293-4.293z"/>
          </svg>
        </div>
        {expandedSections.favorites && (
          <ul className="community-list">
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_p6kb2m6b185b1.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/funymoro</span>
                <span className="post-count">156</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh3s/styles/communityIcon_gy5xw7oz1b851.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/breakingnews</span>
                <span className="post-count">12</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh1q/styles/communityIcon_sqb0o7fs5m4b1.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/lovestory</span>
                <span className="post-count">68</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh03/styles/communityIcon_1isvxgkk5hs51.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/gamingfun</span>
                <span className="post-count">08</span>
              </div>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('redditFeeds')}
        >
          <h2>REDDIT FEEDS</h2>
          <svg 
            className={`chevron-icon ${expandedSections.redditFeeds ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M12.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 9.586l4.293-4.293z"/>
          </svg>
        </div>
        {expandedSections.redditFeeds && (
          <ul className="community-list">
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh3l/styles/communityIcon_xtjipwqg8ry41.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/moview</span>
                <span className="post-count">04</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh03/styles/communityIcon_1isvxgkk5hs51.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/gaming</span>
                <span className="post-count">32</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh0u/styles/communityIcon_6fzlk8ukx6s51.jpg" alt="" />
              <div className="community-info">
                <span className="community-name">r/pics</span>
                <span className="post-count">32</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh7a/styles/communityIcon_tijjpyw1qe201.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/gifs</span>
                <span className="post-count">12</span>
              </div>
            </li>
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div 
          className="section-header"
          onClick={() => toggleSection('community')}
        >
          <h2>COMMUNITY</h2>
          <svg 
            className={`chevron-icon ${expandedSections.community ? 'expanded' : ''}`}
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M12.293 5.293a1 1 0 011.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L8 9.586l4.293-4.293z"/>
          </svg>
        </div>
        {expandedSections.community && (
          <ul className="community-list">
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh1i/styles/communityIcon_p6kb2m6b185b1.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/funymoro</span>
                <span className="post-count">156</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh3s/styles/communityIcon_gy5xw7oz1b851.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/breakingnews</span>
                <span className="post-count">43</span>
              </div>
            </li>
            <li className="community-item">
              <img src="https://styles.redditmedia.com/t5_2qh1q/styles/communityIcon_sqb0o7fs5m4b1.png" alt="" />
              <div className="community-info">
                <span className="community-name">r/lovestory</span>
                <span className="post-count">12</span>
              </div>
            </li>
          </ul>
        )}
      </div>
    </aside>
  );
}

export default Sidebar; 