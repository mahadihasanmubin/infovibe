
import { NewsItem, NewsSource } from '../types';
import { summarizeNews, categorizeNews } from './geminiService';

const PROXY_URLS = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?'
];

// Helper to create stable ID from string
const generateStableId = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export const fetchNewsFromSource = async (source: NewsSource): Promise<NewsItem[]> => {
  if (!source.active) return [];

  for (const proxy of PROXY_URLS) {
    try {
      const fullUrl = `${proxy}${encodeURIComponent(source.url)}`;
      const response = await fetch(fullUrl, { signal: AbortSignal.timeout(10000) });
      
      if (!response.ok) continue;
      
      const xmlString = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const items = Array.from(xmlDoc.querySelectorAll('item, entry')).slice(0, 8);
      
      const newsItems = await Promise.all(items.map(async (item) => {
        const title = item.querySelector('title')?.textContent || 'No Title';
        const link = item.querySelector('link')?.textContent || 
                     item.querySelector('link')?.getAttribute('href') || '#';
        const pubDate = item.querySelector('pubDate')?.textContent || 
                        item.querySelector('published')?.textContent || 
                        new Date().toISOString();
                        
        const descriptionRaw = item.querySelector('description')?.textContent || 
                               item.querySelector('content')?.textContent ||
                               item.querySelector('summary')?.textContent || '';
        
        // Advanced Direct Image Extraction
        let imageUrl = '';
        const mediaContent = item.getElementsByTagName('media:content')[0];
        const mediaThumbnail = item.getElementsByTagName('media:thumbnail')[0];
        const enclosure = item.querySelector('enclosure');
        
        if (mediaContent?.getAttribute('url')) {
          imageUrl = mediaContent.getAttribute('url')!;
        } else if (enclosure?.getAttribute('url')) {
          imageUrl = enclosure.getAttribute('url')!;
        } else if (mediaThumbnail?.getAttribute('url')) {
          imageUrl = mediaThumbnail.getAttribute('url')!;
        } else {
          // Fallback: search <img> tag in description
          const imgMatch = descriptionRaw.match(/<img[^>]+src="([^">]+)"/);
          if (imgMatch) imageUrl = imgMatch[1];
        }
        
        // Final fallback to high quality placeholders if still empty
        if (!imageUrl || imageUrl.startsWith('/')) {
          imageUrl = `https://images.unsplash.com/photo-1585829365234-781fcd0d3065?auto=format&fit=crop&q=80&w=800&seed=${generateStableId(title)}`;
        }

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = descriptionRaw;
        const cleanContent = tempDiv.textContent || tempDiv.innerText || title;

        // Fetch AI processing
        const category = await categorizeNews(title);
        const summary = await summarizeNews(title, cleanContent.slice(0, 1000));

        return {
          id: generateStableId(link), 
          title,
          link,
          pubDate,
          content: cleanContent,
          summary: summary,
          source: source.name,
          category: (category as any),
          imageUrl: imageUrl,
          isSaved: false,
          country: 'Bangladesh',
          isTrending: Math.random() > 0.8,
          comments: []
        };
      }));

      return newsItems;
    } catch (error) {
      continue;
    }
  }
  return [];
};
