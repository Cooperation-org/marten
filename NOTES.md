# Martin - Development Notes

## What's Done

### Core Features
- **Login** - Authenticates with Taiga API (`/api/v1/auth`), stores token in localStorage
- **Project Selector** - Dropdown in sidebar, loads all user's projects, switches context
- **Board View** - Kanban columns by status, cards show ref/subject/tags/epics/points/assignee, drag-drop ready
- **Backlog View** - Table list of all stories, sortable, shows status/assignee/points
- **Epics View** - Card grid with progress bars, story counts
- **Velocity View** - Sprint velocity chart, current sprint progress, completion projections

### Infrastructure
- SvelteKit with TypeScript
- Tailwind CSS (dark mode, custom LinkedTrust brand colors)
- Vite dev server with API proxy to localhost:8000
- Production build outputs static files to `build/`

### API Integration
- `src/lib/api/client.ts` - Fetch wrapper with auth token handling
- `src/lib/api/projects.ts` - Project list/detail
- `src/lib/api/userstories.ts` - Stories + statuses
- `src/lib/api/epics.ts` - Epics CRUD
- `src/lib/api/milestones.ts` - Sprints for velocity

### State Management
- `src/lib/stores/auth.ts` - Login state, token, user info
- `src/lib/stores/project.ts` - Current selected project

---

## What's NOT Done

### High Priority
- [ ] **Drag-drop actually updating API** - UI moves cards but doesn't PATCH status
- [ ] **Create story/epic** - Buttons exist but don't work
- [ ] **TanStack Query** - No caching, no optimistic updates yet
- [ ] **Error handling** - Basic, needs better UX for API failures
- [ ] **Loading states** - Just text, needs spinners/skeletons

### Medium Priority
- [ ] **Story detail view** - Click card to see full description, comments, attachments
- [ ] **Inline editing** - Edit title/points directly in backlog
- [ ] **Filters** - Filter by assignee, epic, tags, status
- [ ] **Search** - Find stories across project
- [ ] **Command palette** - Cmd+K for quick actions (tinykeys installed but not wired)

### Lower Priority
- [ ] **Tasks view** - Sub-tasks within stories
- [ ] **Wiki** - Project wiki pages
- [ ] **Activity feed** - Recent changes timeline
- [ ] **User settings** - Profile, notifications
- [ ] **Bulk actions** - Select multiple stories, bulk update

---

## Architecture

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts      # Fetch wrapper, auth headers, error handling
│   │   ├── types.ts       # TypeScript types matching Taiga API
│   │   ├── projects.ts    # GET /projects
│   │   ├── userstories.ts # GET/PATCH /userstories, /userstory-statuses
│   │   ├── epics.ts       # GET/PATCH /epics
│   │   └── milestones.ts  # GET /milestones (sprints)
│   │
│   ├── stores/
│   │   ├── auth.ts        # Svelte store: user, token, login/logout
│   │   └── project.ts     # Svelte store: currentProject
│   │
│   └── components/
│       └── board/
│           ├── Board.svelte   # Container, groups stories by status
│           ├── Column.svelte  # Status column with drag-drop zone
│           └── Card.svelte    # Story card display
│
├── routes/
│   ├── +layout.svelte     # Sidebar, project selector, auth guard
│   ├── +page.svelte       # Home (redirects to /board)
│   ├── login/+page.svelte # Login form
│   ├── board/+page.svelte # Kanban board
│   ├── backlog/+page.svelte # Story list table
│   ├── epics/+page.svelte # Epic cards grid
│   └── velocity/+page.svelte # Charts and projections
│
└── app.css                # Tailwind imports + custom component classes
```

### Data Flow

```
User logs in
    ↓
auth.login() → POST /api/v1/auth → store token
    ↓
Layout loads → getProjects() → populate dropdown
    ↓
Auto-select first project → currentProject store
    ↓
Each view subscribes to currentProject
    ↓
When project changes → view calls API → renders data
```

### Adding TanStack Query (Next Step)

Replace direct API calls with queries:

```typescript
// Before (current)
let stories = [];
$: if ($currentProject) {
  stories = await getUserStories($currentProject.id);
}

// After (with TanStack Query)
$: storiesQuery = createQuery({
  queryKey: ['userstories', $currentProject?.id],
  queryFn: () => getUserStories($currentProject.id),
  enabled: !!$currentProject
});
```

Benefits:
- Automatic caching
- Background refetching
- Optimistic updates for drag-drop
- Loading/error states built-in

---

## File Locations

| What | Where |
|------|-------|
| Taiga API types | `src/lib/api/types.ts` |
| Auth logic | `src/lib/stores/auth.ts` |
| API base URL | `src/lib/api/client.ts` line 4 |
| Tailwind colors | `tailwind.config.js` |
| Nginx deploy | `README.md` |

---

## Quick Commands

```bash
# Dev
npm run dev          # Start dev server at :5173

# Build
npm run build        # Production build to build/
npm run preview      # Preview production build

# Deploy
git pull && npm install && npm run build
# Then reload nginx
```

---

## Taiga API Reference

| Endpoint | Used For |
|----------|----------|
| POST /auth | Login, returns auth_token |
| GET /projects | List user's projects |
| GET /userstories?project=N | Stories for project |
| GET /userstory-statuses?project=N | Status columns |
| PATCH /userstories/N | Update story (status, points, etc) |
| GET /epics?project=N | Epics for project |
| GET /milestones?project=N | Sprints for velocity |

Full API docs: https://docs.taiga.io/api.html
