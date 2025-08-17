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

export interface ProjectResponse {
  data: Project[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}