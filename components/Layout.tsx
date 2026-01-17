
import React, { useState, useEffect, useRef } from 'react';
import { Home, Bookmark, Shield, TrendingUp, PlusCircle, LogOut, Search, UserCircle, Zap, Bell, Tv, Twitter, Facebook, X as CloseIcon, Info } from 'lucide-react';
import { AppView, User, Notification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  onSearch: (q: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  tickerItems?: string[];
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, onSearch, currentUser, onLogout, tickerItems = [] }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'ব্রেকিং: রাজধানীসহ ৫ জেলায় ভারী বৃষ্টির পূর্বাভাস', time: '২ মিনিট আগে', isRead: false, type: 'breaking' },
    { id: '2', title: 'টুইটারে নতুন ট্রেন্ড: #InfoVibe প্রযুক্তিতে বিপ্লব', time: '১০ মিনিট আগে', isRead: false, type: 'social' },
    { id: '3', title: 'সিস্টেম আপডেট: গোল্ডেন লাক্সারি ইন্টারফেস এখন লাইভ', time: '১ ঘণ্টা আগে', isRead: true, type: 'system' }
  ]);
  
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const Sidebar = () => (
    <aside className="w-80 border-r border-white/5 flex flex-col bg-slate-950 sticky top-0 h-screen z-50">
      <div className="p-12 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-[1.5rem] gold-btn flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-shine">
          <span className="text-black font-black text-4xl">I</span>
        </div>
        <span className="font-black text-4xl tracking-tighter text-white">Info<span className="luxury-text">Vibe</span></span>
      </div>

      <nav className="flex-1 px-8 space-y-4 mt-8">
        <NavItem icon={<Home size={26} />} label="হোম ফিড" active={activeView === 'USER'} onClick={() => setActiveView('USER')} />
        <NavItem icon={<TrendingUp size={26} />} label="ব্রেকিং নিউজ" active={activeView === 'TRENDING'} onClick={() => setActiveView('TRENDING')} />
        <NavItem icon={<Bookmark size={26} />} label="সেভ করা খবর" active={activeView === 'SAVED'} onClick={() => setActiveView('SAVED')} />
        
        <div className="pt-6 border-t border-white/5 mt-6">
           <p className="px-8 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-4">Social Connect</p>
           <NavItem icon={<Facebook size={26} className="text-blue-500" />} label="ফেসবুক ফিড" onClick={() => setActiveView('USER')} />
           <NavItem icon={<Twitter size={26} className="text-sky-400" />} label="টুইটার (X) ট্রেন্ড" onClick={() => setActiveView('USER')} />
           <NavItem icon={<Tv size={26} className="text-gold-primary" />} label="লাইভ নিউজ টিভি" onClick={() => window.open('https://www.youtube.com/results?search_query=bangla+news+live', '_blank')} />
        </div>
        
        <NavItem icon={<PlusCircle size={26} />} label="নিউজ পোস্ট" active={activeView === 'POST_NEWS'} onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} />
        
        {currentUser?.role === 'admin' && (
          <div className="pt-8 border-t border-white/5 mt-8">
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

  const defaultTickerItems = [
    "ইনফোবাইভ প্রিমিয়াম এআই এগ্রিগেটর এখন সচল",
    "টুইটার (X) এবং ফেসবুক রিয়েল-টাইম ফিড যুক্ত করা হয়েছে",
    "লাক্সারি গোল্ডেন ইন্টারফেস আপডেট করা হয়েছে",
    "অ্যাড-মুক্ত ইন-অ্যাপ পড়ার অভিজ্ঞতা উপভোগ করুন",
    "সংবাদ সেভ করার সুবিধা এখন পুরোদমে সচল"
  ];

  const currentTicker = tickerItems.length > 0 ? tickerItems : defaultTickerItems;

  return (
    <div className="min-h-screen luxury-gradient flex flex-col md:flex-row">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 md:h-28 border-b border-white/5 flex items-center justify-between px-4 md:px-16 bg-slate-950/40 backdrop-blur-3xl sticky top-0 z-[60]">
          {isMobile && (
            <div className="flex items-center space-x-2 mr-4 flex-shrink-0">
               <div className="w-10 h-10 rounded-xl gold-btn flex items-center justify-center">
                 <span className="text-black font-black text-xl">I</span>
               </div>
               <span className="font-black text-lg tracking-tighter text-white">Info<span className="luxury-text">Vibe</span></span>
            </div>
          )}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-gold-primary" size={isMobile ? 18 : 22} />
            <input 
              type="text" 
              placeholder={isMobile ? "অনুসন্ধান..." : "পছন্দের টপিক অনুসন্ধান করুন..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl py-3 md:py-4.5 pl-12 md:pl-16 pr-4 md:pr-8 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary transition-all gold-border font-medium"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4 md:gap-8 ml-4 relative" ref={notificationRef}>
             <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl transition-all gold-border group ${showNotifications ? 'bg-gold-primary/20 text-gold-primary' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
             >
                <Bell size={isMobile ? 18 : 24} className={showNotifications ? 'text-gold-primary' : 'group-hover:text-gold-primary transition-colors'} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 md:top-3 md:right-3 w-2.5 h-2.5 md:w-3.5 md:h-3.5 bg-rose-600 border-2 border-slate-950 rounded-full flex items-center justify-center text-[7px] font-bold text-white shadow-lg">
                    {unreadCount}
                  </span>
                )}
             </button>

             {/* Notification Dropdown - Background changed to Black */}
             {showNotifications && (
               <div className="absolute top-full right-0 mt-4 w-[320px] md:w-[400px] bg-black rounded-[2rem] gold-border shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
                 <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.05]">
                   <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                     <Zap size={16} className="text-gold-primary" /> নোটিফিকেশন
                   </h3>
                   <button onClick={markAllRead} className="text-[10px] font-black text-gold-primary hover:opacity-70 uppercase tracking-widest">Mark as Read</button>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-black">
                   {notifications.length > 0 ? notifications.map(notif => (
                     <div key={notif.id} className={`p-6 border-b border-white/5 hover:bg-white/[0.08] transition-all cursor-pointer relative ${!notif.isRead ? 'bg-gold-primary/[0.05]' : ''}`}>
                       {!notif.isRead && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>}
                       <div className="flex gap-4">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 h-fit ${notif.type === 'breaking' ? 'bg-rose-600/10 text-rose-500' : notif.type === 'social' ? 'bg-sky-400/10 text-sky-400' : 'bg-gold-primary/10 text-gold-primary'}`}>
                            {notif.type === 'breaking' ? <Zap size={16} /> : notif.type === 'social' ? <Twitter size={16} /> : <Info size={16} />}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-slate-200 leading-snug mb-2">{notif.title}</p>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{notif.time}</span>
                          </div>
                       </div>
                     </div>
                   )) : (
                     <div className="p-20 text-center bg-black">
                        <Bell size={40} className="text-slate-800 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">কোনো নতুন বার্তা নেই</p>
                     </div>
                   )}
                 </div>
                 <div className="p-4 bg-white/[0.03] text-center border-t border-white/5">
                   <button className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-gold-primary transition-colors">সকল নোটিফিকেশন দেখুন</button>
                 </div>
               </div>
             )}
          </div>
        </header>

        {/* Ticker Section */}
        <div className="bg-slate-950 border-b border-gold-primary/10 py-2.5 overflow-hidden whitespace-nowrap">
          <div className="inline-block animate-[scroll_60s_linear_infinite] text-[9px] md:text-[11px] font-black luxury-text uppercase tracking-widest">
             {currentTicker.map((item, idx) => (
               <span key={idx} className="mx-8 md:mx-16">• {item.toUpperCase()}</span>
             ))}
          </div>
          <style>{`
            @keyframes scroll {
              0% { transform: translateX(100vw); }
              100% { transform: translateX(-150%); }
            }
          `}</style>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-16 custom-scrollbar pb-32 md:pb-16">
          {children}
        </div>
      </main>

      {isMobile && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-lg h-20 glass rounded-[2.5rem] flex items-center justify-around px-4 z-[100] shadow-2xl gold-border border border-white/10">
          <button onClick={() => setActiveView('USER')} className={`p-4 rounded-xl transition-all ${activeView === 'USER' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><Home size={24} /></button>
          <button onClick={() => setActiveView('TRENDING')} className={`p-4 rounded-xl transition-all ${activeView === 'TRENDING' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><TrendingUp size={24} /></button>
          <button onClick={() => setActiveView('SAVED')} className={`p-4 rounded-xl transition-all ${activeView === 'SAVED' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><Bookmark size={24} /></button>
          <button onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} className={`p-4 rounded-xl transition-all ${activeView === 'POST_NEWS' ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500'}`}><PlusCircle size={24} /></button>
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
