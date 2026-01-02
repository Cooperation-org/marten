# Marten: Linear-like Taiga Frontend

## Design Principles
- **Fast and snappy**: Optimistic updates, instant feedback
- **Minimal UI**: Only show what's needed
- **Keyboard-first**: Shortcuts for everything
- **Dark theme**: Easy on the eyes

---

## Current State
- [x] Project list with archive/unarchive
- [x] Create project modal
- [x] Basic board view
- [x] Backlog view
- [x] Epics view
- [x] Velocity chart

---

## Phase 1: Core UX Polish

### 1.1 Command Palette (Cmd+K)
- Quick navigation to any project/view
- Create issue, project, epic
- Search across everything
- Recent items

### 1.2 Keyboard Shortcuts
- `C` - Create new issue (in context)
- `P` - Create project
- `G B` - Go to Board
- `G L` - Go to Backlog
- `G E` - Go to Epics
- `/` - Focus search
- `?` - Show shortcuts

### 1.3 Issue Quick Create
- Inline creation in board columns
- Just type and press Enter
- Tab to add more fields

---

## Phase 2: Board View Improvements

### 2.1 Drag & Drop
- Smooth card reordering
- Cross-column moves
- Visual feedback during drag

### 2.2 Card Design
- Compact by default
- Expand on hover for details
- Show assignee avatar
- Color-coded by epic/priority

### 2.3 Filters & Views
- Filter by assignee, epic, label
- Save custom views
- Toggle closed issues

---

## Phase 3: Issue Detail

### 3.1 Side Panel
- Open issue in side panel (not new page)
- Edit inline
- Close with Escape

### 3.2 Rich Editor
- Markdown support
- Paste images
- @mentions

### 3.3 Activity Feed
- Comments
- History
- Linked items

---

## Phase 4: Project Views

### 4.1 Project Settings
- Edit name/description
- Manage members
- Configure statuses

### 4.2 Project Overview
- Summary stats
- Recent activity
- Quick links

### 4.3 Swimlanes
- Group by epic/assignee/priority
- Collapsible lanes

---

## Phase 5: Advanced Features

### 5.1 Bulk Actions
- Select multiple issues
- Bulk status change
- Bulk assign

### 5.2 Notifications
- Real-time updates
- Toast notifications
- Desktop notifications (optional)

### 5.3 Search
- Global search
- Filters
- Save searches

---

## Technical Approach

### State Management
- Use Svelte stores for global state
- Optimistic updates everywhere
- Cache API responses

### Performance
- Virtual scrolling for long lists
- Lazy load images
- Debounce API calls

### Offline Support (Future)
- Service worker caching
- Queue mutations when offline
- Sync when back online

---

## Priority Order
1. Command palette (biggest productivity boost)
2. Issue side panel (faster workflow)
3. Keyboard shortcuts
4. Board drag & drop improvements
5. Filters & views
