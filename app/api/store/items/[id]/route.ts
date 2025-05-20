import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

// GET: Fetch a specific store item
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const { name, description, price, imageUrl, category } = await req.json();

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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for admin session
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
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
