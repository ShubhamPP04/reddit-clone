import React, { useState, useCallback, useRef, useEffect } from 'react';
import redditAPI from '../services/redditApi';
import '../App.css';

function Header({ currentSection, onSectionChange, theme, onThemeToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [subredditResults, setSubredditResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeoutRef = useRef(null);
  const searchRef = useRef(null);

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setSubredditResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Fetch both posts and subreddits in parallel
      const [postsData, subredditsData] = await Promise.all([
        redditAPI.searchPosts({
          query: query.trim(),
          limit: 5
        }),
        redditAPI.searchSubreddits(query.trim())
      ]);

      if (postsData?.data?.children) {
        const results = postsData.data.children
          .filter(child => child.data)
          .map(child => ({
            id: child.data.id,
            title: child.data.title,
            subreddit: child.data.subreddit,
            score: child.data.score,
            numComments: child.data.num_comments,
            permalink: child.data.permalink,
            type: 'post'
          }));
        setSearchResults(results);
      }

      if (subredditsData?.data?.children) {
        const subreddits = subredditsData.data.children
          .filter(child => child.data)
          .map(child => ({
            id: child.data.id,
            name: child.data.display_name,
            icon: child.data.icon_img || child.data.community_icon,
            subscribers: child.data.subscribers,
            description: child.data.public_description,
            type: 'subreddit'
          }));
        setSubredditResults(subreddits);
      }

      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setSubredditResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInput = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(query);
    }, 300);
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <button 
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <a href="/" className="logo">
            <img 
              src="https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png"
              alt="Reddit"
              className="logo-icon"
            />
            <span className="logo-text">reddit</span>
          </a>
          <nav className="main-nav">
            <button 
              className={`nav-item ${currentSection === 'home' ? 'active' : ''}`}
              onClick={() => onSectionChange('home')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              Home
            </button>
            <button 
              className={`nav-item ${currentSection === 'popular' ? 'active' : ''}`}
              onClick={() => onSectionChange('popular')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
              </svg>
              Popular
            </button>
            <button 
              className={`nav-item ${currentSection === 'all' ? 'active' : ''}`}
              onClick={() => onSectionChange('all')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm0 4a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z"/>
              </svg>
              All
            </button>
          </nav>
        </div>
        
        <div className="search-bar" ref={searchRef}>
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search Reddit"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={() => {
              if (searchResults.length > 0 || subredditResults.length > 0) {
                setShowResults(true);
              }
            }}
          />
          {isSearching && (
            <div className="search-loading">
              <div className="loading-spinner" />
            </div>
          )}
          {showResults && (searchResults.length > 0 || subredditResults.length > 0) && (
            <div className="search-results">
              {subredditResults.length > 0 && (
                <div className="search-section">
                  <h3 className="search-section-title">Communities</h3>
                  {subredditResults.map(subreddit => (
                    <a 
                      key={subreddit.id}
                      href={`https://reddit.com/r/${subreddit.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-result-item subreddit-result"
                    >
                      <img 
                        src={subreddit.icon || "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png"} 
                        alt="" 
                        className="subreddit-icon"
                      />
                      <div className="subreddit-info">
                        <div className="subreddit-name">r/{subreddit.name}</div>
                        <div className="subreddit-stats">
                          {subreddit.subscribers?.toLocaleString()} members
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="search-section">
                  <h3 className="search-section-title">Posts</h3>
                  {searchResults.map(result => (
                    <a 
                      key={result.id}
                      href={`https://reddit.com${result.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="search-result-item"
                    >
                      <div className="search-result-title">{result.title}</div>
                      <div className="search-result-meta">
                        <span>r/{result.subreddit}</span>
                        <span>•</span>
                        <span>{result.score} points</span>
                        <span>•</span>
                        <span>{result.numComments} comments</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="header-right">
          <button className="create-post">Create Post</button>
          <div className="user-notifications">
            <button className="icon-button">
              <svg className="notification-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </button>
            <button className="icon-button">
              <svg className="message-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
            </button>
          </div>
          <button className="user-profile">
            <img 
              src="https://www.redditstatic.com/avatars/defaults/v2/avatar_default_1.png"
              alt=""
              className="avatar"
            />
            <svg className="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;