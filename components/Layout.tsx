
import React, { useState, useEffect } from 'react';
import { Home, Bookmark, Shield, TrendingUp, PlusCircle, LogOut, LogIn, Search, UserCircle, ShieldCheck, Zap, Bell, Tv, Video } from 'lucide-react';
import { AppView, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onSearch: (q: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, onSearch, currentUser, onLogout }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Sidebar = () => (
    <aside className="w-80 border-r border-white/5 flex flex-col bg-slate-950 sticky top-0 h-screen z-50">
      <div className="p-12 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-[1.5rem] gold-btn flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-shine">
          <span className="text-black font-black text-4xl">I</span>
        </div>
        <span className="font-black text-4xl tracking-tighter text-white">Info<span className="luxury-text">Vibe</span></span>
      </div>

      <nav className="flex-1 px-8 space-y-4 mt-12">
        <NavItem icon={<Home size={26} />} label="হোম ফিড" active={activeView === 'USER'} onClick={() => setActiveView('USER')} />
        <NavItem icon={<TrendingUp size={26} />} label="ব্রেকিং নিউজ" active={activeView === 'TRENDING'} onClick={() => setActiveView('TRENDING')} />
        <NavItem icon={<Bookmark size={26} />} label="সেভ করা খবর" active={activeView === 'SAVED'} onClick={() => setActiveView('SAVED')} />
        
        {/* Live TV Button Hub */}
        <NavItem icon={<Tv size={26} />} label="লাইভ নিউজ টিভি" onClick={() => window.open('https://www.youtube.com/results?search_query=bangla+news+live', '_blank')} />
        
        <NavItem icon={<PlusCircle size={26} />} label="নিউজ পোস্ট" active={activeView === 'POST_NEWS'} onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} />
        
        {currentUser?.role === 'admin' && (
          <div className="pt-12 border-t border-white/5 mt-12">
            <NavItem icon={<Shield size={26} />} label="অ্যাডমিন প্যানেল" active={activeView === 'ADMIN'} onClick={() => setActiveView('ADMIN')} />
          </div>
        )}
      </nav>

      <div className="p-10">
        {currentUser ? (
          <div className="glass p-6 rounded-[2.5rem] gold-border flex flex-col gap-5 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-primary border border-gold-primary/30">
                <UserCircle size={28} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] font-black luxury-text uppercase tracking-widest">{currentUser.role} Account</p>
              </div>
            </div>
            <button onClick={onLogout} className="text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest text-center border border-rose-500/10 py-3 rounded-xl transition-all">Log Out</button>
          </div>
        ) : (
          <button onClick={() => setActiveView('LOGIN')} className="w-full py-5 gold-btn rounded-3xl shadow-2xl shadow-gold-primary/20 transition-all hover:scale-105 active:scale-95 uppercase font-black text-xs tracking-widest">
            Log In Premium
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen luxury-gradient flex">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-28 border-b border-white/5 flex items-center justify-between px-10 md:px-16 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-[60]">
          <div className="relative max-w-2xl w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-primary" size={22} />
            <input 
              type="text" 
              placeholder="পছন্দের টপিক অনুসন্ধান করুন..." 
              className="w-full bg-white/5 border border-white/10 rounded-3xl py-4.5 pl-16 pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary transition-all gold-border font-medium"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-8">
             <button className="relative p-4 bg-white/5 rounded-2xl gold-border group transition-all hover:bg-white/10">
                <Bell size={24} className="text-slate-400 group-hover:text-gold-primary transition-colors" />
                <span className="absolute top-3 right-3 w-3 h-3 bg-gold-primary rounded-full animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.8)]"></span>
             </button>
          </div>
        </header>

        {/* Ticker Section */}
        <div className="bg-slate-950 border-b border-gold-primary/10 py-3 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[scroll_50s_linear_infinite] text-[11px] font-black luxury-text uppercase tracking-widest">
             <span className="mx-16">• INFOVIBE PREMIUM AI AGGREGATOR IS NOW LIVE</span>
             <span className="mx-16">• LUXURY GOLDEN INTERFACE UPDATED WITH GLASSMORPHISM</span>
             <span className="mx-16">• REAL-TIME FACEBOOK BREAKING NEWS HUB ADDED</span>
             <span className="mx-16">• ENJOY AD-FREE IN-APP READING EXPERIENCE</span>
             <span className="mx-16">• SAVE NEWS FEATURE NOW FULLY OPERATIONAL</span>
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-150%); }
            }
          `}</style>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-16 custom-scrollbar">
          {children}
        </div>
      </main>

      {isMobile && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg h-24 glass rounded-[3rem] flex items-center justify-around px-6 z-[100] shadow-2xl gold-border border border-white/10">
          <button onClick={() => setActiveView('USER')} className={`p-5 rounded-2xl transition-all ${activeView === 'USER' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><Home size={28} /></button>
          <button onClick={() => setActiveView('TRENDING')} className={`p-5 rounded-2xl transition-all ${activeView === 'TRENDING' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><TrendingUp size={28} /></button>
          <button onClick={() => setActiveView('SAVED')} className={`p-5 rounded-2xl transition-all ${activeView === 'SAVED' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><Bookmark size={28} /></button>
          <button onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} className={`p-5 rounded-2xl transition-all ${activeView === 'POST_NEWS' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><PlusCircle size={28} /></button>
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-6 px-8 py-6 rounded-[2rem] transition-all duration-300 ${active ? 'bg-gold-primary text-black shadow-2xl shadow-gold-primary/30 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-gold-primary'}`}>
    {icon} <span className="font-black text-[11px] uppercase tracking-[0.25em]">{label}</span>
  </button>
);

export default Layout;
