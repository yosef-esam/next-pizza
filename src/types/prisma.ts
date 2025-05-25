import { ProductSizes, ExtraIngredients, UserRole } from "@prisma/client";

export interface Category {
  id: string;
  name: string;
  order: number;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  order: number;
  basePrice: number;
  createdAt: Date;
  updatedAt: Date;
  sizes?: Size[];
  extras?: Extra[];
  orders?: OrderProduct[];
  category?: Category;
  categoryId: string;
}

export interface Size {
  id: string;
  name: ProductSizes;
  price: number;
  product?: Product;
  productId: string;
}

export interface Extra {
  id: string;
  name: ExtraIngredients;
  price: number;
  product?: Product;
  productId: string;
}

export interface Order {
  id: string;
  paid: boolean;
  subTotal: number;
  deliveryFee: number;
  totalPrice: number;
  userEmail: string;
  phone: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  products?: OrderProduct[];
}

export interface OrderProduct {
  id: string;
  quantity: number;
  order?: Order;
  orderId: string;
  user?: User;
  userId?: string;
  product?: Product;
  productId: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  image?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  orders?: OrderProduct[];
  accounts?: Account[];
  sessions?: Session[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user?: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: User;
}  export interface OrderProduct {
  id: string;
  quantity: number;
  order?: Order;
  orderId: string;
  user?: User;
  userId?: string;
  product?: Product;
  productId: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  image?: string;
  phone?: string;
  streetAddress?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  orders?: OrderProduct[];
  accounts?: Account[];
  sessions?: Session[];
}

export interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  user?: User;
}

export interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user?: User;
} 