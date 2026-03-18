# CLAUDE.md — Next.js Full-Stack Project

This file is automatically read by Claude Code at the start of every session.

---

## 1. Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x — strict mode
- **Styling:** Tailwind CSS + shadcn/ui
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Package Manager:** npm
- **Code Quality:** ESLint + Prettier + Husky (pre-commit hooks)

---

## 2. Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type check (tsc --noEmit)
npm run test         # Run all tests
npm run test <file>  # Run a single test file
```

> After completing any task, always run: `npm run lint && npm run type-check`

---

## 3. Project Structure

```
src/
├── app/              # Next.js App Router (pages and layouts)
│   ├── (auth)/       # Auth route group
│   ├── api/          # API Route Handlers
│   └── layout.tsx    # Root layout
├── components/       # Shared reusable UI components
│   ├── ui/           # shadcn/ui components
│   └── shared/       # Custom shared components
├── hooks/            # Custom React hooks (use prefix required)
├── lib/              # API clients, helper functions, config
├── services/         # External API calls and business logic
├── types/            # Shared TypeScript type definitions
└── utils/            # Pure utility functions
prisma/
├── schema.prisma     # Database schema
└── migrations/       # Migration files — DO NOT EDIT MANUALLY
public/               # Static assets
```

---

## 4. Code Style & Conventions

### TypeScript
- `strict` mode always enabled
- `any` type is **forbidden** — use `unknown` and narrow the type
- Interface names: `UserProps`, `AuthState` (no `I` prefix)
- `type` vs `interface`: use `interface` for object shapes, `type` for unions/intersections

### React & Next.js
- **Functional components only** — no class components
- **Server Components** by default; add `"use client"` only when interactivity is needed
- Custom hooks must start with `use` prefix: `useAuth`, `useModal`
- Event handlers must start with `handle` prefix: `handleClick`, `handleSubmit`
- Use **named exports** for everything; default exports only for Next.js pages/layouts

### Import Order
1. React and Next.js imports
2. Third-party libraries
3. Local imports (using `@/` alias)
4. Type imports (`import type { ... }`)

### General Rules
- Use ES modules (`import/export`) — CommonJS `require()` is forbidden
- Comments must explain **WHY**, not what the code does
- Combine Tailwind classes using the `cn()` utility (clsx + tailwind-merge)
- Remove all `console.log` statements before committing

---

## 5. Git Workflow

### Branch Naming
```
feat/ISSUE-123-short-description     # New feature
fix/ISSUE-456-bug-description        # Bug fix
docs/update-readme                   # Documentation
refactor/auth-restructure            # Refactor
chore/update-dependencies            # Dependency updates
```

### Commit Format (Conventional Commits)
```
feat(auth): add user login page
fix(ui): fix button color issue
docs(readme): update setup instructions
refactor(api): restructure service layer
test(auth): add login unit tests
chore(deps): upgrade next.js to 15.1.0
```

**Format:** `type(scope): description` (imperative mood, lowercase, no period)

### Rules
- **Never commit directly to main** — always open a branch
- **Never push directly to main**
- Always include the issue number in the PR description
- Before merging a PR: `npm run lint && npm run type-check` must pass
- For conflict resolution: use **rebase** or **cherry-pick** — never merge
- Husky pre-commit hooks automatically run lint + format on commit

### PR Requirements
- Title must be short and descriptive
- Description must include a list of changes
- Link the related issue number
- Include a test plan

---

## 6. Testing

### Test Frameworks
- **Unit & Component tests:** Jest + React Testing Library
- **Utility functions:** Vitest (faster, for pure JS/TS)

### Rules
- Co-locate test files next to the source: `Button.test.tsx`, `useAuth.test.ts`
- All utility functions must be tested
- New components must have at least a smoke test
- Run `npm run test <file>` — avoid running the full suite unnecessarily

### Testing Principles
- Test user behavior, not implementation details
- Prefer `getByRole`, `getByLabelText` over `getByTestId`

---

## 7. Environment Variables

### File Structure
- `.env.local` → Local development (never committed to git)
- `.env.production` → Production environment (never committed to git)
- `.env.example` → Template with all required keys (committed to git)

### Required Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_SECRET="super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Rules
- **Never hardcode secrets** in source code
- `NEXT_PUBLIC_` prefix only for variables that need to be accessible on the client
- Never commit `.env.local`
- Update `.env.example` whenever a new variable is added

---

## 8. Prisma & Database

- **Never manually edit** migration files in `prisma/migrations/`
- After schema changes run: `npx prisma migrate dev`
- Import Prisma Client from `lib/prisma.ts` (singleton pattern)
- Seed file lives at: `prisma/seed.ts`

---

## 9. Workflow Rules

### Starting a Task
1. For complex tasks (3+ steps), write a **plan first** and wait for approval
2. Then implement step by step
3. Report progress after each step

### Next.js-Specific Guidance
- Always explain whether a Server Component or Client Component is used and **why**
- Show alternative approaches when relevant
- Point out Next.js 15 breaking changes (e.g. route params are now Promises)

### On Errors
- Stop immediately and report the error
- Offer 2-3 solution options and recommend the simplest one
- Do not brute-force retries

### On Task Completion
- Run `npm run lint && npm run type-check`
- Fix any errors before marking the task as done

---

## 10. Required Plugins

### Session Start Check
At the start of every session, check if the following plugins are installed by running `claude plugin list`.
If any are missing, immediately notify the user with the exact install commands before doing anything else.

### Required Plugins

| Plugin | Install Command | When to Use |
|--------|----------------|-------------|
| `feature-dev` | `/plugin install feature-dev@claude-plugins-official` | At the start of **every new feature**. Runs a 7-phase guided workflow: Discovery → Exploration → Questions → Architecture → Implementation → Quality Review → Summary. Always prefer this over ad-hoc feature development. |
| `code-review` | `/plugin install code-review@claude-plugins-official` | Before **every PR**. Launches 4 parallel agents to check for bugs, CLAUDE.md compliance, and code quality. |

### If Plugins Are Missing
Notify the user immediately at session start:
> "Required plugins are not installed. Please run:
> `/plugin install feature-dev@claude-plugins-official`
> `/plugin install code-review@claude-plugins-official`"

---

## 11. Security

- SQL injection: use Prisma parameterized queries
- XSS: sanitize all user inputs
- Add middleware to all routes that require authentication
- Use `next-safe-action` or similar for HTTP headers
- Add rate limiting to all public API endpoints
- Keep dependencies up to date: run `npm audit` regularly
