import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { cleanupOrphanedImages } from '@/lib/fileUtils';

// Helper function to check for admin session
async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    console.log('Admin check failed:', {
      hasSession: !!session,
      hasUser: !!(session && session.user),
      role: session?.user?.role,
    });
    return null;
  }
  return session;
}

// POST: Clean up orphaned images (admin only)
export async function POST() {
  try {
    // Check for admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await cleanupOrphanedImages(db);

    return NextResponse.json({
      message: 'Image cleanup completed',
      deletedFiles: result.deleted,
      errors: result.errors,
      summary: {
        deletedCount: result.deleted.length,
        errorCount: result.errors.length,
      },
    });
  } catch (error) {
    console.error('Error during image cleanup:', error);
    return NextResponse.json({ error: 'Failed to cleanup images' }, { status: 500 });
  }
}
