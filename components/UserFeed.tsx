
import React, { useState, useEffect } from 'react';
import { NewsItem } from '../types';
import { RSS_SOURCES, CATEGORIES } from '../constants';
import { fetchNewsFromSource } from '../services/newsService';
import NewsCard from './NewsCard';
import { RefreshCw, Sparkles, TrendingUp, Globe } from 'lucide-react';

interface UserFeedProps {
  searchQuery: string;
  userPosts: NewsItem[];
  viewMode?: 'ALL' | 'TRENDING';
}

const UserFeed: React.FC<UserFeedProps> = ({ searchQuery, userPosts, viewMode = 'ALL' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString());

  const fetchAllNews = async () => {
    setLoading(true);
    let allNews: NewsItem[] = [...userPosts];
    
    try {
      const activeSources = RSS_SOURCES.filter(s => s.active);
      const results = await Promise.all(activeSources.map(source => fetchNewsFromSource(source)));
      results.forEach(items => { allNews = [...allNews, ...items]; });
      
      const sortedNews = allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      setNews(sortedNews);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("News fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
    const interval = setInterval(fetchAllNews, 120000); // ২ মিনিট (120,000ms) অটো আপডেট
    return () => clearInterval(interval);
  }, [userPosts]);

  const countries = ['All', 'Bangladesh', 'India', 'Global'];

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filter === 'All' || item.category === filter;
    const matchesCountry = countryFilter === 'All' || item.country === countryFilter;
    const matchesViewMode = viewMode === 'ALL' || item.isTrending;
    
    return matchesSearch && matchesCategory && matchesCountry && matchesViewMode;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  লাইভ নিউজ ({news.length})
               </div>
               <div className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">আপডেট: {lastUpdated}</div>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight flex items-center gap-4">
              {viewMode === 'TRENDING' ? 'ট্রেন্ডিং নিউজ' : 'লেটেস্ট আপডেট'} <Sparkles className="text-indigo-400" />
            </h1>
          </div>

          <div className="flex flex-col gap-4">
             <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {countries.map(country => (
                  <button 
                    key={country} 
                    onClick={() => setCountryFilter(country)} 
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all border flex items-center gap-1.5 ${countryFilter === country ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                  >
                    <Globe size={12} /> {country}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.name} 
                    onClick={() => setFilter(cat.name)} 
                    className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border flex items-center gap-2 ${filter === cat.name ? 'bg-white text-slate-950 border-white' : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30'}`}
                  >
                    <cat.icon size={16} />
                    {cat.name}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {loading && news.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass h-[400px] rounded-[2rem] animate-pulse" />
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map(item => <NewsCard key={item.id} news={item} onSave={() => {}} />)
        ) : (
          <div className="col-span-full py-20 text-center glass rounded-[3rem]">
            <p className="text-slate-500 font-medium">এই বিভাগে কোনো খবর খুঁজে পাওয়া যায়নি।</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserFeed;
