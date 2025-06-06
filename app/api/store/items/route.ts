import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';

// Helper function to check for admin session
async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    return null;
  }
  return session;
}

// GET: Fetch all store items
export async function GET(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Parse query parameters
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '0');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';

    // Build query
    let query: Record<string, unknown> = {};

    // Add search filter
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Add category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Get store items with pagination and filters
    const items = await db
      .collection('storeItems')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .toArray();

    const total = await db.collection('storeItems').countDocuments(query);

    return NextResponse.json({
      items,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch store items' }, { status: 500 });
  }
}

// POST: Create a new store item (admin only)
export async function POST(req: Request) {
  try {
    // Check for admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, price, imageUrl, category } = await req.json();

    // Validate required fields
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: 'Name, description and price are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Create the store item
    const newItem = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || null,
      category: category || 'uncategorized',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('storeItems').insertOne(newItem);

    return NextResponse.json({
      message: 'Store item created successfully',
      itemId: result.insertedId,
      item: newItem,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create store item' }, { status: 500 });
  }
}
