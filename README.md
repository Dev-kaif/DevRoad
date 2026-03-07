# DevRoad — Backend Mastery Tracker

Your personal backend engineering roadmap with assignments, notes, and streak tracking.

## Stack

- **Next.js ** App Router
- **Better Auth** — Google + GitHub + Email auth
- **Prisma + PostgreSQL** — persistent data
- **Gemini 2.5 Flash** — AI assignment generation
- **shadcn/ui** — components (manually included, no CLI needed)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in:

```env
# Postgres — use local, Supabase, Neon, or Railway
DATABASE_URL="postgresql://user:password@localhost:5432/devroad"

# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# GitHub OAuth — create at github.com/settings/developers
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

# Google OAuth — create at console.cloud.google.com
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Gemini — get at aistudio.google.com
GEMINI_API_KEY="..."
```

### 3. Set up the database

```bash
npm run db:push      # push schema to your DB
npm run db:generate  # generate Prisma client
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## OAuth Setup

### GitHub

1. Go to github.com/settings/developers → New OAuth App
2. Homepage: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`

### Google

1. Go to console.cloud.google.com → Credentials → Create OAuth 2.0 Client
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

---

## Features

### Roadmap (`/roadmap`)

- 15 phases, 400+ checklist items
- Check/uncheck persisted to Postgres
- Phase + item notes with links
- Filter by tag, jump to phase
- Build tasks highlighted separately
- Streak tracking on completion

### Assignments (`/assignments`)

- Create assignments manually
- **Generate with Gemini** — picks phase context, outputs specific buildable tasks
- Built-in countdown timer per assignment
- Track time spent vs limit
- Status: pending → in_progress → completed

### Notes (`/notes`)

- All notes in one searchable view
- Per-phase and per-item notes from Roadmap
- Link storage (Notion, MDN, blog posts, etc.)
- Masonry grid layout

---

## Project Structure

```
src/
  app/
    (auth)/login        # Login page
    (auth)/register     # Register page
    (dashboard)/roadmap # Main checklist
    (dashboard)/assignments # 30-day assignments
    (dashboard)/notes   # All notes
    api/
      auth/[...all]     # Better Auth handler
      checklist/        # POST/GET checklist state
      notes/            # CRUD notes
      assignments/      # CRUD assignments
      ai/               # Gemini generation
  components/
    layout/Sidebar      # Nav sidebar
    roadmap/RoadmapClient
    assignments/AssignmentsClient
    notes/NoteDialog
    notes/NotesClient
    ui/                 # shadcn components
  lib/
    auth.ts             # Better Auth server config
    auth-client.ts      # Better Auth client
    prisma.ts           # Prisma singleton
    roadmap-data.ts     # All 15 phases of content
    utils.ts            # cn()
```
