
import React, { useState } from 'react';
import { validateAndProcessUserPost } from '../services/geminiService';
import { NewsItem, User } from '../types';
import { Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface PostNewsProps {
  onPostAdded: (post: NewsItem) => void;
  currentUser: User;
}

const PostNews: React.FC<PostNewsProps> = ({ onPostAdded, currentUser }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!title || !content || !source) {
      setError('সবগুলো ঘর পূরণ করুন।');
      return;
    }

    setLoading(true);
    setError('');

    const aiResult = await validateAndProcessUserPost(title, content, source);

    if (aiResult.isValid) {
      const newPost: NewsItem = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        link: '#',
        pubDate: new Date().toISOString(),
        content,
        summary: aiResult.summary,
        source: source,
        category: aiResult.category || 'General',
        imageUrl: `https://picsum.photos/seed/${Math.random()}/800/600`,
        country: aiResult.country || 'Global',
        postedBy: currentUser.name,
        isTrending: false
      };
      onPostAdded(newPost);
    } else {
      setError('এআই আপনার পোস্টটি ভেরিফাই করতে পারেনি। অনুগ্রহ করে সঠিক নিউজ প্রদান করুন।');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="glass p-8 rounded-[2.5rem] border border-white/10">
        <h2 className="text-3xl font-bold text-white mb-6">নতুন নিউজ পোস্ট করুন</h2>
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">নিউজের শিরোনাম</label>
            <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="শিরোনাম লিখুন..." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">বিস্তারিত খবর</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="খবরের বিস্তারিত লিখুন..." />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">নিউজের উৎস (Source)</label>
            <input value={source} onChange={e => setSource(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="যেমন: নিজস্ব প্রতিবেদক, বিবিসি..." />
          </div>

          {error && <p className="text-rose-400 text-sm flex items-center gap-2"><AlertCircle size={16} /> {error}</p>}

          <button onClick={handlePost} disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {loading ? 'এআই ভেরিফাই করছে...' : 'নিউজ পাবলিশ করুন'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostNews;
