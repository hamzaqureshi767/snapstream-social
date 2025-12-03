# Snapstream Social

An Instagram-inspired social experience built with React, TypeScript, Tailwind CSS, and shadcn/ui. The app showcases feeds, stories, messaging previews, Supabase-powered authentication, and a polished mobile-responsive layout.

## Features

- Responsive layout with header, sidebar, and bottom navigation
- Feed with posts, stories carousel, reactions, comments, and save states
- Profile editing with dialog-based form and grid/gallery views
- Explore/search experiences plus notifications and messaging placeholders
- Supabase client integration for future data persistence

## Tech Stack

- React 18 + Vite + TypeScript
- Tailwind CSS with shadcn/ui component library
- Radix UI primitives, lucide icons, TanStack Query
- Supabase JS SDK for authentication and storage hooks

## Getting Started

```bash
npm install
npm run dev
```

The development server runs on `http://localhost:5173`. Update the Supabase credentials in `supabase/config.toml` as needed before deploying or wiring up live data.

## Available Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – create a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint across the project

## Deployment

Any static hosting platform that supports Vite builds (e.g., Netlify, Vercel, Render) will work. Build the project, serve the contents of `dist/`, and configure environment variables for Supabase before deploying.
