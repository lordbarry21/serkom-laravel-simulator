import { FoodItem, MockDatabase, OrderRecord, UserAccount } from '@/types/preview';

export const initialUsers: UserAccount[] = [
  {
    id: 1,
    name: 'Admin Toko',
    email: 'admin@gmail.com',
    role: 'admin',
  },
];

export const initialFoods: FoodItem[] = [
  {
    id: 1,
    name: 'Nasi Goreng Spesial',
    category: 'makanan',
    price: 25000,
    description: 'Nasi goreng dengan telur, ayam suwir, dan kerupuk gurih.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
    created_at: '2025-01-01 10:00:00',
  },
  {
    id: 2,
    name: 'Mie Goreng Seafood',
    category: 'makanan',
    price: 28000,
    description: 'Mie goreng pedas dengan topping udang segar dan cumi.',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    created_at: '2025-01-01 10:05:00',
  },
  {
    id: 3,
    name: 'Es Teh Manis',
    category: 'minuman',
    price: 5000,
    description: 'Es teh melati segar dingin penghilang dahaga.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    created_at: '2025-01-01 10:10:00',
  },
  {
    id: 4,
    name: 'Jus Alpukat',
    category: 'minuman',
    price: 15000,
    description: 'Jus alpukat mentega murni kental dengan susu cokelat.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
    created_at: '2025-01-01 10:15:00',
  },
  {
    id: 5,
    name: 'Kentang Goreng',
    category: 'cemilan',
    price: 12000,
    description: 'Kentang goreng renyah bumbu gurih dengan saus cocol keju.',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
    created_at: '2025-01-01 10:20:00',
  },
];

export const initialOrders: OrderRecord[] = [
  {
    id: 101,
    customer_name: 'Budi Santoso',
    table_number: '03',
    total_price: 55000,
    status: 'pending',
    created_at: '2025-01-01 11:30:00',
    order_details: [
      {
        id: 1,
        order_id: 101,
        food_id: 1,
        food: initialFoods[0],
        quantity: 2,
        subtotal: 50000,
      },
      {
        id: 2,
        order_id: 101,
        food_id: 3,
        food: initialFoods[2],
        quantity: 1,
        subtotal: 5000,
      },
    ],
  },
  {
    id: 102,
    customer_name: 'Siti Rahma',
    table_number: '07',
    total_price: 43000,
    status: 'completed',
    created_at: '2025-01-01 12:15:00',
    order_details: [
      {
        id: 3,
        order_id: 102,
        food_id: 2,
        food: initialFoods[1],
        quantity: 1,
        subtotal: 28000,
      },
      {
        id: 4,
        order_id: 102,
        food_id: 4,
        food: initialFoods[3],
        quantity: 1,
        subtotal: 15000,
      },
    ],
  },
];

export function createInitialMockDatabase(): MockDatabase {
  return {
    foods: [...initialFoods],
    orders: JSON.parse(JSON.stringify(initialOrders)),
    order_details: initialOrders.flatMap((order) => order.order_details),
    users: [...initialUsers],
  };
}
