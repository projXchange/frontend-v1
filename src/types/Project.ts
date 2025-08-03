export interface Project {
  id: number | string;
  title: string;
  description?: string;
  coverImage?: string;
  techStack: string[];
  author: {
    name: string;
    avatar: string;
    level?: string;
  };
  stats: {
    stars?: number;
    likes?: number;
    views?: number;
    downloads?: number;
    sales?: number;
  };
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  githubUrl?: string;
  liveDemo?: string;
  featured?: boolean;
  trending?: boolean;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  deliveryTime?: string;
  dateAdded?: string;
}
