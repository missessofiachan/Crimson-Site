import { MetadataRoute } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://crimson-site.vercel.app'; 
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/login',
    '/register',
    '/store',
    '/cart',
    '/order-confirmation',
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/store',
    '/dashboard/store/add',
    '/dashboard/store/categories',
    '/cat-fact',
    '/chat',
  ];

  // Fetch dynamic product and category slugs from MongoDB
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  // Products
  const productDocs = await db
    .collection('storeItems')
    .find({}, { projection: { _id: 1 } })
    .toArray();
  const productRoutes = productDocs.map((doc) => `/store/${doc._id}`);

  // Categories
  const categoryDocs = await db
    .collection('categories')
    .find({}, { projection: { _id: 1 } })
    .toArray();
  const categoryRoutes = categoryDocs.map((doc) => `/store/categories/${doc._id}`);

  const allRoutes = [...staticRoutes, ...productRoutes, ...categoryRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));
}
