# GeekAmu Website Deployment Guide

This repository contains an Angular site in `frontend/geekamu-web`.

## Free Hosting Options

### 1) GitHub Pages (Free, easiest if code is on GitHub)
- Cost: Free for public repos, free for private with limits on some plans.
- Best for: Static Angular site with simple deployment from GitHub Actions.
- URL style: `https://<username>.github.io/<repo>/` (project site) or custom domain.

### 2) Cloudflare Pages (Free tier is generous)
- Cost: Free tier includes build + global CDN.
- Best for: Fast global delivery, custom domains, and simple Git integration.
- URL style: `https://<project>.pages.dev` or custom domain.

### 3) Netlify (Free starter tier)
- Cost: Free starter tier.
- Best for: Quick setup with branch previews and easy environment variables.
- URL style: `https://<site-name>.netlify.app` or custom domain.

### 4) Vercel (Hobby plan is free)
- Cost: Free hobby plan.
- Best for: Fast setup, previews, and easy static deploys.
- URL style: `https://<project>.vercel.app` or custom domain.

---

## CI/CD Baseline (Recommended For All Options)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend/geekamu-web
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/geekamu-web/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build -- --configuration production

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: web-dist
          path: frontend/geekamu-web/dist/geekamu-web/browser
```

This gives you:
- Build validation on every PR and push
- A reusable deployment artifact (`web-dist`)
- A clean base you can extend with provider-specific deploy jobs

---

## Option A: GitHub Pages With CI/CD

1. In GitHub repo settings, enable Pages source: **GitHub Actions**.
2. Add `.github/workflows/deploy-github-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend/geekamu-web
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/geekamu-web/package-lock.json

      - run: npm ci
      - run: npm run build -- --configuration production --base-href "/GeekAmu-Website/"

      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/geekamu-web/dist/geekamu-web/browser
      - uses: actions/deploy-pages@v4
```

3. Push to `main`. GitHub Pages will deploy automatically.
4. If using a custom domain, set CNAME in Pages settings.

---

## Option B: Cloudflare Pages With CI/CD

### Fastest setup (no YAML needed)
1. In Cloudflare Pages, connect this GitHub repo.
2. Build command: `npm run build -- --configuration production`
3. Build output directory: `frontend/geekamu-web/dist/geekamu-web/browser`
4. Root directory: `frontend/geekamu-web`
5. Auto-deploy from `main`.

### GitHub Actions deploy (optional)
Use `cloudflare/wrangler-action` with `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets to publish on pushes to `main`.

---

## Option C: Netlify With CI/CD

### Fastest setup (no YAML needed)
1. Import repo into Netlify.
2. Base directory: `frontend/geekamu-web`
3. Build command: `npm run build -- --configuration production`
4. Publish directory: `dist/geekamu-web/browser`
5. Auto-deploy from `main`.

### GitHub Actions deploy (optional)
Use `netlify/actions/cli` with:
- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`

Deploy command example:
`netlify deploy --dir=frontend/geekamu-web/dist/geekamu-web/browser --prod`

---

## Option D: Vercel With CI/CD

### Fastest setup (no YAML needed)
1. Import repo in Vercel.
2. Framework preset: Angular (or Other if needed).
3. Root directory: `frontend/geekamu-web`
4. Build command: `npm run build -- --configuration production`
5. Output directory: `dist/geekamu-web/browser`

### GitHub Actions deploy (optional)
Use Vercel CLI with:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Recommended Path

For this project, choose one of these:
- **Simplest:** Cloudflare Pages or Netlify Git integration (fewest moving parts)
- **Most GitHub-native:** GitHub Pages + Actions workflow above

If you want, the next step is to add the actual `.github/workflows/*.yml` files directly in this repo for your selected platform.
