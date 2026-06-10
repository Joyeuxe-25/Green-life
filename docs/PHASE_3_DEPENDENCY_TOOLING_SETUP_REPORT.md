# Phase 3 Dependency And Tooling Setup Report

Date: 2026-06-06

Scope: dependency and tooling setup only. No real public pages, admin features, authentication logic, database schema, backend CRUD endpoints, R2 integration, package installation, deletion, or commit was performed.

## Files Changed

Root:

- `package.json`

Public site:

- `apps/public-site/package.json`
- `apps/public-site/tsconfig.json`
- `apps/public-site/next.config.ts`
- `apps/public-site/tailwind.config.ts`
- `apps/public-site/postcss.config.mjs`
- `apps/public-site/components.json`
- `apps/public-site/app/globals.css`
- `apps/public-site/lib/utils.ts`
- `apps/public-site/components/ui/.gitkeep`

Admin site:

- `apps/admin-site/package.json`
- `apps/admin-site/tsconfig.json`
- `apps/admin-site/next.config.ts`
- `apps/admin-site/tailwind.config.ts`
- `apps/admin-site/postcss.config.mjs`
- `apps/admin-site/components.json`
- `apps/admin-site/app/globals.css`
- `apps/admin-site/lib/utils.ts`
- `apps/admin-site/components/ui/.gitkeep`

Shared package:

- `packages/shared/package.json`

Report:

- `docs/PHASE_3_DEPENDENCY_TOOLING_SETUP_REPORT.md`

## Phase 2 Structure Inspection

Inspected:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/public-site/package.json`
- `apps/admin-site/package.json`
- `apps/api/package.json`
- `packages/shared/package.json`

Findings:

- The workspace structure from Phase 2 was present and coherent.
- The root scripts existed, but `build:shared` used the old `shared` filter name.
- Frontend package files were minimal and lacked Tailwind/shadcn readiness dependencies.
- API package already had the correct minimal Hono/Wrangler/Workers dependency plan.
- Shared package existed but used the unscoped name `shared`.

## Package Files Updated

### Root `package.json`

Updated scripts:

- `build:shared` now uses `pnpm --filter @green-life-rwanda/shared build`.
- Added `typecheck` script using `pnpm --recursive typecheck`.

No root dependencies were added.

### `apps/public-site/package.json`

Prepared dependencies:

- `next`
- `react`
- `react-dom`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `next-themes`

Prepared dev dependencies:

- `typescript`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `tailwindcss-animate`

### `apps/admin-site/package.json`

Prepared dependencies:

- `next`
- `react`
- `react-dom`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `next-themes`
- `react-hook-form`
- `@hookform/resolvers`

Prepared dev dependencies:

- `typescript`
- `@types/node`
- `@types/react`
- `@types/react-dom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `tailwindcss-animate`

### `apps/api/package.json`

No changes were required. It already includes:

- `hono`
- `wrangler`
- `typescript`
- `@cloudflare/workers-types`

### `packages/shared/package.json`

Updated package name:

- `@green-life-rwanda/shared`

Prepared dependency:

- `zod`

No validation schemas were created in Phase 3. `zod` is only prepared as a future dependency.

## Tailwind Setup Summary

Created Tailwind/PostCSS setup for both frontend apps:

- `apps/public-site/tailwind.config.ts`
- `apps/public-site/postcss.config.mjs`
- `apps/admin-site/tailwind.config.ts`
- `apps/admin-site/postcss.config.mjs`

Updated both global CSS files to include:

- `@tailwind base`
- `@tailwind components`
- `@tailwind utilities`
- Minimal CSS variable tokens
- Minimal body/base styling

No final visual design work was done.

## Next.js Workspace Root Warning Patch

After dependency setup, running a frontend dev server may warn that Next.js inferred the wrong workspace root because it detects `C:\Users\Hp\package-lock.json` outside this repository.

Patch applied:

- `apps/public-site/next.config.ts` now sets `turbopack.root` to the absolute monorepo root resolved two levels up from the public app folder.
- `apps/admin-site/next.config.ts` now sets `turbopack.root` to the absolute monorepo root resolved two levels up from the admin app folder.

Retest commands:

```bash
pnpm --filter public-site dev
pnpm --filter admin-site dev
```

## shadcn/ui Readiness Summary

Prepared both frontend apps for future shadcn/ui usage:

- Added `components.json` in each app.
- Added `components/ui/` folder markers.
- Added `lib/utils.ts` with `cn()` helper using `clsx` and `tailwind-merge`.
- Included `class-variance-authority`, `lucide-react`, `tailwindcss-animate`, and related utility dependencies in package manifests.

No shadcn components were generated or added.

## API Tooling Summary

The API remains a minimal Hono Cloudflare Workers skeleton.

Existing placeholder routes remain:

- `GET /`
- `GET /health`

No auth routes, database routes, CRUD routes, D1 schema, migrations, or R2 upload logic were added.

## Shared Package Summary

The shared package remains minimal and exports:

- Module constants
- Media entity type constants
- Basic TypeScript types for future news, events, projects, staff, partners, media files, contact messages, and donation messages

No real validation schemas or business logic were added.

## Cookie-Auth Documentation Confirmation

The existing documentation already states the locked cookie-auth decision:

- Admin auth will use secure HTTP-only cookies.
- Admin auth must not use `localStorage` token storage.
- The backend API will set and clear the session cookie.
- The admin frontend will use credentials-included API requests for authenticated calls.
- `ADMIN_SESSION_SECRET` / session secrets must never be exposed to the frontend.
- Public website does not need admin cookies.
- Admin cookies are only for admin website/API authentication.

Relevant docs:

- `docs/ENVIRONMENT_VARIABLES_PLAN.md`
- `docs/PHASE_2_ARCHITECTURE_SETUP_REPORT.md`

No auth implementation was created in Phase 3.

## Commands For Human To Run Later

Install dependencies:

```bash
pnpm install
```

Run apps after install:

```bash
pnpm --filter public-site dev
pnpm --filter admin-site dev
pnpm --filter api dev
pnpm --filter @green-life-rwanda/shared build
```

Optional checks after install:

```bash
pnpm --recursive typecheck
```

Future shadcn commands to run later, after dependencies are installed and the team approves adding components:

```bash
pnpm --filter public-site dlx shadcn@latest add button card input textarea label
pnpm --filter admin-site dlx shadcn@latest add button card input textarea label table dropdown-menu
```

Do not run shadcn component commands until the UI implementation phase is approved.

## Warnings

- No packages were installed in Phase 3.
- No `node_modules` folder was created.
- Type checks and dev servers were not run because dependencies are not installed.
- Frontend package manifests use `latest` dependency versions; lockfile resolution will happen when the human runs `pnpm install`.
- If Next.js still reports workspace-root warnings, confirm no parent-directory lockfiles are being used for this repository and retest the configured `turbopack.root`.
- `tailwindcss-animate`, `class-variance-authority`, `clsx`, and `tailwind-merge` are prepared for shadcn readiness only.
- Admin form dependencies are listed for later use, but no forms were built.
- `reports.html` still exists in the old static site and should remain excluded from the future rebuild.
- `excluded legacy team meeting image` was not used in Phase 3 files and must remain excluded.

## Recommended Next Phase

Phase 4 should begin only after dependency installation is approved and completed. Recommended Phase 4 focus:

- Run install and basic dev/typecheck verification.
- Initialize shadcn/ui components only as needed.
- Create route/layout shells for public and admin apps.
- Keep public content, admin CRUD, auth implementation, D1 schema, and R2 integration in their own later approved phases.

Stop here until the next phase is explicitly approved.
