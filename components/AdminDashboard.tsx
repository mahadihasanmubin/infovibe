
import React, { useState, useEffect } from 'react';
import { User, NewsSource } from '../types';
import { RSS_SOURCES as INITIAL_RSS } from '../constants';
import { Users, Trash2, Globe, Power, PowerOff, Settings, Bell, Plus, Link as LinkIcon, Database, Activity, ShieldCheck, Zap } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Rahim Ahmed', email: 'rahim@example.com', status: 'active', role: 'user' },
    { id: '2', name: 'Karim Ullah', email: 'karim@example.com', status: 'active', role: 'user' },
    { id: '3', name: 'Suspicious Bot', email: 'bot@spam.com', status: 'suspended', role: 'user' },
  ]);

  const [sources, setSources] = useState<NewsSource[]>(() => {
    const saved = localStorage.getItem('infovibe_custom_sources');
    return saved ? JSON.parse(saved) : INITIAL_RSS;
  });
  
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('infovibe_custom_sources', JSON.stringify(sources));
  }, [sources]);

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const toggleSource = (name: string) => {
    setSources(sources.map(s => s.name === name ? { ...s, active: !s.active } : s));
  };

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSourceName && newSourceUrl) {
      setSources([{ name: newSourceName, url: newSourceUrl, active: true }, ...sources]);
      setNewSourceName('');
      setNewSourceUrl('');
    }
  };

  const removeSource = (name: string) => {
    setSources(sources.filter(s => s.name !== name));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-white/5">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter luxury-text">সিস্টেম কন্ট্রোল</h1>
          <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.3em] text-[10px]">InfoVibe Aggregator Administration</p>
        </div>
        <div className="flex gap-4">
           <button className="p-4 glass rounded-2xl gold-border text-slate-400 hover:text-gold-primary transition-all"><Settings size={22} /></button>
           <button className="p-4 glass rounded-2xl gold-border text-slate-400 hover:text-gold-primary transition-all relative">
              <Bell size={22} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-gold-primary rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"></span>
           </button>
        </div>
      </header>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard icon={<Users className="text-gold-primary" />} label="নিবন্ধিত গ্রাহক" value={users.length.toString()} trend="+5 আজ" />
        <StatCard icon={<Globe className="text-emerald-400" />} label="সক্রিয় সোর্স" value={sources.filter(s => s.active).length.toString()} trend="রিয়েল-টাইম" />
        <StatCard icon={<Activity className="text-blue-400" />} label="এআই হেলথ" value="99.9%" trend="স্ট্যাবল" />
        <StatCard icon={<Zap className="text-amber-400" />} label="ডেটা লোড" value="32ms" trend="অপ্টিমাইজড" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-10">
          {/* RSS Feed Management */}
          <div className="glass p-10 rounded-[3rem] gold-border space-y-8">
            <h2 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-widest">
              <Plus className="text-gold-primary" size={28} /> নিউজ সোর্স যোগ করুন
            </h2>
            <form onSubmit={handleAddSource} className="space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div className="relative group">
                  <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-primary" size={18} />
                  <input 
                    type="text" 
                    placeholder="পোর্টারের নাম (যেমন: বিবিসি)" 
                    value={newSourceName}
                    onChange={e => setNewSourceName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary transition-all gold-border"
                  />
                </div>
                <div className="relative group">
                  <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-gold-primary" size={18} />
                  <input 
                    type="url" 
                    placeholder="RSS লিঙ্ক (URL)" 
                    value={newSourceUrl}
                    onChange={e => setNewSourceUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white focus:outline-none focus:ring-2 focus:ring-gold-primary transition-all gold-border"
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-5 gold-btn rounded-2xl shadow-xl shadow-gold-primary/10 transition-all hover:scale-[1.02] active:scale-95 text-xs font-black uppercase tracking-[0.2em]">
                সোর্স কানেক্ট করুন
              </button>
            </form>
          </div>

          {/* Connected Sources List */}
          <div className="glass p-10 rounded-[3rem] gold-border space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-widest">
                <ShieldCheck className="text-emerald-500" size={28} /> সক্রিয় নেটওয়ার্ক
              </h2>
            </div>
            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-3 custom-scrollbar">
              {sources.map(source => (
                <div key={source.name} className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${source.active ? 'bg-white/5 border-white/5' : 'bg-black/40 border-rose-500/10 opacity-50'}`}>
                  <div className="flex flex-col min-w-0 pr-4">
                    <span className="text-sm font-black text-white truncate">{source.name}</span>
                    <span className="text-[10px] text-slate-600 font-mono truncate">{source.url}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleSource(source.name)} 
                      className={`p-3 rounded-xl transition-all ${source.active ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}
                    >
                      {source.active ? <Power size={20} /> : <PowerOff size={20} />}
                    </button>
                    <button onClick={() => removeSource(source.name)} className="p-3 rounded-xl text-slate-600 hover:text-rose-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Governance */}
        <div className="glass p-10 rounded-[3rem] gold-border h-fit space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-widest">
              <Users className="text-gold-primary" size={28} /> ইউজার মডারেশন
            </h2>
            <span className="px-4 py-1.5 rounded-full bg-gold-primary/10 text-gold-primary text-[10px] font-black uppercase tracking-widest border border-gold-primary/20">Active Session</span>
          </div>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-3 custom-scrollbar">
            {users.map(user => (
              <div key={user.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 group hover:border-gold-primary/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-5">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]'}`} />
                  <div>
                    <p className="text-white font-black text-base">{user.name}</p>
                    <p className="text-xs text-slate-500 font-bold tracking-tight">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={() => toggleUserStatus(user.id)} className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${user.status === 'active' ? 'bg-rose-600/10 text-rose-500 hover:bg-rose-600 hover:text-white' : 'bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white'}`}>
                    {user.status === 'active' ? 'SUSPEND' : 'ACTIVATE'}
                  </button>
                  <button className="p-3 text-slate-600 hover:text-rose-500 rounded-xl transition-all"><Trash2 size={20} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="glass p-8 rounded-[2.5rem] border border-white/5 group hover:border-gold-primary/30 transition-all relative overflow-hidden">
    <div className="absolute -right-6 -top-6 w-32 h-32 bg-gold-primary/5 rounded-full blur-3xl group-hover:bg-gold-primary/10 transition-all"></div>
    <div className="p-4 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform gold-border">{icon}</div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{label}</p>
    <div className="flex items-baseline gap-3">
      <h4 className="text-4xl font-black text-white">{value}</h4>
      <span className="text-[11px] text-gold-primary font-black uppercase tracking-tighter">{trend}</span>
    </div>
  </div>
);

export default AdminDashboard;
