export interface User {
    id: string;
    email: string;
    full_name: string;
    user_type: string;
    verification_status: string;
    created_at: string;
    updated_at: string;
    email_verified: boolean;
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

