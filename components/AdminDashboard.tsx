
import React, { useState } from 'react';
import { User, NewsSource } from '../types';
import { RSS_SOURCES } from '../constants';
import { Users, ShieldAlert, Trash2, CheckCircle, Activity, Database, Globe, Power, PowerOff, Settings, Bell } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Rahim Ahmed', email: 'rahim@example.com', status: 'active', role: 'user' },
    { id: '2', name: 'Karim Ullah', email: 'karim@example.com', status: 'active', role: 'user' },
    { id: '3', name: 'Suspicious Bot', email: 'bot@spam.com', status: 'suspended', role: 'user' },
  ]);

  const [sources, setSources] = useState<NewsSource[]>(RSS_SOURCES);

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const toggleSource = (name: string) => {
    setSources(sources.map(s => s.name === name ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">সিস্টেম অ্যাডমিনিস্ট্রেশন</h1>
          <p className="text-slate-500 mt-1 font-medium">InfoVibe প্ল্যাটফর্মের পূর্ণ নিয়ন্ত্রণ এখানে।</p>
        </div>
        <div className="flex gap-3">
           <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Settings size={20} /></button>
           <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Bell size={20} /></button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-blue-400" />} label="মোট নিবন্ধিত ইউজার" value={users.length.toString()} trend="+12% গত মাসে" />
        <StatCard icon={<Globe className="text-emerald-400" />} label="সক্রিয় নিউজ সোর্স" value={sources.filter(s => s.active).length.toString()} trend="রিয়েল-টাইম কানেক্টেড" />
        <StatCard icon={<Activity className="text-amber-400" />} label="এআই এপিআই স্ট্যাটাস" value="99.9%" trend="Gemini-3-Flash" />
        <StatCard icon={<Database className="text-indigo-400" />} label="সার্ভার লোড" value="24ms" trend="অপ্টিমাইজড" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Users className="text-indigo-500" size={24} /> ইউজার ম্যানেজমেন্ট
            </h2>
            <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">লাইভ ডাটা</span>
          </div>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5 group hover:border-indigo-500/30 transition-all">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${user.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                  <div>
                    <p className="text-white font-bold">{user.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleUserStatus(user.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${user.status === 'active' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}>
                    {user.status === 'active' ? 'SUSPEND' : 'ACTIVATE'}
                  </button>
                  <button className="p-2.5 text-slate-600 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Management */}
        <div className="glass p-8 rounded-[2.5rem] border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Globe className="text-emerald-500" size={24} /> সোর্স কন্ট্রোল
            </h2>
            <button className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">সবগুলো দেখুন</button>
          </div>
          <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {sources.map(source => (
              <div key={source.name} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${source.active ? 'bg-white/5 border-white/5' : 'bg-black/20 border-rose-500/10 opacity-60'}`}>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{source.name}</span>
                  <span className="text-[9px] text-slate-600 font-mono truncate max-w-[200px]">{source.url}</span>
                </div>
                <button 
                  onClick={() => toggleSource(source.name)} 
                  className={`p-2.5 rounded-xl transition-all ${source.active ? 'text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white' : 'text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white'}`}
                >
                  {source.active ? <Power size={18} /> : <PowerOff size={18} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend }: any) => (
  <div className="glass p-7 rounded-[2.5rem] border border-white/5 group hover:border-indigo-500/20 transition-all relative overflow-hidden">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
    <div className="p-3 bg-white/5 rounded-2xl w-fit mb-4">{icon}</div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <h4 className="text-3xl font-black text-white">{value}</h4>
      <span className="text-[10px] text-indigo-400 font-bold">{trend}</span>
    </div>
  </div>
);

export default AdminDashboard;
