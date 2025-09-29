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
│   ├── auth/page.tsx          # Authentication page with improved styling
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
│   └── auth-form.tsx         # Authentication form with glass effect styling
├── lib/
│   ├── auth.ts              # Auth utilities (requireAuth, getUser)
│   ├── client.ts            # Supabase client-side
│   ├── server.ts            # Supabase server-side (updated getUser)
│   └── utils.ts             # Utility functions (cn)
└── middleware.ts            # Server-side route protection
```

## Key Features (Current Implementation)
- **Authentication**: Sign in/up with Supabase Auth with improved UX
- **Protected Routes**: Dashboard requires authentication with middleware protection
- **Dashboard**: Basic net worth display (assets, liabilities, net worth cards)
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Auth Form Styling**: Semi-transparent glass effect with purple theme integration
- **Route Protection**: Server-side middleware for authentication

## Authentication Flow
1. Unauthenticated users redirected to `/auth` via middleware
2. Auth form handles both sign in and sign up with improved styling
3. After auth, users redirected to dashboard at `/`
4. `getUser()` utility (updated from `getAuth()`) protects dashboard route
5. Server-side middleware provides additional route protection

## Database Configuration
- **Supabase**: Connection pooling and direct connection URLs configured, handles user authentication
- **Prisma**: ORM setup for database operations with complete schema
- **Database Tables**:
  - `assets` - User assets (savings, investments, property, etc.) with Supabase Auth user IDs
  - `liabilities` - User debts (loans, credit cards, mortgages, etc.) with Supabase Auth user IDs
  - `snapshots` - Monthly net worth snapshots (assets total, liabilities total, net worth, timestamp)
- **User Management**: Uses Supabase Auth directly (no custom User model), assets/liabilities store auth user IDs
- Environment variables in `.env.local`

## Code Style Guidelines
- **TypeScript**: Strict typing throughout
- **React Server Components**: Used where possible (App Router)
- **Form Validation**: Zod schemas with React Hook Form
- **UI Components**: ShadCN/UI pattern with Tailwind variants
- **File Structure**: Feature-based organization in `src/`

## Important Files
- `src/app/page.tsx` - Main dashboard component with auth check
- `src/app/actions.ts` - Server actions for CRUD operations, auth checks, and data fetching
- `src/lib/auth.ts` - Authentication utilities (requireAuth, getUser)
- `src/lib/server.ts` - Server-side Supabase utilities (updated getUser function)
- `src/lib/assets.ts` - Asset CRUD operations (completed Sept 18, 2025)
- `src/lib/liabilities.ts` - Liability CRUD operations (completed Sept 18, 2025)
- `src/lib/calculations.ts` - Net worth calculation utilities (completed Sept 18, 2025)
- `src/components/auth-form.tsx` - Authentication form with glass effect styling
- `src/middleware.ts` - Server-side route protection middleware
- `prisma/schema.prisma` - Database schema with Asset and Liability models (uses Supabase Auth for users)
- `prisma/migrations/` - Database migration history
- `components.json` - ShadCN/UI configuration
- `.env.local` - Environment variables (Supabase config)
- `asset-liability-implementation-plan.txt` - Development roadmap and progress
- `net-worth-tracking-progress.md` - Net worth tracking implementation progress and plan

## Development Notes
- Uses App Router with Server Components
- Turbopack enabled for faster builds/dev
- ShadCN/UI with default theme and CSS variables
- Responsive design with mobile-first approach
- No TypeScript checking command configured (only lint)
- Auth form styled with glass morphism effect (semi-transparent bg with backdrop blur)
- Server-side middleware handles route protection automatically
- Updated authentication utilities from `getAuth()` to `getUser()` pattern
- **Database Schema Completed** (Sept 16, 2025): Asset and Liability tables created with proper relationships

## In Progress Features
- **Net Worth Tracking Over Time** (Sept 29, 2025): Monthly snapshots with trend visualization
  - ✅ Database: `NetWorthSnapshot` model added (migration: `20250928164126_add_networth_snapshots`)
  - 🔄 **Phase 2 - Core Functionality**: Server actions partially implemented, utilities needed next
  - ⏳ **Current Status**: Need to complete `src/lib/snapshots.ts` utilities to unblock server actions
  - 📋 **Next Steps**: Complete utilities → fix server actions → add dashboard button
  - 📊 **Goal**: Fidelity-style charts showing financial growth over time with manual snapshot creation
  - 📄 **Detailed Progress**: See `net-worth-tracking-progress.md` for complete implementation notes

