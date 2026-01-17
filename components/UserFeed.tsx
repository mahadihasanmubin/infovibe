
import React, { useState, useEffect } from 'react';
import { NewsItem, YoutubeVideo } from '../types';
import { RSS_SOURCES } from '../constants';
import { fetchNewsFromSource } from '../services/newsService';
import NewsCard from './NewsCard';
import { RefreshCw, Sparkles, Youtube, Facebook, Tv, Zap, ExternalLink, Play, ArrowRight, Video } from 'lucide-react';

interface UserFeedProps {
  searchQuery: string;
  userPosts: NewsItem[];
  viewMode?: 'ALL' | 'TRENDING' | 'SAVED';
}

const SAMPLE_VIDEOS: YoutubeVideo[] = [
  { id: 'UC9mI6v30L7P5U9-Vp4yWrtw', title: 'সময় টিভি লাইভ বুলেটিন', channel: 'Somoy TV', thumbnail: 'https://img.youtube.com/vi/v3_YQvG6Fv0/maxresdefault.jpg' },
  { id: 'UCm6f8fT2C-2I9V7h7V059qA', title: 'যমুনা নিউজ ব্রেকিং', channel: 'Jamuna TV', thumbnail: 'https://img.youtube.com/vi/U6I-xQJk6nI/maxresdefault.jpg' },
  { id: 'UC8vVpP5Qx8O8Z4-YpCq_tGg', title: 'দেশ ও বিদেশের খবর', channel: 'Independent TV', thumbnail: 'https://img.youtube.com/vi/q1e_A9X78m4/maxresdefault.jpg' },
  { id: 'UCyR69mO4e7uQWq8XN1Xm2Ww', title: 'ব্রেকিং হেডলাইনস', channel: 'NTV News', thumbnail: 'https://img.youtube.com/vi/S7-6rP7E-Y0/maxresdefault.jpg' }
];

const UserFeed: React.FC<UserFeedProps> = ({ searchQuery, userPosts, viewMode = 'ALL' }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
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
      setNews(allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNews();
  }, [userPosts]);

  useEffect(() => {
    localStorage.setItem('infovibe_saved_ids', JSON.stringify(savedIds));
  }, [savedIds]);

  const toggleSave = (id: string) => {
    const updated = savedIds.includes(id) 
      ? savedIds.filter(i => i !== id) 
      : [...savedIds, id];
    setSavedIds(updated);
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesView = true;
    if (viewMode === 'TRENDING') matchesView = item.isTrending || false;
    if (viewMode === 'SAVED') matchesView = savedIds.includes(item.id);
    return matchesSearch && matchesView;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-24 pb-32">
      {/* Premium Header */}
      <section className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-16">
        <div className="space-y-4">
           <h1 className="text-6xl md:text-8xl font-black text-white luxury-text tracking-tighter leading-tight">
            {viewMode === 'TRENDING' ? 'Trends' : viewMode === 'SAVED' ? 'Vault' : 'Premium Feed'}
           </h1>
           <div className="flex items-center gap-5">
             <div className="w-16 h-1 bg-gold-primary rounded-full shadow-[0_0_20px_rgba(212,175,55,0.6)] animate-pulse"></div>
             <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-xs">AI Luxury News Aggregator</p>
           </div>
        </div>
        <div className="flex gap-5">
          <button onClick={fetchAllNews} className="flex items-center gap-4 px-10 py-5 rounded-[2rem] gold-border text-xs font-black text-gold-primary hover:bg-gold-primary hover:text-black transition-all shadow-2xl group">
            <RefreshCw size={22} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'} /> UPDATE
          </button>
        </div>
      </section>

      {/* Video & Social Special Features (Home Only) */}
      {viewMode === 'ALL' && !searchQuery && (
        <section className="space-y-16 animate-in slide-in-from-bottom-10 duration-1000">
          
          {/* YouTube News Section - Horizontal Scroll */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-white flex items-center gap-5">
                <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl"><Youtube size={28} /></div>
                ভিডিও নিউজ আপডেট
              </h2>
              <button onClick={() => window.open('https://www.youtube.com/results?search_query=bangla+news+live', '_blank')} className="text-xs font-black text-gold-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all">
                সবগুলো দেখুন <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
              {SAMPLE_VIDEOS.map(vid => (
                <div key={vid.title} className="flex-shrink-0 w-80 group cursor-pointer" onClick={() => window.open(`https://www.youtube.com/@${vid.channel}/live`, '_blank')}>
                   <div className="relative aspect-video rounded-[2rem] overflow-hidden gold-border shadow-xl mb-4">
                      <img src={vid.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <Play size={32} className="text-white fill-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-rose-600 text-[10px] font-black uppercase text-white shadow-lg">Live Soon</span>
                      </div>
                   </div>
                   <h4 className="text-white font-black text-lg luxury-text leading-tight mb-1">{vid.title}</h4>
                   <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{vid.channel}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Live TV Channels Redirect Grid */}
            <div className="glass p-10 rounded-[3.5rem] gold-border space-y-10 relative overflow-hidden">
               <h2 className="text-3xl font-black text-white flex items-center gap-5 uppercase tracking-widest">
                  <div className="p-3 bg-amber-600 rounded-2xl text-white shadow-xl"><Tv size={28} /></div>
                  লাইভ নিউজ টিভি
               </h2>
               <div className="grid grid-cols-2 gap-6">
                 {['সময় টিভি', 'যমুনা টিভি', 'এনটিভি', 'ইন্ডিপেন্ডেন্ট'].map(tv => (
                   <button 
                    key={tv} 
                    onClick={() => window.open(`https://www.youtube.com/results?search_query=${tv}+live`, '_blank')}
                    className="p-8 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-4 transition-all hover:scale-105 hover:bg-gold-primary/10 hover:border-gold-primary/30 group"
                   >
                     <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-gold-primary group-hover:text-black transition-all">
                       <Video size={24} />
                     </div>
                     <span className="text-[11px] font-black text-slate-300 tracking-[0.2em] uppercase">{tv}</span>
                   </button>
                 ))}
               </div>
            </div>

            {/* Facebook Breaking Hub Simulation */}
            <div className="glass p-10 rounded-[3.5rem] gold-border space-y-10">
              <h2 className="text-3xl font-black text-white flex items-center gap-5 uppercase tracking-widest">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl"><Facebook size={28} /></div>
                ফেসবুক আপডেট
              </h2>
              <div className="space-y-6 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
                <SocialPost source="Somoy TV" content="ব্রেকিং: রাজধানীসহ দেশের বিভিন্ন স্থানে হালকা বৃষ্টিপাতের সম্ভাবনা। আবহাওয়া দপ্তরের সর্বশেষ সতর্কবার্তা জারি।" time="৫ মিনিট আগে" />
                <SocialPost source="Jamuna TV" content="বড় সাফল্য: ১০০ মেগাওয়াট সৌর বিদ্যুৎ কেন্দ্র উদ্বোধন করলেন সংশ্লিষ্ট মন্ত্রী। নতুন দিগন্তের পথে বাংলাদেশ।" time="১২ মিনিট আগে" />
                <SocialPost source="Independent TV" content="ইউনিক সংবাদ: ঢাকার মেট্রোরেল এখন থেকে রাত ১২টা পর্যন্ত চলবে। যাত্রীদের মধ্যে আনন্দ ও স্বস্তি।" time="২৫ মিনিট আগে" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="space-y-16">
        <div className="flex items-center gap-8">
           <Zap className="text-gold-primary fill-gold-primary" size={32} />
           <h2 className="text-4xl font-black text-white luxury-text uppercase tracking-widest">সর্বশেষ সংবাদ প্রবাহ</h2>
           <div className="flex-1 h-[2px] bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading && filteredNews.length === 0 ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="glass h-[550px] rounded-[3rem] animate-pulse gold-border" />
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
            <div className="col-span-full py-40 text-center glass rounded-[4rem] gold-border">
              <Sparkles size={80} className="text-gold-primary/10 mx-auto mb-8" />
              <p className="text-slate-500 font-black tracking-[0.4em] uppercase text-lg">এই বিভাগে আপাতত কোনো তথ্য নেই</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const SocialPost = ({ source, content, time }: { source: string, content: string, time: string }) => (
  <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 hover:bg-white/10 transition-all group animate-in slide-in-from-right-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
         <div className="w-12 h-12 rounded-full bg-slate-900 border border-gold-primary/20 flex items-center justify-center font-black text-sm text-gold-primary shadow-xl">
           {source[0]}
         </div>
         <span className="text-base font-black text-white group-hover:text-gold-primary transition-colors">{source}</span>
      </div>
      <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">{time}</span>
    </div>
    <p className="text-sm text-slate-400 leading-relaxed font-medium">{content}</p>
    <div className="flex gap-4 pt-2">
      <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 w-1/3"></div>
      </div>
    </div>
  </div>
);

export default UserFeed;
