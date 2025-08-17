export interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
}

export interface ProfileForm {
  id?: string;
  rating: number;
  total_sales: number;
  total_purchases: number;
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  avatar: string;
  bio: string;
  location: string;
  website: string;
  social_links: SocialLinks;
  skills: string[];
  status: 'active' | 'inactive';
  created_at: string;
}
