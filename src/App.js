import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="App">
      <Header 
        currentSection={currentSection} 
        onSectionChange={handleSectionChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
      <div className="container">
        <Sidebar />
        <MainContent currentSection={currentSection} />
      </div>
    </div>
  );
}

export default App;
