
import { NewsSource } from './types';
import { Gavel, Cpu, Trophy, Music, Newspaper } from 'lucide-react';

export const RSS_SOURCES: NewsSource[] = [
  // National News (Bangladesh)
  { name: 'Prothom Alo', url: 'https://www.prothomalo.com/feed/rss/all', active: true },
  { name: 'The Daily Star', url: 'https://www.thedailystar.net/frontpage/rss.xml', active: true },
  { name: 'bdnews24.com', url: 'https://bangla.bdnews24.com/?widgetName=rssfeed&widgetId=1151&getXmlFeed=true', active: true },
  { name: 'Jagonews24', url: 'https://www.jagonews24.com/rss/rss.xml', active: true },
  { name: 'Banglanews24', url: 'https://www.banglanews24.com/rss/all', active: true },
  { name: 'Jugantor', url: 'https://www.jugantor.com/feed/rss.xml', active: true },
  { name: 'Dhaka Tribune', url: 'https://www.dhakatribune.com/feed', active: true },
  
  // TV Channels
  { name: 'Somoy TV', url: 'https://www.somoynews.tv/rss/all', active: true },
  { name: 'Jamuna TV', url: 'https://www.jamuna.tv/rss/all', active: true },
  { name: 'Independent TV', url: 'https://www.itvbd.com/feed', active: true },
  
  // International News
  { name: 'BBC Bangla', url: 'https://www.bbc.com/bengali/index.xml', active: true },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', active: true },
  { name: 'CNN', url: 'http://rss.cnn.com/rss/edition.rss', active: true },
  { name: 'NY Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', active: true },
  
  // Education & Sports
  { name: 'Daily Shiksha', url: 'https://www.dailyshiksha.com/rss.xml', active: true },
  { name: 'PA Sports', url: 'https://en.prothomalo.com/feed/rss/sports', active: true },
  { name: 'Risingbd Sports', url: 'https://www.risingbd.com/rss/all', active: true }
];

export const CATEGORIES = [
  { name: 'All', icon: Newspaper },
  { name: 'Politics', icon: Gavel },
  { name: 'Tech', icon: Cpu },
  { name: 'Sports', icon: Trophy },
  { name: 'Entertainment', icon: Music },
  { name: 'General', icon: Newspaper }
];
