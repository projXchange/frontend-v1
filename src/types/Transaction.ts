export interface Transaction {
  id: string;
  transaction_id: string;
  type: string;
  status: string;
  amount: string;
  currency: string;
  payment_method: string;
  commission_amount: string;
  seller_amount: string;
  processed_at: string;
  created_at: string;
  project: {
    id: string;
    title: string;
    thumbnail: string;
  };
  buyer: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface TransactionsApiResponse {
  transactions: Transaction[];
  total: number;
}
