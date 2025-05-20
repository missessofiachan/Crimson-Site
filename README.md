# Crimson-Site

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Modern Next.js app directory structure
- Chatbot powered by OpenRouter/Meta Llama (see `/chat`)
- Cat Fact generator (`/cat-fact`)
- Todo list with MongoDB backend (`/Todo`)
- Gallery page (`/gallery`)
- **Contact Us** page with styled form (`/contact`)
- Responsive design and custom theming

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/` - Main application directory (pages, components, API routes)
- `app/contact/` - Contact form page and styles
- `app/chat/` - Chatbot page and styles
- `app/cat-fact/` - Cat Fact generator
- `app/Todo/` - Todo list (with MongoDB integration)
- `app/gallery/` - Gallery page
- `app/api/` - API routes (chat, mongo)
- `public/` - Static assets

## Contact Form

The Contact Us page (`/contact`) features a modern, accessible form with validation and theming. You can customize the form logic in `app/contact/ContactForm.tsx`.

## Environment Variables

Some features (like chat and todo) require environment variables:

- `OPENROUTER_API_KEY` for chat API
- MongoDB connection string for todo API

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
