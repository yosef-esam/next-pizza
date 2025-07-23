import { db } from '@/lib/prisma';
import { Order, Prisma } from '@prisma/client';

// Type for creating an order (excluding id, createdAt, updatedAt, and products)
type CreateOrderInput = Omit<Prisma.OrderCreateInput, 'id' | 'createdAt' | 'updatedAt' | 'products'> & {
  products: Prisma.OrderProductCreateNestedManyWithoutOrderInput;
};

export async function createOrder(orderData: CreateOrderInput): Promise<Order> {
  return db.order.create({
    data: orderData,
  });
}

export async function findAllOrders(): Promise<Order[]> {
  return db.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
} 