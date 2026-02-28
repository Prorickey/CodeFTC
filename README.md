# CodeFTC

Codecademy-style interactive learning platform for FTC (FIRST Tech Challenge) programming in Java. Students read lesson content in a left panel and write/run real Java code in a Monaco editor on the right. Code is compiled and executed in an isolated Docker sandbox with automated test results returned in real time.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Editor | Monaco Editor |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | NextAuth.js v5 (GitHub, Google, Discord) |
| Java Sandbox | Docker + JDK 17 Alpine |
| Package Manager | Bun |

## Local Development

**Prerequisites**: Bun, Docker Desktop, a PostgreSQL instance (provided via Docker Compose).

```bash
# Install dependencies
bun install

# Start PostgreSQL
bun run db:up

# Run database migrations
bun run db:migrate

# Build the Java sandbox image
bun run docker:build-sandbox

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
| `EXEC_TMP_DIR` | Temp dir for sandbox execution (defaults to `.tmp-exec`) |

## Scripts

| Script | Description |
|--------|-------------|
| `bun dev` | Start dev server |
| `bun run build` | Production build |
| `bun test tests/` | Run sandbox integration tests |
| `bun run lint` | ESLint |
| `bun run docker:build-sandbox` | Build the Java sandbox image |
| `bun run docker:up` / `down` | Start/stop all Docker Compose services |
| `bun run db:migrate` | Run Prisma migrations |
| `bun run db:studio` | Open Prisma Studio |
| `bun run db:reset` | Wipe and restart the database |
| `bash scripts/build-and-push.sh` | Build and push both Docker images to the registry (parallel) |

## Project Structure

```
app/                        # Next.js App Router pages and API routes
  api/execute/              # Code execution endpoint
  api/progress/             # Student progress (load/save code)
  api/analytics/            # Event tracking
  api/download-project/     # Download code as FTC project ZIP
  api/admin/                # Admin analytics and config
  lessons/[module]/[lesson] # Dynamic lesson pages
components/                 # React components
content/lessons/            # Lesson content (one directory per lesson)
lib/                        # Server-side utilities
  compiler.ts               # Orchestrates sandbox execution
  docker.ts                 # Dockerode wrapper (create/run/destroy containers)
  lessons.ts                # Lesson metadata loader
  types.ts                  # Shared TypeScript types
ftc-stubs/                  # FTC SDK stub classes compiled into the sandbox image
docker/java-sandbox/        # Sandbox Dockerfile and entrypoint
prisma/                     # Database schema and migrations
tests/                      # Integration tests
.github/workflows/          # CI (builds sandbox image, runs tests)
```

## Lesson Structure

Each lesson lives in `content/lessons/<module>/<lesson>/`:

```
content/lessons/01-getting-started/01-hello-opmode/
├── content.mdx      # Lesson text (MDX + gray-matter frontmatter)
├── exercise.json    # Title, test count, hints
├── Starter.java     # Initial code shown in the editor
├── Solution.java    # Reference solution (shown on full hint reveal)
└── Test.java        # Test suite run inside the sandbox
```

The student's code must be in a class named `StudentCode`. `Test.java` instantiates it alongside mock FTC objects and uses `TestBase` assertion helpers (`assertEqual`, `assertNear`, `assertContains`, `assertTrue`) to verify behaviour, then calls `TestBase.printResults()` to emit JSON results.

## Java Sandbox

User code is compiled and run inside an ephemeral Docker container with strict isolation:

- **No network access** (`NetworkMode: none`)
- **256 MB memory limit**, 50% CPU quota, 32 process limit
- **Non-root `sandbox` user**
- **15-second hard timeout**
- Container is automatically removed after each run

The execution flow:

1. `POST /api/execute` → `lib/compiler.ts`
2. Write `StudentCode.java` and copy the lesson's `Test.java` into a temp directory
3. `lib/docker.ts` creates and starts a sandbox container with the temp dir bind-mounted
4. `entrypoint.sh` compiles both files against pre-compiled FTC stubs, then runs `Test`
5. Container stdout (JSON) is parsed and returned to the frontend

## Deployment

Production uses two Docker images pushed to `docker.bedson.tech`:

- `docker.bedson.tech/tbedson/codeftc-nextjs:latest`
- `docker.bedson.tech/codeftc-java-sandbox:latest`

Build and push both in parallel:

```bash
bash scripts/build-and-push.sh
```

Bring up production services with `docker-compose.prod.yml`. An Nginx reverse proxy (config in `nginx.conf`) sits in front on ports 80/443 and proxies to the Next.js container on port 3310.

## CI

GitHub Actions (`.github/workflows/test.yml`) runs on every push and pull request:

1. Builds the Java sandbox image from source
2. Installs dependencies with Bun
3. Runs `bun test tests/` (four sandbox integration tests covering pass, fail, compilation error, and runtime error)
