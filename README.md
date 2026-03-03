# CodeFTC

Codecademy-style interactive learning platform for FTC (FIRST Tech Challenge) programming in Java. Students read lesson content in a left panel and write/run real Java code in a Monaco editor on the right. Code is compiled and executed entirely in the browser using CheerpJ (a WebAssembly-based JVM), with automated test results returned in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | Monaco Editor |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | NextAuth.js v5 (GitHub, Google, Discord) |
| Java Execution | CheerpJ 3.0 (in-browser WASM JVM) |
| Package Manager | Bun |

## Local Development

**Prerequisites**: Bun, a PostgreSQL instance (provided via Docker Compose).

```bash
# Install dependencies
bun install

# Start PostgreSQL
bun run db:up

# Run database migrations
bun run db:migrate

# Build CheerpJ assets (compile FTC stubs JAR + download OpenJDK 8 tools.jar)
bun run build:cheerpj

# Download the FTC Robot Controller template (needed for project downloads)
bun run setup:ftc-template

# Start the dev server (Turbopack)
bun run dev
```

The app is available at `http://localhost:3000`.

### Environment Variables

Copy `.env.docker.example` to `.env.local` and fill in the values:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for NextAuth (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | Set to `true` in development |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth app credentials |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` | Discord OAuth credentials |

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run build:cheerpj` | Compile FTC stubs JAR and download tools.jar for browser execution |
| `bun run docker:up` / `down` | Start/stop Docker Compose services |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:reset` | Wipe and restart the database |
| `bash scripts/build-and-push.sh` | Build and push the Next.js Docker image to the registry |

## Project Structure

```
app/                        # Next.js App Router pages and API routes
  api/progress/             # Student progress (load/save code)
  api/analytics/            # Event tracking and code run recording
  api/download-project/     # Download code as FTC project ZIP
  api/admin/                # Admin analytics and config
  lessons/[module]/[lesson] # Dynamic lesson pages
components/                 # React components
content/lessons/            # Lesson content (one directory per lesson)
lib/                        # Utilities
  cheerpj-executor.ts       # In-browser Java compilation and execution
  cheerpj-context.tsx       # CheerpJ runtime initialization provider
  lessons.ts                # Lesson metadata loader
  types.ts                  # Shared TypeScript types
ftc-stubs/                  # FTC SDK stub classes compiled into ftc-stubs.jar
public/cheerpj/             # CheerpJ runtime assets (ftc-stubs.jar, tools.jar)
prisma/                     # Database schema and migrations
e2e/                        # Playwright end-to-end tests
.github/workflows/          # CI (lint, typecheck)
```

## Lesson Structure

Each lesson lives in `content/lessons/<module>/<lesson>/`:

```
content/lessons/01-getting-started/01-hello-opmode/
├── content.mdx      # Lesson text (MDX + gray-matter frontmatter)
├── exercise.json    # Title, test count, hints
├── Starter.java     # Initial code shown in the editor
├── Solution.java    # Reference solution (shown on full hint reveal)
└── Test.java        # Test suite run in the browser
```

The student's code must be in a class named `StudentCode`. `Test.java` instantiates it alongside mock FTC objects and uses `TestBase` assertion helpers (`assertEqual`, `assertNear`, `assertContains`, `assertTrue`) to verify behaviour, then calls `TestBase.printResults()` to emit JSON results.

## In-Browser Java Execution

User code is compiled and run entirely in the browser using [CheerpJ](https://cheerpj.com/), a WebAssembly-based JVM. This means zero server resources are consumed per execution and students can run code unlimited times with no rate limiting.

The execution flow:

1. User clicks **Run** → client-side `executeInBrowser()` is called
2. `StudentCode.java` and `Test.java` are written to CheerpJ's virtual filesystem
3. `javac` is invoked in-browser via `cheerpjRunMain("com.sun.tools.javac.Main", ...)`
4. If compilation succeeds, `Test.main()` is executed
5. Console output is intercepted and parsed as JSON test results
6. Results are displayed in the output panel

**Performance**: ~5s cold compile (first run, lazy-loads 18MB tools.jar), ~1.7s warm compile, ~700ms test execution.

## Deployment

Production uses a single Docker image pushed to `docker.bedson.tech`:

```bash
bash scripts/build-and-push.sh
```

Bring up production services with `docker-compose.prod.yml` (Next.js app + PostgreSQL). An Nginx reverse proxy (config in `nginx.conf`) sits in front on ports 80/443 and proxies to the Next.js container on port 3310.

## CI

GitHub Actions (`.github/workflows/test.yml`) runs on every push and pull request:

1. Installs dependencies with Bun
2. Runs TypeScript type checking
3. Runs ESLint
