export interface Project {
  id: string;
  title: string;
  description: string;
  key_features: string;
  category: string;
  author_id: string;
  buyers: string[];
  difficulty_level: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
  documentation: string;
  pricing: {
    sale_price: number;
    original_price: number;
    currency: string;
  };
  delivery_time: number;
  status: string;
  is_featured: boolean;
  view_count: number;
  purchase_count: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  discount_percentage: number;
}

export interface ProjectDump {
  id: string;
  thumbnail: string;
  images: string[];
  demo_video: string;
  features: string[];
  tags: string[];
  files: {
    source_files: string[];
    documentation_files: string[];
    assets: string[];
    size_mb: number;
  };
  requirements: {
    system_requirements: string[];
    dependencies: string[];
    installation_steps: string[];
  };
  stats: {
    total_downloads: number;
    total_views: number;
    total_likes: number;
    completion_rate: number;
  };
  rating: {
    average_rating: number;
    total_ratings: number;
    rating_distribution: Record<string, number>;
  };
  created_at: string;
  updated_at: string;
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
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    full_name: string;
    email: string;
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