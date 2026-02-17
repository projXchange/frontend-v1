// Enquiry Types

export interface Enquiry {
  id: string;
  user_id: string;
  project_title: string;
  project_description: string;
  budget_range: string | null;
  timeline: string | null;
  tech_preferences: string[];
  additional_requirements: string | null;
  status: 'pending' | 'reviewing' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface AdminEnquiry extends Enquiry {
  user_full_name: string | null;
  user_email: string;
  user_phone_number: string | null;
}

export interface CreateEnquiryRequest {
  project_title: string;
  project_description: string;
  budget_range?: string;
  timeline?: string;
  tech_preferences?: string[];
  additional_requirements?: string;
}

export interface EnquiryResponse {
  success: boolean;
  data: Enquiry;
  message?: string;
}

export interface EnquiriesListResponse {
  success: boolean;
  data: Enquiry[];
  message?: string;
}

export interface AdminEnquiriesListResponse {
  success: boolean;
  data: AdminEnquiry[];
  message?: string;
}

export interface UpdateEnquiryStatusRequest {
  status: 'pending' | 'reviewing' | 'contacted' | 'closed';
}
