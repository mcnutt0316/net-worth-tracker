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

### ✅ Phase 2: Core Snapshot Functionality (COMPLETED)
1. **Create snapshot utilities** (`src/lib/snapshots.ts`): ✅ COMPLETE
   - Database CRUD operations following existing asset/liability patterns
   - Integration with existing `getNetWorthSummary()` calculations
   - Functions: `createSnapshot()`, `getSnapshots()` implemented
   - **Status**: Utilities complete and working

2. **Extend server actions** (`src/app/actions.ts`): ✅ COMPLETE
   - ✅ `createSnapshotAction()` - Fully implemented (lines 228-245)
     - Fetches assets/liabilities using `getAssets()` and `getLiabilities()`
     - Calculates summary using `getNetWorthSummary()`
     - Creates snapshot with proper data mapping
   - ✅ `getSnapshotAction()` - Fully implemented (lines 255-273)
     - Fetches snapshots for authenticated user
     - Converts Decimal types to numbers for frontend compatibility
     - Returns empty array on error (matches existing patterns)
   - **Status**: Server actions complete with proper type conversions and error handling

3. **Add "Take Snapshot" button** to dashboard: ✅ COMPLETE
   - Simple manual snapshot creation at bottom of dashboard
   - Full-width button inside Card component (matches existing financial-card styling)
   - Placed after DashboardClient component for visual flow
   - Uses native HTML form with server action pattern (fire-and-forget)
   - Page auto-revalidates after snapshot creation via `revalidatePath("/")`

### ✅ Phase 3: Chart Visualization (COMPLETED - Oct 12, 2025)
4. **Install charting library**: ✅ COMPLETE
   - Installed recharts for data visualization
5. **Create chart components** (`src/components/trends/`): ✅ COMPLETE
   - ✅ `NetWorthChart.tsx` - Polished line chart implemented
     - Client component with proper "use client" directive
     - Data transformation using `.map()` to convert snapshots to chart format
     - Date formatting: `toLocaleDateString('en-US', { month: 'short', year: 'numeric' })`
     - Recharts components: ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip
     - ✅ **Tooltip**: Interactive hover tooltip with currency formatting
     - ✅ **Currency Formatting**: Both YAxis and Tooltip display proper USD formatting using `Intl.NumberFormat`
     - ✅ **YAxis Width**: Set to `width={100}` to prevent number truncation
     - ✅ **Theme Colors**: Line uses green success color `hsl(142 76% 36%)` for financial growth
     - Responsive design with ResponsiveContainer (width: 100%, height: 400px)
     - Integrated into dashboard at `src/app/page.tsx` line 151
     - Fetches data server-side via `getSnapshotAction()` in Promise.all
   - 📋 `TimeRangeSelector.tsx` - Not yet implemented (6M, 1Y, 2Y, All time options)

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

## Current Status - Oct 12, 2025
- ✅ **Phase 1**: Database foundation complete and tested
- ✅ **Phase 2**: Snapshot utilities and server actions fully implemented
- ✅ **Phase 2 (UI)**: "Take Snapshot" button added to dashboard with blue styling
- ✅ **Phase 3**: Chart visualization complete with full polish
  - ✅ Interactive Tooltip with currency formatting
  - ✅ YAxis and Tooltip both display USD currency format
  - ✅ Theme colors applied (green success color for growth)
  - ✅ Chart wrapped in Card component with proper styling
- ⏳ **Next**: Build TimeRangeSelector component (6M, 1Y, 2Y, All time filters)
- 📊 **Future**: Dashboard integration enhancements (Phase 4)

## Implementation Notes & Lessons
### Server Action Development Insights
- **Dependency order matters**: Utilities → Server Actions → UI Components
- **Pattern consistency**: Following existing CRUD patterns from assets/liabilities
- **Auth integration**: Reusing existing user fetching actions for DRY approach
- **Error handling**: Matching existing server action error patterns

### Completed Blockers (Oct 1, 2025)
1. ✅ **Server actions complete**: Both `createSnapshotAction()` and `getSnapshotAction()` fully implemented
2. ✅ **Function calls fixed**: Proper use of `getAssets()`, `getLiabilities()`, `getSnapshots()`
3. ✅ **Import dependencies**: All utilities properly imported in `actions.ts`
4. ✅ **Type conversions**: Decimal to Number conversions for all snapshot fields

### Key Implementation Details (Oct 1, 2025)
- **Type mismatch resolution**: Used raw database functions (`getAssets()`, `getLiabilities()`) instead of action functions to preserve Prisma Decimal types for calculations
- **Data mapping**: Properly mapped `summary` properties to `CreateSnapshotData` type (totalAssets → assets, etc.)
- **Return patterns**: `getSnapshotAction()` follows existing patterns with empty array returns on errors
- **Async/await**: Proper async handling for all database operations

## Session Progress (Oct 2, 2025)
1. ✅ **PRIORITY**: Complete `src/lib/snapshots.ts` with CRUD utilities ✅ DONE
2. ✅ Fix server actions in `actions.ts` (import utilities, fix function calls) ✅ DONE
3. ✅ Implement "Take Snapshot" button on dashboard ✅ DONE
   - Added wrapper function `takeSnapshot()` in `page.tsx` (lines 19-22)
   - Imported `createSnapshotAction` from `./actions`
   - Created Card component with form at bottom of dashboard (lines 153-164)
   - Learned: Server actions in forms must return `Promise<void>`, not data objects
4. 📋 Test end-to-end snapshot creation flow
5. 📋 Begin chart visualization (Phase 3)

### Key Learning: Server Actions with Forms (Oct 2, 2025)
**Problem encountered**: TypeScript error when returning data from form action
- Forms with `action` attribute expect: `(formData: FormData) => Promise<void>`
- Server actions that return data: `() => Promise<{ success: boolean }>`
- **Solution**: Remove `return` statement - forms use "fire and forget" pattern
- The page auto-revalidates via `revalidatePath("/")`, no return value needed
- **Mental model**: Server Components/Forms = fire & forget, Client Components = need feedback

## Session Progress (Oct 5, 2025) - Chart Visualization
1. ✅ Installed recharts library ✅ DONE
2. ✅ Created `src/components/trends/NetWorthChart.tsx` ✅ DONE
3. ✅ Integrated chart into dashboard ✅ DONE
4. ✅ Implemented server-side data fetching for chart ✅ DONE
5. ✅ Built working line chart with basic visualization ✅ DONE

### Key Learnings: Building with Recharts (Oct 5, 2025)
**Server vs Client Component Boundaries:**
- Chart component is Client Component (`"use client"`) for interactivity
- Data fetching happens server-side in `page.tsx` using `getSnapshotAction()`
- Cannot call database functions (Prisma) directly from Client Components
- Pattern: Server Component fetches → passes props → Client Component displays

**TypeScript Array Types:**
- `Type[]` = array of Type objects
- `[Type]` = tuple with exactly one element (NOT what we want for arrays)
- Can define shape of one object, then use `[]` to indicate array of many

**Data Transformation for Charts:**
- Recharts needs simple objects: `{ date: string, value: number }`
- Use `.map()` to transform database snapshots into chart-friendly format
- Date formatting: `toLocaleDateString('en-US', { month: 'short', year: 'numeric' })`
- Extract only needed fields (date and networth value)

**Recharts Component Structure:**
- `ResponsiveContainer` wraps everything for responsive sizing
- `LineChart` receives the transformed data
- `dataKey` prop tells components which field to use (string matching object keys)
- `XAxis dataKey="date"` - shows dates on X-axis
- `YAxis` - automatically uses numeric values
- `Line dataKey="value"` - plots the actual line using the value field
- `CartesianGrid` adds background grid lines
- Components are declarative - describe what to show, recharts handles rendering

**Learning Approach:**
- Junior engineer learning by doing - only hints provided, no code written
- Reinforced fundamentals: .map(), arrow functions, TypeScript types, component composition
- Successfully debugged syntax errors and conceptual misunderstandings independently

## Session Progress (Oct 7, 2025) - UI Polish
1. ✅ Wrapped NetWorthChart in Card component ✅ DONE
2. ✅ Enhanced button styling across dashboard (color-coded by function) ✅ DONE
3. ✅ Updated heading styling for consistent theme ✅ DONE

## Session Progress (Oct 12, 2025) - Chart Polish
1. ✅ Added Tooltip component to NetWorthChart ✅ DONE
2. ✅ Implemented currency formatting for Tooltip and YAxis ✅ DONE
3. ✅ Fixed YAxis number truncation with width adjustment ✅ DONE
4. ✅ Applied theme colors to chart line (green success color) ✅ DONE

### Key Learnings: Chart Polish & Formatting (Oct 12, 2025)
**Intl.NumberFormat API:**
- Used for currency formatting: `Intl.NumberFormat("en-US", {style: "currency", currency: "USD"})`
- Must call `.format(value)` method to actually format the number
- Currency code is three letters: `"USD"` not `"US"`
- Can be used in both `tickFormatter` (YAxis) and `formatter` (Tooltip) props

**Recharts Formatting:**
- `YAxis` uses `tickFormatter` prop: `tickFormatter={(value) => formatFunction(value)}`
- `Tooltip` uses `formatter` prop: `formatter={(value) => formatFunction(value)}`
- TypeScript may require type assertion: `value as number`
- Both formatters receive the raw data value and return formatted string

**YAxis Width Issues:**
- Long formatted numbers (like `$10,000.00`) can get cut off
- Solution: Add `width` prop to YAxis component (e.g., `width={100}`)
- Alternative: Shorten format by removing decimals with `minimumFractionDigits: 0`

**CSS Variables in React Components:**
- Theme colors defined in `globals.css` using HSL format without `hsl()` wrapper
- To use in React: Wrap in `hsl()` function: `stroke="hsl(142 76% 36%)"`
- Chart colors available: `--chart-1` through `--chart-5`
- Green (`--chart-2: 142 76% 36%`) represents success/growth in financial contexts

**Learning Approach:**
- Junior engineer independently implemented all formatting features with hints only
- Debugged syntax errors (typo: `"currency:"` vs `"currency"`)
- Successfully applied same formatting pattern to multiple components (YAxis and Tooltip)
- Learned to reference theme colors from existing CSS variables for consistency