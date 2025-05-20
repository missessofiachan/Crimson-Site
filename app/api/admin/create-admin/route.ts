import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";

// This is a protected route to create an admin user
export async function POST(req: Request) {
  try {
    const { name, email, password, secretKey } = await req.json();

    // Check for secret key - simple protection mechanism
    if (secretKey !== "crimson-admin-secret") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    });

    // Return success
    return NextResponse.json({
      message: "Admin user created successfully",
      success: true,
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { error: "An error occurred during admin creation" },
      { status: 500 }
    );
  }
}
