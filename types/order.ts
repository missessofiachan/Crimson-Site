// Order types and interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}

export interface CreateOrderData {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
}

export interface UpdateOrderData {
  status?: Order['status'];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
}
