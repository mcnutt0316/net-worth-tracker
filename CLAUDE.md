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
- **Supabase**: Connection pooling and direct connection URLs configured
- **Prisma**: ORM setup for database operations with complete schema
- **Database Tables**:
  - `users` - User authentication data
  - `assets` - User assets (savings, investments, property, etc.)
  - `liabilities` - User debts (loans, credit cards, mortgages, etc.)
- **Relationships**: Foreign keys linking assets/liabilities to users with cascade delete
- Environment variables in `.env.local`

## Code Style Guidelines
- **TypeScript**: Strict typing throughout
- **React Server Components**: Used where possible (App Router)
- **Form Validation**: Zod schemas with React Hook Form
- **UI Components**: ShadCN/UI pattern with Tailwind variants
- **File Structure**: Feature-based organization in `src/`

## Important Files
- `src/app/page.tsx` - Main dashboard component with auth check
- `src/lib/auth.ts` - Authentication utilities (requireAuth, getUser)
- `src/lib/server.ts` - Server-side Supabase utilities (updated getUser function)
- `src/components/auth-form.tsx` - Authentication form with glass effect styling
- `src/middleware.ts` - Server-side route protection middleware
- `prisma/schema.prisma` - Database schema with User, Asset, and Liability models
- `prisma/migrations/` - Database migration history
- `components.json` - ShadCN/UI configuration
- `.env.local` - Environment variables (Supabase config)
- `asset-liability-implementation-plan.txt` - Development roadmap and progress

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

## Project Status
**Phase 1 Complete ✅**: Database schema design and implementation
- Asset and Liability models added to Prisma schema
- Migration `20250916155113_add_assets_and_liabilities` successfully applied
- Tables created in Supabase with proper foreign key relationships
- Prisma Client regenerated with new TypeScript types

## Next Steps (Implementation Plan)
**Phase 2**: Database Operations (CRUD functions)
**Phase 3**: UI Components & Forms
**Phase 4**: Dashboard Integration
**Phase 5**: Polish & Enhancement

See `asset-liability-implementation-plan.txt` for detailed roadmap.