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
**Phase 1 Complete ✅**: Database schema design and implementation (Sept 16, 2025)
- Asset and Liability models added to Prisma schema
- Migration `20250916155113_add_assets_and_liabilities` successfully applied
- **Phase 1 Revision (Sept 21, 2025)**: Removed custom User model to fix foreign key constraints
- Migration `20250921180329_remove_user_model` applied - uses Supabase Auth user IDs directly
- Tables use Supabase Auth user IDs without foreign key constraints

**Phase 2 Complete ✅**: Database Operations (CRUD functions) (Sept 18, 2025)
- ✅ Asset CRUD functions completed (`src/lib/assets.ts`)
- ✅ Liability CRUD functions completed (`src/lib/liabilities.ts`)
- ✅ Global Prisma instance pattern implemented
- ✅ TypeScript types and error handling added
- ✅ Calculation utilities completed (`src/lib/calculations.ts`)
- ✅ All functions tested and verified working
- ✅ Currency formatting and net worth calculations implemented
- ✅ Foreign key constraint issue resolved (Sept 21, 2025)

**Phase 3 Complete ✅**: UI Components & Forms (Sept 2025)
- ✅ AssetForm.tsx and LiabilityForm.tsx with Zod validation
- ✅ AssetsList.tsx and LiabilitiesList.tsx with edit/delete actions
- ✅ React Hook Form integration with ShadCN/UI components

**Phase 4 Complete ✅**: Dashboard Integration (Sept 2025)
- ✅ Server Actions implemented in `src/app/actions.ts`
- ✅ DashboardClient.tsx with real database integration
- ✅ Full CRUD operations working end-to-end
- ✅ Real net worth calculations replacing hardcoded values

## Current Status: Phase 5 (Polish & Enhancement)
**Next Steps**: Styling improvements, additional features, testing

See `asset-liability-implementation-plan.txt` for detailed roadmap.