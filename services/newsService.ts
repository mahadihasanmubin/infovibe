
import { NewsItem, NewsSource } from '../types';
import { summarizeNews, categorizeNews } from './geminiService';

// ৩টি ভিন্ন প্রক্সি সোর্স যাতে একটি ফেইল করলে অন্যটি কাজ করে
const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/'
];

export const fetchNewsFromSource = async (source: NewsSource): Promise<NewsItem[]> => {
  if (!source.active) return [];

  let lastError = null;
  
  for (const proxy of PROXY_URLS) {
    try {
      const fullUrl = proxy === PROXY_URLS[0] ? `${proxy}${encodeURIComponent(source.url)}` : `${proxy}${source.url}`;
      
      const response = await fetch(fullUrl, {
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(8000) // ৮ সেকেন্ড টাইমআউট
      });
      
      if (!response.ok) continue;
      
      const xmlString = await response.text();
      if (!xmlString || xmlString.trim().length < 100) continue;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      if (xmlDoc.getElementsByTagName('parsererror').length > 0) continue;

      const items = Array.from(xmlDoc.querySelectorAll('item, entry')).slice(0, 4);
      
      let sourceCountry = 'Global';
      const bdSources = ['Prothom Alo', 'The Daily Star', 'bdnews24.com', 'Jagonews24', 'Banglanews24', 'Jugantor', 'Kaler Kantho', 'Dhaka Tribune', 'Somoy TV', 'NTV Online', 'Independent TV', 'Channel 24', 'Jamuna TV', 'DBC News', 'Daily Shiksha', 'Ittefaq Education'];
      if (bdSources.includes(source.name)) {
        sourceCountry = 'Bangladesh';
      }

      const newsItems = await Promise.all(items.map(async (item) => {
        const title = item.querySelector('title')?.textContent || 'No Title';
        const link = item.querySelector('link')?.textContent || 
                     item.querySelector('link')?.getAttribute('href') || '#';
        const pubDate = item.querySelector('pubDate')?.textContent || 
                        item.querySelector('published')?.textContent || 
                        new Date().toISOString();
                        
        const description = item.querySelector('description')?.textContent || 
                            item.querySelector('content')?.textContent ||
                            item.querySelector('summary')?.textContent || '';
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const cleanContent = tempDiv.textContent || tempDiv.innerText || title;

        let imageUrl = '';
        const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
        
        if (!imageUrl || imageUrl.startsWith('/')) {
          imageUrl = `https://picsum.photos/seed/${encodeURIComponent(title.substring(0, 10))}/600/400`;
        }

        const category = await categorizeNews(title);
        const summary = await summarizeNews(title, cleanContent.slice(0, 500));

        return {
          id: Math.random().toString(36).substr(2, 9),
          title,
          link,
          pubDate,
          content: cleanContent,
          summary: summary,
          source: source.name,
          category: (category as any),
          imageUrl: imageUrl,
          isSaved: false,
          country: sourceCountry,
          isTrending: Math.random() > 0.85
        };
      }));

      return newsItems;
    } catch (error) {
      lastError = error;
      continue;
    }
  }

  return [];
};
