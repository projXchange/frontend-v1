export interface Project {
  id: string;
  title: string;
  description: string;
  key_features?: string;
  category: string;
  author_id: string;
  buyers: string[];
  difficulty_level: string;
  tech_stack: string[];
  github_url?: string;
  demo_url?: string;
  youtube_url?: string;
  pricing?: {
    sale_price: number;
    original_price: number;
    currency: "INR" | "USD";
  };
  delivery_time: number;
  status: string;
  is_featured: boolean;
  isPurchased?: boolean;
  isDemo?: boolean;
  created_at: string;
  updated_at: string;
  discount_percentage?: number;
  thumbnail?: string;
  images?: string[];
  files?: {
    source_files?: string[];
    documentation_files?: string[];
  };
  requirements?: {
    system_requirements?: string[];
    dependencies?: string[];
    installation_steps?: string[];
  };
  rating?: {
    average_rating?: number;
    total_ratings?: number;
    rating_distribution?: { [key: string]: number };
  };
  view_count: number;
  purchase_count: number;
  download_count: number;
  author_details?: {
    authorId: string;
    avatar: string | null;
    full_name: string;
    email: string;
    total_projects: number;
    rating: number;
    total_sales: number;
    social_links?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}


export interface ProjectResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// New interfaces for Wishlist, Cart, and Reviews
export interface WishlistItem {
  id: string;
  project_id: string;
  user_id: string;
  added_at: string;
  project: Project;
}

export interface CartItem {
  id: string;
  project_id: string;
  user_id: string;
  added_at: string;
  project: Project;
}

export interface Review {
  id: string;
  project_id: string;
  user_id: string;
  rating: number;
  review_text: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  project: {
    "id": "string",
    "title": "string"
  };
}

export interface ReviewResponse {
  reviews: Review[];
  total: number;
}

export interface ProjectRating {
  project_id: string;
  total_reviews: number;
  average_rating: number;
}