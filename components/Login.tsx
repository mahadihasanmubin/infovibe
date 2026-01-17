
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const ADMIN_EMAIL = 'mahadihasanmubin001@gmail.com';
  const ADMIN_PASS = '!@#$1234567$#@!';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('দয়া করে ইমেইল এবং পাসওয়ার্ড ঘর পূরণ করুন।');
      return;
    }

    let role: 'user' | 'admin' = 'user';
    let finalName = name.trim();
    
    // Exact Admin Match Logic
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      if (password === ADMIN_PASS) {
        role = 'admin';
        // Admin default name if not provided
        if (!finalName) finalName = 'Super Admin';
      } else {
        setError('ভুল পাসওয়ার্ড! আপনি কি অ্যাডমিন হিসেবে প্রবেশের চেষ্টা করছেন?');
        return;
      }
    }

    // Default user name if not provided
    if (!finalName) finalName = 'Guest User';

    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      name: finalName,
      email: email.trim().toLowerCase(),
      status: 'active',
      role: role
    });
  };

  return (
    <div className="max-w-md mx-auto py-12 md:py-20 px-4 animate-in zoom-in duration-500">
      <div className="glass p-8 md:p-12 rounded-[3.5rem] text-center border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-600/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-indigo-600 mb-8 shadow-2xl shadow-indigo-600/40 border border-white/20">
            <ShieldCheck className="text-white" size={40} />
          </div>

          <h2 className="text-4xl font-black text-white mb-3 tracking-tight">প্রবেশ করুন</h2>
          <p className="text-slate-500 text-sm mb-10 font-medium">আপনার প্রোফাইল সেটআপ করুন</p>
          
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">আপনার নাম (ঐচ্ছিক)</label>
              <div className="relative group">
                 <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                 <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all outline-none placeholder:text-slate-700 font-medium" 
                  placeholder="যেমন: মাহাদি হাসান" 
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">ইমেইল ঠিকানা</label>
              <div className="relative group">
                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                 <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all outline-none placeholder:text-slate-700 font-medium" 
                  placeholder="example@mail.com" 
                 />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">সিক্রেট পাসওয়ার্ড</label>
              <div className="relative group">
                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                 <input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all outline-none placeholder:text-slate-700 font-medium" 
                  placeholder="••••••••" 
                 />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-400/10 p-4 rounded-xl border border-rose-400/20 animate-shake">
                <AlertCircle size={16} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
              চালিয়ে যান <ArrowRight size={20} />
            </button>
            
            <button type="button" onClick={onBack} className="w-full py-2 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors">
              পাবলিক মোডে ফিরে যান
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
