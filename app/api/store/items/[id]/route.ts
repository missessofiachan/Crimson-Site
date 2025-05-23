import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { ObjectId } from "mongodb";
import { authOptions } from "@/lib/authOptions";

// Helper function to check for admin session
async function getAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "admin") {
    console.log('Admin check failed:', { 
      hasSession: !!session, 
      hasUser: !!(session && session.user), 
      role: session?.user?.role 
    });
    return null;
  }
  return session;
}

// GET: Fetch a specific store item
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const item = await db
      .collection("storeItems")
      .findOne({ _id: new ObjectId(id) });
    
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching store item:", error);
    return NextResponse.json(
      { error: "Failed to fetch store item" },
      { status: 500 }
    );
  }
}

// PUT: Update a store item (admin only)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const { name, description, price, imageUrl, category } = await request.json();

    // Validate required fields
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Name, description and price are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Update the store item
    const updatedItem = {
      name,
      description,
      price: parseFloat(price),
      imageUrl: imageUrl || null,
      category: category || "uncategorized",
      updatedAt: new Date(),
    };

    const result = await db.collection("storeItems").updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedItem }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Store item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.error("Error updating store item:", error);
    return NextResponse.json(
      { error: "Failed to update store item" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a store item (admin only)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check for admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("storeItems").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Store item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting store item:", error);
    return NextResponse.json(
      { error: "Failed to delete store item" },
      { status: 500 }
    );
  }
}
