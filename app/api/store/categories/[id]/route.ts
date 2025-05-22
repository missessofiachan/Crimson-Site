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

// GET: Fetch a specific category
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const category = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT: Update a category (admin only)
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
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }
    
    const { name, description } = await request.json();
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Check if the category exists
    const existingCategory = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Check if there's another category with the same name
    const duplicateCategory = await db.collection("categories").findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: new ObjectId(id) }
    });
    
    if (duplicateCategory) {
      return NextResponse.json(
        { error: "Another category with this name already exists" },
        { status: 400 }
      );
    }
    
    // Update the category
    const updateData = {
      name,
      description: description || "",
      updatedAt: new Date(),
    };
    
    await db.collection("categories").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return NextResponse.json({
      message: "Category updated successfully",
      category: { ...existingCategory, ...updateData },
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a category (admin only)
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
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }
    
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Check if the category exists
    const existingCategory = await db
      .collection("categories")
      .findOne({ _id: new ObjectId(id) });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    // Check if any products are using this category
    const productsUsingCategory = await db
      .collection("storeItems")
      .countDocuments({ category: existingCategory.name });
    
    // Delete the category
    await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
    
    // If products were using this category, update them to "uncategorized"
    if (productsUsingCategory > 0) {
      await db.collection("storeItems").updateMany(
        { category: existingCategory.name },
        { $set: { category: "uncategorized" } }
      );
    }
    
    return NextResponse.json({
      message: "Category deleted successfully",
      productsUpdated: productsUsingCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
