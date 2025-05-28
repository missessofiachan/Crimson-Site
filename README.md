# Crimson-Site

This is a [Next.js](https://nextjs.org) project bootstrapped with [
`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Modern Next.js app directory structure (App Router)
- Chatbot powered by OpenRouter/Meta Llama ([/chat](./app/chat))
- Cat Fact generator ([/cat-fact](./app/cat-fact))
- Gallery page ([/gallery](./app/gallery))
- **Contact Us** page with styled, accessible form ([/contact](./app/contact))
- **User System** with authentication and admin controls
- **Store Management System** with image uploads
- Responsive design and custom theming (Tailwind CSS)
- API routes for chat, store, authentication, and more

## Technologies Used

- [Next.js 15+](https://nextjs.org/)
- [React 18+](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/) (authentication)
- [Cloudinary](https://cloudinary.com/) (image uploads)

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

- `app/` - Main application directory (pages, components, API routes)
  - `contact/` - Contact form page and styles
  - `chat/` - Chatbot page and styles
  - `cat-fact/` - Cat Fact generator
  - `Todo/` - Todo list (with MongoDB integration)
  - `gallery/` - Gallery page
  - `store/` - Public store page to display items
  - `dashboard/` - Admin dashboard with store management
  - `login/` and `register/` - User authentication pages
  - `api/` - API routes (chat, mongo, auth, store items)
- `public/` - Static assets including uploaded images
- `components/` - Shared React components
- `lib/` - Utility libraries (auth, db, etc.)
- `types/` - TypeScript type definitions

## Contact Form

The Contact Us page (`/contact`) features a modern, accessible form with validation and theming. You can customize the
form logic in `app/contact/ContactForm.tsx`.

## Environment Variables

Some features (like chat and todo) require environment variables. Create a `.env.local` file in the project root and
add:

- `OPENROUTER_API_KEY` for chat API
- `MONGODB_URI` for MongoDB connection string
- `MONGODB_DB` for your database name
- `NEXTAUTH_SECRET` for NextAuth.js
- `NEXTAUTH_URL` for your deployment URL

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

### Deployment Checklist

1. **Environment Variables**: Set all required environment variables in the Vercel dashboard:

    - `MONGODB_URI`: Your MongoDB connection string
    - `MONGODB_DB`: Your database name
    - `NEXTAUTH_SECRET`: A random string for NextAuth.js
    - `NEXTAUTH_URL`: Your deployment URL

2. **Node.js Version**: Use Node.js 18.x or later (required for Next.js 15.x)

    - You can specify this in Vercel's dashboard under Project Settings > General > Node.js Version

3. **Punycode Warning**: Ignore any punycode deprecation warnings during build; they come from a dependency.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

[MIT](LICENSE) (or specify your license here)
