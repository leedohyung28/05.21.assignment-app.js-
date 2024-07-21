export interface Order {
  id: number;
  ordered_at: string;
  address: string;
  receiver: string;
  contact: string;
  book_title: string;
  total_quantity: string;
  total_price: number;
}
