import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/mongodb';
import type { CreateOrderData, Order } from '@/types/order';

// GET /api/orders - Get user's orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await connectToDatabase;
    const db = client.db();
    const orders = await db
      .collection('orders')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateOrderData = await req.json();
    const { items, total, shippingAddress } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Items are required' }, { status: 400 });
    }

    if (!total || total <= 0) {
      return NextResponse.json({ error: 'Valid total is required' }, { status: 400 });
    }

    if (
      !shippingAddress ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return NextResponse.json({ error: 'Complete shipping address is required' }, { status: 400 });
    }
    const client = await connectToDatabase;
    const db = client.db();

    // Create new order
    const newOrder: Omit<Order, '_id'> = {
      userId: session.user.id,
      items,
      total,
      status: 'pending',
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('orders').insertOne(newOrder);

    if (!result.insertedId) {
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Get the created order
    const createdOrder = await db.collection('orders').findOne({ _id: result.insertedId });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: createdOrder,
        orderId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
