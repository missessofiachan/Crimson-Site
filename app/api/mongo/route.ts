import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

async function connect() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  return { db, client };
}

export async function GET() {
  const { db, client } = await connect();
  try {
    const data = await db.collection("data").find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  const { db, client } = await connect();
  try {
    const body = await request.json();
    const result = await db.collection("data").insertOne(body);
    return NextResponse.json({ insertedId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: Request) {
  const { db, client } = await connect();
  try {
    const body = await request.json();
    const { _id, ...update } = body;
    const result = await db.collection("data").updateOne(
      { _id: new ObjectId(_id) },
      { $set: update }
    );
    return NextResponse.json({ modifiedCount: result.modifiedCount });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request: Request) {
  const { db, client } = await connect();
  try {
    const { _id } = await request.json();
    const result = await db.collection("data").deleteOne({ _id: new ObjectId(_id) });
    return NextResponse.json({ deletedCount: result.deletedCount });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await client.close();
  }
}
