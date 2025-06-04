import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import clientPromise from '@/lib/mongodb';

// This endpoint is used to create the initial admin account

export async function POST(req: Request) {
  try {
    const { name, email, password, setupKey } = await req.json();

    // Verify setup key using environment variable for security
    const validSetupKey = process.env.ADMIN_SETUP_KEY || 'crimson-initial-setup';
    if (setupKey !== validSetupKey) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 401 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Check if there's already an admin user
    const adminExists = await db.collection('users').findOne({ role: 'admin' });
    if (adminExists) {
      return NextResponse.json({ error: 'Admin account already exists' }, { status: 400 });
    }

    // Check if the email is already in use
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: 'Admin account created successfully',
      userId: result.insertedId,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
  }
}
