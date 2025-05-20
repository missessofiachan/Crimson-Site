# Project Dependencies Explanation

This document explains each dependency in your project, why it is used, and where it is used in your codebase.

## Main Dependencies

- **@auth/mongodb-adapter**: Adapter for integrating MongoDB with NextAuth.js for user authentication and session storage.
  - Usage: Used in authentication logic (see `app/api/auth/[...nextauth]/route.ts`).

- **@hookform/resolvers**: Provides validation resolvers for react-hook-form, allowing integration with validation libraries like Zod.
  - Usage: Used with react-hook-form for schema validation (see form components in `app/`).

- **@types/bcrypt**: TypeScript type definitions for the bcrypt library.
  - Usage: Provides types for `bcrypt` in files like `app/api/register/route.ts`, `app/api/admin/setup/route.ts`, and `app/api/admin/create-admin/route.ts`.

- **@types/uuid**: TypeScript type definitions for the uuid library.
  - Usage: Provides types for `uuid` in `app/api/upload/route.ts`.

- **bcrypt**: Library for hashing passwords securely, used for user authentication.
  - Usage: Used in `app/api/register/route.ts`, `app/api/admin/setup/route.ts`, `app/api/admin/create-admin/route.ts`, and for password comparison in `app/api/auth/[...nextauth]/route.ts`.

- **formidable**: Node.js module for parsing form data, especially file uploads.
  - Usage: Used for file upload endpoints (see `app/api/upload/route.ts`).

- **mongodb**: Official MongoDB driver for Node.js, used to interact with your MongoDB database.
  - Usage: Used in `lib/mongodb.ts`, `app/api/store/items/[id]/route.ts`, and `scripts/seed.js`.

- **multer**: Middleware for handling multipart/form-data, primarily used for uploading files.
  - Usage: Used for file upload endpoints (see `app/api/upload/route.ts`).

- **next**: The Next.js framework for building React applications with server-side rendering and API routes.
  - Usage: Used throughout the project (see all files in `app/`, `next.config.ts`).

- **next-auth**: Authentication library for Next.js, providing sign-in, sign-out, and session management.
  - Usage: Used in `app/api/auth/[...nextauth]/route.ts`, `lib/auth.ts`, and in many components (e.g., `Navbar.tsx`, `providers.tsx`).

- **next-cloudinary**: Integration for using Cloudinary image services in Next.js apps.
  - Usage: Used for image upload/display (see image-related components in `app/`).

- **openai**: Official OpenAI API client, used for AI features like chatbots or text generation.
  - Usage: Used in `app/api/chat/route.ts`.

- **react**: The core React library for building user interfaces.
  - Usage: Used in all React components (see all `.tsx` files).

- **react-dom**: React package for working with the DOM in web applications.
  - Usage: Used by Next.js for rendering React components.

- **react-hook-form**: Library for managing forms and form validation in React.
  - Usage: Used in form components (see `app/dashboard/store/add/page.tsx`, etc.).

- **react-hot-toast**: Library for showing toast notifications in React apps.
  - Usage: Used in `app/toast-provider.tsx`, `app/store/page.tsx`, `app/dashboard/store/categories/page.tsx`, `app/cart/page.tsx`.

- **sharp**: High-performance image processing library, used for resizing and manipulating images.
  - Usage: Used in image upload endpoints (see `app/api/upload/route.ts`).

- **uuid**: Library for generating unique IDs, often used for database records or file names.
  - Usage: Used in `app/api/upload/route.ts` for generating unique file names.

- **zod**: TypeScript-first schema validation library, used for validating data structures.
  - Usage: Used with react-hook-form and API validation (see form and API files).

## Development Dependencies

- **@tailwindcss/postcss**: PostCSS plugin for integrating Tailwind CSS with your build process.
  - Usage: Used in `postcss.config.mjs`.

- **@types/mongodb**: TypeScript type definitions for the mongodb library.
  - Usage: Provides types for `mongodb` in backend and API files.

- **@types/next**: TypeScript type definitions for Next.js.
  - Usage: Provides types for Next.js in all `.ts`/`.tsx` files.

- **@types/node**: TypeScript type definitions for Node.js.
  - Usage: Provides types for Node.js in backend and API files.

- **@types/react**: TypeScript type definitions for React.
  - Usage: Provides types for React in all `.tsx` files.

- **@types/react-dom**: TypeScript type definitions for React DOM.
  - Usage: Provides types for React DOM in all `.tsx` files.

- **tailwindcss**: Utility-first CSS framework for rapidly building custom user interfaces.
  - Usage: Used in `app/globals.css` and all Tailwind-styled components.

- **typescript**: TypeScript language support for static typing in JavaScript.
  - Usage: Used throughout the project for type safety in all `.ts`/`.tsx` files.

## Known Issues

- **Punycode Deprecation Warning**: The punycode module is deprecated and will be removed from Node.js. This warning comes from a dependency and not from your direct code. It's usually triggered by the `uri-js` package which is used by many validation libraries. This doesn't affect functionality but may show as a warning during build.

## Deployment Configuration

Several configuration files have been added or updated to improve Vercel deployment:

- **vercel.json**: Configuration for Vercel deployment with environment variables, build settings, and security headers.
- **.nvmrc**: Specifies Node.js version 18 for compatibility with Next.js 15.x.
- **tailwind.config.mjs**: Updated configuration for Tailwind CSS 4.
- **postcss.config.mjs**: Updated to use proper plugin syntax compatible with latest versions.
- **next.config.ts**: Enhanced with additional configuration for image optimization and module issues.

See the `DEPLOYMENT-GUIDE.md` file for detailed troubleshooting steps when deploying to Vercel.

---


