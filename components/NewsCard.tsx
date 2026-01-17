
import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Play, Pause, Bookmark, BookmarkCheck, ExternalLink, Share2, TrendingUp, Globe } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  onSave: (id: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onSave }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSpeech = () => {
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

  return (
    <div className="glass rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 group flex flex-col h-full border border-white/5 hover:border-indigo-500/20">
      <div className="relative h-48 overflow-hidden">
        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-indigo-600/90 text-white uppercase tracking-wider">{news.source}</span>
          {news.country && (
            <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-slate-800/90 text-white flex items-center gap-1 uppercase">
              <Globe size={10} /> {news.country}
            </span>
          )}
        </div>

        {news.isTrending && (
          <div className="absolute top-3 right-3">
             <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold animate-pulse">
                <TrendingUp size={10} /> TRENDING
             </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug">{news.title}</h3>
        <p className="text-slate-400 text-sm font-light leading-relaxed line-clamp-3">{news.summary}</p>
        
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/5">
          <div className="flex gap-2">
            <button onClick={toggleSpeech} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all">
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={() => onSave(news.id)} className={`p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-all ${news.isSaved ? 'text-indigo-400' : 'text-white'}`}>
              {news.isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            </button>
          </div>
          <a href={news.link} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all">
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
