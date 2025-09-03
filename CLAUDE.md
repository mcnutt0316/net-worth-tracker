# Claude Code Instructions

This file contains instructions and context for Claude Code when working on this project.

## Project Overview
**Net Worth Tracker** - A personal finance application built with Next.js 15 and Supabase for tracking assets, liabilities, and net worth.

### Tech Stack
- **Framework**: Next.js 15 (App Router with Turbopack)
- **UI**: ShadCN/UI components with Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Forms**: React Hook Form + Zod validation
- **Database ORM**: Prisma
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React

## Development Commands
- **Dev server**: `npm run dev` (with Turbopack)
- **Build**: `npm run build` (with Turbopack)
- **Start**: `npm start`
- **Lint**: `npm run lint`

## Project Structure
```
src/
├── app/
│   ├── auth/page.tsx          # Authentication page
│   ├── page.tsx              # Main dashboard (protected)
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ui/                   # ShadCN UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── auth-form.tsx         # Authentication form component
└── lib/
    ├── auth.ts              # Auth utilities (requireAuth, getUser)
    ├── client.ts            # Supabase client-side
    ├── server.ts            # Supabase server-side
    └── utils.ts             # Utility functions (cn)
```

## Key Features (Current Implementation)
- **Authentication**: Sign in/up with Supabase Auth
- **Protected Routes**: Dashboard requires authentication
- **Dashboard**: Basic net worth display (assets, liabilities, net worth cards)
- **Responsive Design**: Mobile-first with Tailwind CSS

## Authentication Flow
1. Unauthenticated users redirected to `/auth`
2. Auth form handles both sign in and sign up
3. After auth, users redirected to dashboard at `/`
4. `requireAuth()` utility protects dashboard route

## Database Configuration
- **Supabase**: Connection pooling and direct connection URLs configured
- **Prisma**: ORM setup for database operations
- Environment variables in `.env.local`

## Code Style Guidelines
- **TypeScript**: Strict typing throughout
- **React Server Components**: Used where possible (App Router)
- **Form Validation**: Zod schemas with React Hook Form
- **UI Components**: ShadCN/UI pattern with Tailwind variants
- **File Structure**: Feature-based organization in `src/`

## Important Files
- `src/app/page.tsx:14` - Main dashboard component with auth check
- `src/lib/auth.ts:10` - Authentication utilities
- `src/components/auth-form.tsx` - Authentication form component
- `components.json` - ShadCN/UI configuration
- `.env.local` - Environment variables (Supabase config)

## Development Notes
- Uses App Router with Server Components
- Turbopack enabled for faster builds/dev
- ShadCN/UI with default theme and CSS variables
- Responsive design with mobile-first approach
- No TypeScript checking command configured (only lint)

## Next Steps (Potential Features)
- Asset/liability management forms
- Data persistence with Supabase
- Charts/graphs for net worth tracking
- Categories for assets/liabilities
- Historical tracking and trends