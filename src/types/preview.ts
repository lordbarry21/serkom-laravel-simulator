export type FoodCategory = 'makanan' | 'minuman' | 'cemilan';
export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface FoodItem {
  id: number;
  name: string;
  category: FoodCategory;
  price: number;
  description?: string;
  image: string; // e.g. 'foods/nasgor.jpg'
  created_at?: string;
}

export interface OrderDetailItem {
  id: number;
  order_id: number;
  food_id: number;
  food?: FoodItem;
  quantity: number;
  subtotal: number;
}

export interface OrderRecord {
  id: number;
  customer_name: string;
  table_number: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  order_details: OrderDetailItem[];
}

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
}

export interface MockDatabase {
  foods: FoodItem[];
  orders: OrderRecord[];
  order_details: OrderDetailItem[];
  users: UserAccount[];
}

export interface CustomerCartItem {
  food: FoodItem;
  quantity: number;
}
