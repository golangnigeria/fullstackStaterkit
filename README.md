# fullstackStaterkit

A modern, production-grade fullstack monorepo starter kit combining **Go (Echo v4)** on the backend with **Next.js 15 (App Router, React 19, Tailwind CSS v4)** on the frontend, featuring end-to-end type safety via shared TypeScript OpenAPI contracts and a sleek dashboard inspired by Medesk.

---

## 🌟 Key Features

- **🚀 Backend**:
  - High-performance REST API built with **Go** and **Echo v4**.
  - **PostgreSQL** database access using `pgx/v5` with connection pooling and SQL migrations.
  - **Redis** caching and rate limiting.
  - **S3-compatible Object Storage** (MinIO) for file and media uploads.
  - **Limen Auth** session-based authentication engine (secure HTTP-only cookies).
  - Background task scheduling with cron runners.
  - Interactive TUI tool for workspace and database management.

- **🎨 Frontend**:
  - **Next.js 15** with App Router, React 19, and Tailwind CSS v4.
  - **Medesk-Inspired Dashboard**:
    - Floating inset card layout (`bg-sidebar` outer framing `bg-background md:rounded-2xl`).
    - Collapsible icon sidebar with live task counters.
    - Top bar with global `⌘K` search listener and live sync indicator.
    - 4 key metric cards with animated 6-bar sparklines (`MetricBars`).
    - Recharts bar volume & velocity chart with custom tooltips.
    - Segmented horizontal category load bar with CSS animation delays.
    - Filterable active tasks table with direct CSV export.
    - Slide-out task detail drawer (`Sheet`).
  - Dark and Light mode powered by `next-themes` and OKLCH color tokens.
  - Fully typed API client powered by `@tanstack/react-query` and `@ts-rest/core`.

- **📦 Monorepo Architecture**:
  - Managed with **Bun** and **Turborepo**.
  - Shared contracts (`packages/openapi`) and schemas (`packages/zod`) ensuring 100% type safety across frontend and backend.
  - Transactional email templates (`packages/emails`) using **React Email**.
  - Developer automation with **Taskfile** and **Docker Compose**.

---

## 🏗️ Project Structure

```text
.
├── apps/
│   ├── backend/               # Go Echo API service
│   │   ├── cmd/
│   │   │   ├── tutorlinkng/   # Main API server entrypoint
│   │   │   ├── cron/          # Scheduled background worker
│   │   │   └── tui/           # Terminal UI administrative tool
│   │   ├── internal/          # Domain services, middleware, handlers & database
│   │   └── templates/         # HTML & email rendering templates
│   │
│   └── frontend/              # Next.js 15 App Router web app
│       └── src/
│           ├── app/           # App Router pages ((auth), (dashboard), landing, not-found)
│           ├── api/           # Typed API client & TanStack Query hooks
│           ├── components/    # Reusable UI widgets, layout, sidebar & dashboard cards
│           ├── config/        # Environment configurations
│           └── lib/           # Limen Auth client & shared helpers
│
├── packages/
│   ├── emails/                # React Email templates (Welcome, Reset Password, Verification)
│   ├── openapi/               # Shared ts-rest contract definitions & schemas
│   └── zod/                   # Zod schemas & models shared across services
│
├── infrastructure/            # Docker configurations (Postgres, Redis, MinIO)
├── docker-compose.yml         # Local container orchestration
├── Taskfile.yml               # Automated developer task runner
└── turbo.json                 # Turborepo task pipelines
```

---

## ⚡ Quick Start

### Prerequisites
- [Go](https://go.dev/) (1.23+)
- [Bun](https://bun.sh/) (1.1+) or Node.js (20+)
- [Docker](https://www.docker.com/) & Docker Compose
- [Task](https://taskfile.dev/) runner (`go install github.com/go-task/task/v3/cmd/task@latest` or `scoop install task`)

### 1. Clone the repository
```bash
git clone https://github.com/golangnigeria/fullstackStaterkit.git
cd fullstackStaterkit
```

### 2. Install dependencies
```bash
bun install
```

### 3. Start local infrastructure & services
```bash
# Start Docker dependencies (PostgreSQL, Redis, MinIO S3)
task up

# Run database migrations
task db:migrate

# Start development servers (Backend on :8080, Frontend on :3000)
task dev
```

Alternatively, you can run services individually:
```bash
# Backend only
task dev:api

# Frontend only
bun run --filter frontend dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the frontend application.
The backend API is accessible at [http://localhost:8080](http://localhost:8080).

---

## 🛠️ Available Tasks

| Command | Description |
| :--- | :--- |
| `task up` | Start PostgreSQL, Redis, and MinIO in Docker containers |
| `task down` | Stop and tear down local infrastructure containers |
| `task db:migrate` | Execute pending database migrations |
| `task dev` | Start infrastructure, run migrations, and launch backend & frontend |
| `bun run build` | Build all packages and the Next.js production bundle |
| `bun run typecheck` | Run TypeScript typechecking across all monorepo workspaces |
| `task tui` | Launch the terminal UI administrative management dashboard |

---

## 🔒 Authentication & Security

- Session authentication handled by **Limen Auth**.
- Passwords hashed using standard cryptographic algorithms.
- Same-Site HTTP-only cookie tokens to protect against cross-site scripting (XSS).
- Role and session verification middleware on the Go backend.

---

## 📄 License

MIT License. Free to use as a starting template for your personal, commercial, and enterprise fullstack applications.
