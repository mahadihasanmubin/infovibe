
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import UserFeed from './components/UserFeed';
import AdminDashboard from './components/AdminDashboard';
import PostNews from './components/PostNews';
import Login from './components/Login';
import { AppView, User, NewsItem } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('USER');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerHeadlines, setTickerHeadlines] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('infovibe_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userPosts, setUserPosts] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('infovibe_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('infovibe_user');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('USER');
  };

  const handlePostAdded = (post: NewsItem) => {
    setUserPosts([post, ...userPosts]);
    setActiveView('USER');
  };

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView} 
      onSearch={setSearchQuery}
      currentUser={currentUser}
      onLogout={handleLogout}
      tickerItems={tickerHeadlines}
    >
      {activeView === 'USER' && <UserFeed searchQuery={searchQuery} userPosts={userPosts} onNewsLoaded={setTickerHeadlines} />}
      {activeView === 'TRENDING' && <UserFeed searchQuery={searchQuery} userPosts={userPosts} viewMode="TRENDING" onNewsLoaded={setTickerHeadlines} />}
      {activeView === 'SAVED' && <UserFeed searchQuery={searchQuery} userPosts={userPosts} viewMode="SAVED" />}
      {activeView === 'ADMIN' && currentUser?.role === 'admin' && <AdminDashboard />}
      {activeView === 'POST_NEWS' && currentUser && <PostNews onPostAdded={handlePostAdded} currentUser={currentUser} />}
      {activeView === 'LOGIN' && <Login onLogin={setCurrentUser} onBack={() => setActiveView('USER')} />}
    </Layout>
  );
};

export default App;
