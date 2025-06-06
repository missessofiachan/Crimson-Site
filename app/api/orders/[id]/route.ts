import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import connectToDatabase from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import type { UpdateOrderData } from '@/types/order';

// GET /api/orders/[id] - Get specific order
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const client = await connectToDatabase;
    const db = client.db();
    const order = await db.collection('orders').findOne({
      _id: new ObjectId(id),
      userId: session.user.id, // Ensure user can only access their own orders
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] - Update order (admin only for now)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const updateData: UpdateOrderData = await req.json();
    const { status, trackingNumber, estimatedDelivery, notes } = updateData;

    // Build update object
    const updateObj: Partial<UpdateOrderData> & { updatedAt: Date } = {
      updatedAt: new Date(),
    };

    if (status) {
      // Users can only cancel their own pending orders
      if (status === 'cancelled' && session.user.id) {
        updateObj.status = status;
      } else {
        // For other status updates, you might want to check admin permissions
        // For now, allowing all status updates
        updateObj.status = status;
      }
    }

    if (trackingNumber) updateObj.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateObj.estimatedDelivery = new Date(estimatedDelivery);
    if (notes) updateObj.notes = notes;

    const client = await connectToDatabase;
    const db = client.db();

    const result = await db.collection('orders').updateOne(
      {
        _id: new ObjectId(id),
        userId: session.user.id, // Ensure user can only update their own orders
      },
      { $set: updateObj }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get updated order
    const updatedOrder = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE /api/orders/[id] - Delete order (admin only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const isAdmin = session.user.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }

    const client = await connectToDatabase;
    const db = client.db();

    // First check if order exists
    const order = await db.collection('orders').findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const result = await db.collection('orders').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Order deleted successfully',
      deletedBy: 'admin',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
