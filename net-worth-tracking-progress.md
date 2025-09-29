# Net Worth Tracking Over Time - Implementation Progress

## Project Goal
Add monthly net worth snapshots and Fidelity-style trend visualization to track financial progress over time.

## Overall Plan

### ✅ Phase 1: Database Foundation (COMPLETED)
- **Database Schema**: Added `NetWorthSnapshot` model to Prisma schema
  - Fields: `id`, `networth`, `assets`, `liabilities`, `userId`, `createdAt`
  - Table name: `snapshots`
  - Follows existing patterns from Asset/Liability models
- **Migration**: Successfully ran `npx prisma migrate dev --name add-networth-snapshots`
  - Migration file: `20250928164126_add_networth_snapshots`
  - Database table created and Prisma client regenerated

### 🔄 Phase 2: Core Snapshot Functionality (IN PROGRESS)
1. **Create snapshot utilities** (`src/lib/snapshots.ts`): ⏳ IN PROGRESS
   - Database CRUD operations following existing asset/liability patterns
   - Integration with existing `getNetWorthSummary()` calculations
   - Functions: `createSnapshot()`, `getSnapshots()`, etc.
   - **Status**: Learning phase complete, ready to implement utilities

2. **Extend server actions** (`src/app/actions.ts`): 🔄 PARTIALLY COMPLETE
   - ✅ `createSnapshotAction()` - basic structure implemented, needs completion
   - ✅ `getSnapshotAction()` - basic structure implemented, needs fixes
   - ❌ **Blockers**: Need snapshot utilities first, then fix function calls
   - **Status**: Server actions drafted but incomplete without utility functions

3. **Add "Take Snapshot" button** to dashboard: 📋 PLANNED
   - Simple manual snapshot creation at bottom of dashboard
   - Full-width on mobile, separate from asset/liability containers
   - Success/error feedback to user

### 📅 Phase 3: Chart Visualization (PLANNED)
4. **Install charting library**: `npm install recharts`
5. **Create chart components** (`src/components/trends/`):
   - `NetWorthChart.tsx` - Fidelity-style line chart
   - `TimeRangeSelector.tsx` - 6M, 1Y, 2Y, All time options
   - Responsive design matching existing UI patterns

### 🎨 Phase 4: Dashboard Integration (PLANNED)
6. **Add trends section** to main dashboard
7. **Data transformation utilities** for chart consumption
8. **Enhanced UI** with growth indicators and trend summaries

## Technical Decisions Made

### Database Design
- **Separate fields**: Store `networth`, `assets`, `liabilities` separately for chart flexibility
- **Single timestamp**: Use `createdAt` only (snapshots don't get updated)
- **Manual snapshots**: Start with "Take Snapshot" button, add automation later
- **Naming**: Follow existing conventions (camelCase fields, plural table names)

### Architecture Approach
- **Clean Code Principles**: Extend existing patterns rather than creating new ones
- **Reuse calculations**: Leverage existing `getNetWorthSummary()` from `calculations.ts`
- **Type Safety**: Maintain existing TypeScript patterns
- **Error Handling**: Match current server action error patterns

## Key Learning Points
1. **Prisma migrations**: Use `npx prisma migrate dev --name [name]` for schema changes
2. **Data flow**: Database fields don't auto-calculate - need to "wire" calculations manually
3. **Pattern consistency**: Following existing file patterns makes code maintainable
4. **Phase approach**: Start simple (manual snapshots) then add complexity (automation)

## Current Status - Sept 29, 2025
- ✅ **Phase 1**: Database foundation complete and tested
- 🔄 **Phase 2**: Server actions partially implemented, utilities needed
- ⏳ **Next**: Complete snapshot utilities to unblock server actions
- 📊 **Future**: Chart visualization and dashboard integration

## Implementation Notes & Lessons
### Server Action Development Insights
- **Dependency order matters**: Utilities → Server Actions → UI Components
- **Pattern consistency**: Following existing CRUD patterns from assets/liabilities
- **Auth integration**: Reusing existing user fetching actions for DRY approach
- **Error handling**: Matching existing server action error patterns

### Current Blockers
1. **Server actions incomplete**: `createSnapshotAction()` needs `createSnapshot()` utility
2. **Function calls incomplete**: `getSnapshotAction()` fetching wrong data
3. **Import dependencies**: Need snapshot utilities import in `actions.ts`

## Next Session Goals
1. ✅ **PRIORITY**: Complete `src/lib/snapshots.ts` with CRUD utilities
2. ✅ Fix server actions in `actions.ts` (import utilities, fix function calls)
3. ✅ Implement "Take Snapshot" button on dashboard
4. ✅ Test end-to-end snapshot creation flow