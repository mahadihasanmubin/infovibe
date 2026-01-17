
import React, { useState, useEffect } from 'react';
import { NewsItem, Comment } from '../types';
import { Play, Pause, Bookmark, BookmarkCheck, Share2, MessageCircle, X, Send, Clock, User, ExternalLink, ChevronRight } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onSave: (id: string) => void;
  isSaved: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onSave, isSaved }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullView, setIsFullView] = useState(false);
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(`comments_${news.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    localStorage.setItem(`comments_${news.id}`, JSON.stringify(comments));
  }, [comments, news.id]);

  const toggleSpeech = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(news.summary);
      utterance.lang = 'bn-BD';
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: Date.now().toString(),
      userName: 'ভিজিটর ' + Math.floor(Math.random() * 100),
      text: newComment,
      date: new Date().toLocaleString('bn-BD')
    };
    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <>
      <div 
        onClick={() => setIsFullView(true)}
        className="glass rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.03] gold-border group flex flex-col h-full cursor-pointer relative shadow-2xl"
      >
        <div className="relative h-64 overflow-hidden">
          <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-4 py-1.5 text-[11px] font-black rounded-full gold-btn uppercase tracking-widest shadow-lg border border-white/20">{news.source}</span>
          </div>
        </div>

        <div className="p-7 space-y-4 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-white leading-tight luxury-text line-clamp-2">{news.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 font-medium">{news.summary}</p>
          
          <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/5">
            <div className="flex gap-4">
              <button onClick={toggleSpeech} className="p-3 rounded-2xl bg-white/5 hover:bg-gold-primary/20 text-gold-primary transition-all gold-border">
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onSave(news.id); }} 
                className={`p-3 rounded-2xl bg-white/5 transition-all gold-border ${isSaved ? 'text-gold-primary bg-gold-primary/10' : 'text-slate-500 hover:text-white'}`}
              >
                {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <MessageCircle size={16} className="text-gold-primary" /> {comments.length} মতামত
            </div>
          </div>
        </div>
      </div>

      {/* Full Modal View - No Redirect Needed */}
      {isFullView && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl" onClick={() => setIsFullView(false)} />
          <div className="relative w-full max-w-5xl h-full max-h-[95vh] glass rounded-[3rem] flex flex-col overflow-hidden gold-border shadow-[0_0_100px_rgba(212,175,55,0.1)]">
            <button onClick={() => setIsFullView(false)} className="absolute top-8 right-8 p-4 bg-white/10 hover:bg-rose-500/20 text-white rounded-full z-10 transition-all border border-white/10">
              <X size={28} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-16">
              <div className="max-w-3xl mx-auto space-y-12">
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl gold-border h-80 md:h-[450px]">
                  <img src={news.imageUrl} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-5">
                    <span className="px-6 py-2 rounded-full gold-btn text-[10px] tracking-[0.2em] font-black uppercase">{news.source}</span>
                    <span className="text-slate-500 text-[10px] font-black flex items-center gap-2 uppercase tracking-[0.1em]"><Clock size={16} className="text-gold-primary"/> {new Date(news.pubDate).toLocaleString('bn-BD')}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white luxury-text leading-[1.15]">{news.title}</h1>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-xl md:text-2xl text-gold-primary/90 font-bold leading-relaxed mb-10 italic border-l-4 border-gold-primary pl-8 bg-gold-primary/5 py-6 rounded-r-3xl">
                    সারসংক্ষেপ: {news.summary}
                  </div>
                  <div className="text-slate-300 text-lg md:text-xl leading-[2.2] space-y-10 font-medium tracking-wide">
                    {news.content.split('\n').map((para, i) => para && <p key={i} className="mb-6">{para}</p>)}
                  </div>
                </div>

                <div className="pt-10 flex flex-wrap gap-5">
                   <a href={news.link} target="_blank" rel="noopener noreferrer" className="gold-btn px-10 py-5 rounded-[2rem] flex items-center gap-3 text-sm font-black uppercase tracking-widest shadow-2xl">
                     সংবাদ পোর্টালে ভিজিট করুন <ExternalLink size={20} />
                   </a>
                </div>

                <hr className="border-white/5 my-20" />

                {/* Comment Section Hub */}
                <div className="space-y-12 pb-20">
                  <h3 className="text-3xl font-black text-white flex items-center gap-5 uppercase tracking-widest">
                    <div className="p-4 bg-gold-primary/10 rounded-2xl text-gold-primary"><MessageCircle size={32} /></div>
                    পাঠকদের মন্তব্য ({comments.length})
                  </h3>
                  
                  <div className="flex gap-4">
                    <input 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="আপনার চিন্তাভাবনা শেয়ার করুন..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-[1.5rem] px-8 py-6 text-white focus:outline-none focus:ring-2 focus:ring-gold-primary transition-all gold-border text-lg"
                    />
                    <button onClick={handleAddComment} className="px-10 gold-btn rounded-[1.5rem] shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      <Send size={28} />
                    </button>
                  </div>

                  <div className="space-y-8">
                    {comments.length > 0 ? comments.map(c => (
                      <div key={c.id} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 flex gap-6 animate-in slide-in-from-bottom-4">
                        <div className="w-14 h-14 rounded-full bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center text-gold-primary shadow-inner">
                          <User size={30} />
                        </div>
                        <div className="space-y-2">
                          <p className="text-gold-primary text-xs font-black uppercase tracking-[0.2em]">{c.userName} • {c.date}</p>
                          <p className="text-slate-200 text-lg font-medium leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center glass rounded-[3rem] border-dashed border-white/10">
                         <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">এখনো কেউ মন্তব্য করেনি। প্রথম মন্তব্যটি আপনার হোক!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsCard;
