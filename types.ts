
export interface Comment {
  id: string;
  userName: string;
  text: string;
  date: string;
}

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
  comments?: Comment[];
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

export type AppView = 'USER' | 'ADMIN' | 'LOGIN' | 'POST_NEWS' | 'TRENDING' | 'SAVED';

export interface YoutubeVideo {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}
