
export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  content: string;
  summary: string;
  source: string;
  category: 'Politics' | 'Tech' | 'Sports' | 'Entertainment' | 'General';
  imageUrl?: string;
  isSaved?: boolean;
  isTrending?: boolean;
  country: string;
  postedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'suspended';
  role: 'user' | 'admin';
}

export interface NewsSource {
  name: string;
  url: string;
  active: boolean;
}

export type AppView = 'USER' | 'ADMIN' | 'LOGIN' | 'POST_NEWS' | 'TRENDING';
