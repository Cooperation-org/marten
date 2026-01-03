# Marten: Linear-like Taiga Frontend

## Deployment

**URL**: https://marten.linkedtrust.us

**Source**: `/home/ubuntu/marten`

**Build output**: `/home/taiga/marten-build`

**Deploy commands**:
```bash
cd /home/ubuntu/marten
npm run build
sudo rm -rf /home/taiga/marten-build/*
sudo cp -r build/* /home/taiga/marten-build/
sudo chown -R taiga:taiga /home/taiga/marten-build
```

**Nginx config**: `/etc/nginx/conf.d/marten.conf`
- Static files from `/home/taiga/marten-build`
- API proxied to Taiga backend at `127.0.0.1:8001`
- Media proxied to `127.0.0.1:8003`

**Taiga API**: https://taiga.linkedtrust.us/api/v1/

---

## Design Principles
- **Fast and snappy**: Optimistic updates, instant feedback
- **Minimal UI**: Only show what's needed
- **Keyboard-first**: Shortcuts for everything
- **Dark theme**: Easy on the eyes

---

## Current State
- [x] Project list with archive/unarchive
- [x] Create project modal
- [x] Edit project (right-click menu)
- [x] Delete project with confirmation
- [x] Basic board view with drag-and-drop
- [x] Issue detail modal (central popup)
- [x] Edit issue (title, description, status, assignee)
- [x] Delete issue with confirmation
- [x] Backlog view
- [x] Epics view
- [x] Velocity chart

---

## Next Up
- [ ] Project settings page (members, statuses)
- [ ] Filters & views on board
- [ ] Keyboard shortcuts

---

## Future Features

### Board Improvements
- Filters (by assignee, epic, label)
- Save custom views
- Toggle closed issues
- Swimlanes (group by epic/assignee)

### Issue Detail Enhancements
- Rich markdown editor
- @mentions
- Comments/activity feed
- Paste images

### Project Management
- Project settings page
- Manage members
- Configure statuses

### Advanced
- Bulk actions (multi-select, bulk status change)
- Keyboard shortcuts
- Global search

---

## Technical Notes

### State Management
- Svelte stores for global state
- Optimistic updates everywhere

### API
- Uses Taiga REST API v1
- Auth via Bearer token in localStorage
- Main endpoints:
  - `/projects` - CRUD projects
  - `/userstories` - CRUD issues
  - `/userstory-statuses` - status definitions
  - `/users?project=X` - project members
