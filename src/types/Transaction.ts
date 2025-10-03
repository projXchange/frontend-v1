

export interface TransactionsApiResponse {
  transactions: Transaction[];
  total: number;
}

// DB-aligned flat transaction schema (for create/read with backend)
export interface Transaction {
  id: string;
  transaction_id: string;
  user_id: string;
  project_id: string;
  author_id: string;
  type: string;
  status: string;
  amount: string;
  currency: string;
  payment_method: string;
  payment_gateway_response: string;
  commission_amount: string;
  author_amount: string;
  metadata: string;
  processed_at: string;
  refunded_at: string;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
}