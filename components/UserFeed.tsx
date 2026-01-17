
import React, { useState, useEffect } from 'react';
import { NewsItem, SocialUpdate } from '../types';
import { RSS_SOURCES } from '../constants';
import { fetchNewsFromSource } from '../services/newsService';
import NewsCard from './NewsCard';
import { RefreshCw, Sparkles, Facebook, Tv, Zap, ExternalLink, Twitter, MessageCircle, Share2, Heart } from 'lucide-react';

interface UserFeedProps {
  searchQuery: string;
  userPosts: NewsItem[];
  viewMode?: 'ALL' | 'TRENDING' | 'SAVED';
  onNewsLoaded?: (headlines: string[]) => void;
}

const INITIAL_SOCIAL: SocialUpdate[] = [
  { id: '1', platform: 'facebook', source: 'Somoy TV', content: 'ব্রেকিং: রাজধানীসহ দেশের বিভিন্ন স্থানে হালকা বৃষ্টিপাতের পূর্বাভাস দিয়েছে আবহাওয়া অফিস। সাধারণ মানুষকে সতর্ক থাকতে বলা হয়েছে।', time: '৫ মিনিট আগে', tags: ['#SomoyTV', '#Weather'] },
  { id: '2', platform: 'twitter', source: 'Jamuna TV (X)', content: 'Elon Musk announces new AI update for Tesla. Expected to be released by late 2025. #TechUpdate #X', time: '১০ মিনিট আগে', tags: ['#TeslaAI', '#Future'] },
  { id: '3', platform: 'facebook', source: 'Daily Star', content: 'খেলাধুলা: বড় জয়ের লক্ষ্য নিয়ে মাঠে নামছে জাতীয় দল। সমর্থকদের প্রত্যাশা এখন আকাশচুম্বী। #SportsNews', time: '১৫ মিনিট আগে', tags: ['#CricketBD', '#Win'] },
  { id: '4', platform: 'twitter', source: 'BBC News', content: 'Global markets hit record highs as inflation slows down across Europe. Economy experts remain hopeful.', time: '২০ মিনিট আগে', tags: ['#GlobalEconomy', '#Market'] }
];

const MOCK_NEW_UPDATES: SocialUpdate[] = [
  { id: 'a', platform: 'twitter', source: 'InfoVibe Global', content: 'Premium AI News Aggregation is now reaching 1M monthly active users! Thank you for the support. #Milestone', time: 'এখনই', tags: ['#1Million', '#AI'] },
  { id: 'b', platform: 'facebook', source: 'Independent TV', content: 'শহরে যানজট কমাতে নতুন ফ্লাইওভার প্রকল্পের অনুমোদন। আগামী মাস থেকেই কাজ শুরু হবে।', time: 'এখনই', tags: ['#CityNews', '#Infrastructure'] },
  { id: 'c', platform: 'twitter', source: 'TechCrunch', content: 'OpenAI working on a secret model named "Sora 2" for ultra-realistic video generation. #AIRevolution', time: 'এখনই', tags: ['#OpenAI', '#Sora'] }
];

const UserFeed: React.FC<UserFeedProps> = ({ searchQuery, userPosts, viewMode = 'ALL', onNewsLoaded }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [socialUpdates, setSocialUpdates] = useState<SocialUpdate[]>(INITIAL_SOCIAL);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('infovibe_saved_ids');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchAllNews = async () => {
    setLoading(true);
    let allNews: NewsItem[] = [...userPosts];
    try {
      const results = await Promise.all(RSS_SOURCES.map(source => fetchNewsFromSource(source)));
      results.forEach(items => { allNews = [...allNews, ...items]; });
      const sortedNews = allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setNews(sortedNews);
      
      if (onNewsLoaded) {
        // প্রথম ১০টি খবরের টাইটেল টিকারে পাঠানো হবে
        const headlines = sortedNews.slice(0, 10).map(n => n.title);
        onNewsLoaded(headlines);
      }
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [userPosts]);

  // Social Auto-Update Simulation
  useEffect(() => {
    if (viewMode === 'ALL') {
      const interval = setInterval(() => {
        const randomUpdate = MOCK_NEW_UPDATES[Math.floor(Math.random() * MOCK_NEW_UPDATES.length)];
        const newUpdate = { ...randomUpdate, id: Date.now().toString() };
        setSocialUpdates(prev => [newUpdate, ...prev].slice(0, 10));
      }, 15000); // New post every 15 seconds
      return () => clearInterval(interval);
    }
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('infovibe_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: string) => {
    setSavedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesView = true;
    if (viewMode === 'TRENDING') matchesView = item.isTrending || false;
    if (viewMode === 'SAVED') matchesView = savedIds.includes(item.id);
    return matchesSearch && matchesView;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-12 md:space-y-24 pb-20 md:pb-40">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 border-b border-white/5 pb-8 md:pb-16">
        <div className="space-y-2 md:space-y-4">
           <h1 className="text-4xl md:text-8xl font-black text-white luxury-text tracking-tighter leading-tight">
            {viewMode === 'TRENDING' ? 'Trends' : viewMode === 'SAVED' ? 'Vault' : 'Feed'}
           </h1>
           <div className="flex items-center gap-3 md:gap-5">
             <div className="w-10 md:w-16 h-1 bg-gold-primary rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse"></div>
             <p className="text-slate-500 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs">চোখের পলকে খবর</p>
           </div>
        </div>
        <div className="flex w-full md:w-auto">
          <button onClick={fetchAllNews} className="flex flex-1 md:flex-none items-center justify-center gap-3 md:gap-4 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-[2rem] gold-border text-[10px] md:text-xs font-black text-gold-primary hover:bg-gold-primary hover:text-black transition-all shadow-2xl group">
            <RefreshCw size={18} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} /> REFRESH
          </button>
        </div>
      </section>

      {/* Social Media Hub (Home Only) */}
      {viewMode === 'ALL' && !searchQuery && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          
          {/* Facebook Live Feed */}
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] gold-border space-y-8 md:space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700 hidden md:block">
               <Facebook size={120} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3 md:gap-5">
                <div className="p-2 md:p-3 bg-blue-600 rounded-xl md:rounded-2xl text-white shadow-xl"><Facebook size={20} /></div>
                ফেসবুক আপডেট
              </h2>
              <div className="flex items-center gap-1.5 md:gap-2">
                 <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-600 rounded-full animate-ping"></span>
                 <span className="text-[8px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest">Live</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
              {socialUpdates.filter(s => s.platform === 'facebook').map(update => (
                <SocialCard key={update.id} update={update} />
              ))}
            </div>
            
            <button 
              onClick={() => window.open('https://www.youtube.com/results?search_query=bangla+news+live', '_blank')}
              className="w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-black text-gold-primary hover:bg-gold-primary hover:text-black transition-all group/btn"
            >
               <Tv size={16} /> লাইভ টিভি (YouTube)
            </button>
          </div>

          {/* Twitter (X) Live Feed */}
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] gold-border space-y-8 md:space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-700 hidden md:block">
               <Twitter size={120} />
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-3xl font-black text-white flex items-center gap-3 md:gap-5">
                <div className="p-2 md:p-3 bg-slate-900 border border-white/20 rounded-xl md:rounded-2xl text-white shadow-xl">
                   <Twitter size={20} className="text-sky-400" />
                </div>
                টুইটার ব্রেকিং
              </h2>
              <div className="flex items-center gap-1.5 md:gap-2">
                 <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-ping"></span>
                 <span className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real-Time</span>
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
              {socialUpdates.filter(s => s.platform === 'twitter').map(update => (
                <SocialCard key={update.id} update={update} />
              ))}
            </div>
            
            <button 
              onClick={() => window.open('https://twitter.com/search?q=bangladesh%20news&src=typed_query&f=live', '_blank')}
              className="w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-xs font-black text-slate-400 hover:text-gold-primary hover:border-gold-primary/30 transition-all"
            >
               টুইটার (X) ট্রেন্ড <ExternalLink size={16} />
            </button>
          </div>

        </section>
      )}

      {/* Main News Flow Section */}
      <div className="space-y-8 md:space-y-16">
        <div className="flex items-center gap-4 md:gap-8">
           <div className="p-3 md:p-4 bg-gold-primary/10 rounded-xl md:rounded-2xl text-gold-primary shadow-xl shadow-gold-primary/5">
              <Zap size={22} className="fill-gold-primary md:w-7 md:h-7" />
           </div>
           <h2 className="text-xl md:text-4xl font-black text-white luxury-text uppercase tracking-widest">সংবাদ প্রবাহ</h2>
           <div className="flex-1 h-[1px] md:h-[2px] bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {loading && filteredNews.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass h-[400px] md:h-[550px] rounded-[2rem] md:rounded-[3rem] animate-pulse gold-border" />
            ))
          ) : filteredNews.length > 0 ? (
            filteredNews.map(item => (
              <NewsCard 
                key={item.id} 
                news={item} 
                onSave={toggleSave} 
                isSaved={savedIds.includes(item.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 md:py-40 text-center glass rounded-[2.5rem] md:rounded-[4rem] gold-border">
              <Sparkles size={40} className="text-gold-primary/10 mx-auto mb-4 md:mb-8 md:w-20 md:h-20" />
              <p className="text-slate-600 font-black tracking-[0.2em] md:tracking-[0.4em] uppercase text-sm md:text-lg">এখনো কোনো তথ্য নেই</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const SocialCard = ({ update }: { update: SocialUpdate }) => (
  <div className="p-5 md:p-8 bg-white/[0.03] rounded-2xl md:rounded-[2.5rem] border border-white/5 space-y-4 md:space-y-5 hover:bg-white/[0.07] transition-all group animate-in slide-in-from-right-4 duration-700">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
         <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-gold-primary/20 flex items-center justify-center font-black text-xs md:text-sm text-gold-primary shadow-lg ${update.platform === 'twitter' ? 'bg-slate-900' : 'bg-blue-900/20'}`}>
           {update.source[0]}
         </div>
         <div>
            <span className="text-sm md:text-base font-black text-white block group-hover:text-gold-primary transition-colors">{update.source}</span>
            <span className="text-[8px] md:text-[10px] text-slate-600 font-black uppercase tracking-widest">{update.time}</span>
         </div>
      </div>
      <div className={`p-1.5 md:p-2 rounded-lg ${update.platform === 'twitter' ? 'text-sky-400 bg-sky-400/10' : 'text-blue-500 bg-blue-500/10'}`}>
         {update.platform === 'twitter' ? <Twitter size={12} className="md:w-3.5 md:h-3.5" /> : <Facebook size={12} className="md:w-3.5 md:h-3.5" />}
      </div>
    </div>
    <p className="text-[13px] md:text-sm text-slate-400 leading-relaxed font-medium line-clamp-4">{update.content}</p>
    <div className="flex items-center gap-3 md:gap-4 pt-1 md:pt-2">
      <div className="flex gap-1.5">
        {update.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="text-[8px] md:text-[9px] text-gold-primary font-black tracking-widest uppercase bg-gold-primary/5 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-2 md:gap-3 text-slate-600">
         <button className="hover:text-gold-primary transition-colors"><Heart size={12} className="md:w-3.5 md:h-3.5" /></button>
         <button className="hover:text-gold-primary transition-colors"><MessageCircle size={12} className="md:w-3.5 md:h-3.5" /></button>
         <button className="hover:text-gold-primary transition-colors"><Share2 size={12} className="md:w-3.5 md:h-3.5" /></button>
      </div>
    </div>
  </div>
);

export default UserFeed;
