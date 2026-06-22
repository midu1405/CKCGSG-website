export interface Project {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  images?: string[];
  youtubeUrl?: string;
  date?: string;
  status: 'upcoming' | 'archived';
}
