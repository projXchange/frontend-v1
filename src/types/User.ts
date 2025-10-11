export interface User {
  id: string;
  email: string;
  full_name: string;
  user_type: string; 
  verification_status: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  email_verified: boolean;
  forgot_password_token: string | null;
  forgot_password_expiry: string | null;
  deleted_at: string | null;
  rating: number;
  total_sales: number;
  total_purchases: number;
  experience_level: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  social_links: Record<string, string> | null; // e.g. { github: "...", linkedin: "..." }
  skills: string[];
}

export interface UsersApiResponse {
  users: User[];
  total: number;
}

export interface AuthResult {
    success: boolean;
    message?: string;
    user?: User;
}

