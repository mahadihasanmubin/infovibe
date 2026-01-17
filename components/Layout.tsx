
import React, { useState, useEffect } from 'react';
import { Home, Compass, Bookmark, Settings, LayoutDashboard, UserCircle, Bell, Search, LogIn, PlusCircle, LogOut, Shield, TrendingUp, ShieldCheck } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Sidebar = () => (
    <aside className="w-64 border-r border-white/5 flex flex-col bg-slate-950/50 backdrop-blur-xl sticky top-0 h-screen">
      <div className="p-8 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/40">
          <span className="text-white font-bold text-xl">I</span>
        </div>
        <span className="font-bold text-2xl tracking-tight text-white">Info<span className="text-indigo-500">Vibe</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-8">
        <NavItem icon={<Home size={22} />} label="হোম" active={activeView === 'USER'} onClick={() => setActiveView('USER')} />
        <NavItem icon={<TrendingUp size={22} />} label="ট্রেন্ডিং" active={activeView === 'TRENDING'} onClick={() => setActiveView('TRENDING')} />
        <NavItem icon={<PlusCircle size={22} />} label="নিউজ পোস্ট" active={activeView === 'POST_NEWS'} onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} />
        
        {currentUser?.role === 'admin' && (
          <>
            <div className="pt-8 pb-4">
               <p className="px-4 text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">অ্যাডমিন কন্ট্রোল</p>
            </div>
            <NavItem icon={<Shield size={22} />} label="ড্যাশবোর্ড" active={activeView === 'ADMIN'} onClick={() => setActiveView('ADMIN')} />
          </>
        )}
      </nav>

      <div className="p-6">
        {currentUser ? (
          <div className="glass p-4 rounded-2xl flex flex-col space-y-3 border-indigo-500/20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <UserCircle className={`${currentUser.role === 'admin' ? 'text-indigo-400' : 'text-slate-400'}`} />
                {currentUser.role === 'admin' && <ShieldCheck className="absolute -top-1 -right-1 text-emerald-500" size={10} />}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                <p className={`text-[9px] font-black uppercase tracking-widest ${currentUser.role === 'admin' ? 'text-indigo-400' : 'text-slate-500'}`}>{currentUser.role}</p>
              </div>
            </div>
            <button onClick={onLogout} className="flex items-center space-x-2 text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest pt-1 border-t border-white/5 w-full">
              <LogOut size={12} /> <span>লগআউট</span>
            </button>
          </div>
        ) : (
          <button onClick={() => setActiveView('LOGIN')} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center space-x-2 font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
            <LogIn size={18} /> <span>লগইন করুন</span>
          </button>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen luxury-gradient flex">
      {!isMobile && <Sidebar />}
      
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-slate-950/20 backdrop-blur-md sticky top-0 z-50">
          <div className="relative max-w-xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="খবর খুঁজুন..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                PREMIUM AGGREGATOR
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">{children}</div>
      </main>

      {isMobile && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md h-16 glass rounded-[1.5rem] flex items-center justify-around px-2 z-50 shadow-2xl border-white/10">
          <button onClick={() => setActiveView('USER')} className={`p-3 rounded-xl transition-all ${activeView === 'USER' ? 'text-indigo-400 bg-white/5 scale-110 shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}><Home size={22} /></button>
          <button onClick={() => setActiveView('TRENDING')} className={`p-3 rounded-xl transition-all ${activeView === 'TRENDING' ? 'text-indigo-400 bg-white/5 scale-110 shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}><TrendingUp size={22} /></button>
          <button onClick={() => currentUser ? setActiveView('POST_NEWS') : setActiveView('LOGIN')} className={`p-3 rounded-xl transition-all ${activeView === 'POST_NEWS' ? 'text-indigo-400 bg-white/5 scale-110 shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}><PlusCircle size={22} /></button>
          {currentUser?.role === 'admin' && (
            <button onClick={() => setActiveView('ADMIN')} className={`p-3 rounded-xl transition-all ${activeView === 'ADMIN' ? 'text-indigo-400 bg-white/5 scale-110 shadow-lg shadow-indigo-500/10' : 'text-slate-500'}`}><Shield size={22} /></button>
          )}
          <button onClick={() => currentUser ? onLogout() : setActiveView('LOGIN')} className="p-3 rounded-xl text-slate-500">{currentUser ? <LogOut size={22} className="text-rose-400" /> : <LogIn size={22} />}</button>
        </nav>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/10' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
    {icon} <span className="font-bold text-sm tracking-tight">{label}</span>
  </button>
);

export default Layout;
