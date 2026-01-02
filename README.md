# Martin - Modern Taiga Frontend

A fast, Linear-inspired frontend for Taiga built with SvelteKit. Drop-in replacement for the default Taiga frontend.

## Features

- Kanban board with drag-and-drop
- Backlog list view
- Epics with progress tracking
- Velocity charts and sprint projections
- Dark mode UI
- Works with any existing Taiga backend

## Deploy to Your Taiga Server

### Prerequisites

- Node.js 18+ installed on your server
- Existing Taiga backend running (taiga-back)
- Nginx serving your Taiga instance

### Step 1: Clone and Build

```bash
# Clone the repo
cd /opt
git clone git@github.com:Cooperation-org/martin.git
cd martin

# Install dependencies
npm install

# Build for production
npm run build
```

### Step 2: Configure Nginx

Add this to your Taiga nginx config (usually `/etc/nginx/sites-available/taiga` or similar):

```nginx
# Martin frontend (new UI)
location /martin/ {
    alias /opt/martin/build/;
    try_files $uri $uri/ /martin/index.html;
}
```

Then reload nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

### Step 3: Access

Open `https://your-taiga-server.com/martin/`

Login with your existing Taiga credentials.

---

## Alternative: Replace Default Frontend

To completely replace the old frontend instead of running alongside:

```nginx
# In your nginx config, change the root location:
location / {
    root /opt/martin/build;
    try_files $uri $uri/ /index.html;
}

# Keep the API proxy as-is:
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
    # ... existing proxy settings
}
```

---

## Development

```bash
# Install dependencies
npm install

# Run dev server (proxies API to localhost:8000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Taiga API URL | `/api/v1` (uses nginx proxy) |

For custom API URL, create `.env` before building:
```bash
echo 'VITE_API_URL=https://taiga.example.com/api/v1' > .env
npm run build
```

## Tech Stack

- SvelteKit
- Tailwind CSS
- TypeScript
- Vite
