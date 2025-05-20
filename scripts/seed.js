// scripts/seed.js
// Run with: node scripts/seed.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Change if your MongoDB is elsewhere
const dbName = 'crimson-site'; // Change if your DB name is different

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);

    // Insert admin user
    const users = db.collection('users');
    const admin = {
      name: 'Admin',
      email: 'admin@example.com',
      password: '$2b$10$REPLACE_WITH_HASHED_PASSWORD', // bcrypt hash required
      role: 'admin',
      createdAt: new Date(),
    };
    await users.insertOne(admin);
    console.log('Admin user inserted.');

    // Insert sample category
    const categories = db.collection('categories');
    await categories.insertOne({
      name: 'Uncategorized',
      description: 'Default category',
    });
    console.log('Sample category inserted.');

    // Insert sample store item
    const items = db.collection('items');
    await items.insertOne({
      name: 'Sample Item',
      description: 'This is a sample item.',
      price: 9.99,
      imageUrl: null,
      category: 'Uncategorized',
      createdAt: new Date(),
    });
    console.log('Sample store item inserted.');
  } finally {
    await client.close();
  }
}

main().catch(console.error);

// IMPORTANT: Replace the password hash with a real bcrypt hash for your admin password.
// You can generate one with: npx bcryptjs-cli hash 'yourpassword'
