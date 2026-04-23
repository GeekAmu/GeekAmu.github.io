# GeekAmu GitHub Pages Setup

This repository contains an Angular site in `frontend/geekamu-web`.

This guide shows how to:
- Run the project locally with npm
- Publish it to GitHub Pages
- Point `geekamu.com` to the published site

## 1) Create the GitHub Pages Repository

For an organization site, the repository must be named exactly:
- `GeekAmu/GeekAmu.github.io`

If you keep this project in a different repository name, GitHub Pages can still work as a project site, but for the cleanest setup with `geekamu.com`, use the org site repo name above.

## 2) Run and Build the Site Locally

From repo root:

```bash
cd frontend/geekamu-web
npm ci
npm run start
```

Then open `http://localhost:4200`.

Production build:

```bash
cd frontend/geekamu-web
npm ci
npm run build -- --configuration production
```

Build output is generated in:
- `frontend/geekamu-web/dist/geekamu-web/browser`

## 3) Add GitHub Actions CI/CD for Pages

Create `.github/workflows/deploy-pages.yml` in the repo root:

```yaml
name: Deploy GeekAmu Site

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
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

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build -- --configuration production

      - name: Add CNAME
        run: echo "geekamu.com" > dist/geekamu-web/browser/CNAME

      - name: Configure Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: frontend/geekamu-web/dist/geekamu-web/browser

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

## 4) Enable GitHub Pages in Repository Settings

In `GeekAmu/GeekAmu.github.io`:
1. Go to **Settings -> Pages**
2. Under **Build and deployment**, choose **GitHub Actions**
3. Save

Push to `main` to trigger deployment.

## 5) Redirect/Point `geekamu.com` to GitHub Pages

Your DNS is currently on DigitalOcean nameservers. In DigitalOcean DNS for `geekamu.com`, set:

- `A` record for `@` -> `185.199.108.153`
- `A` record for `@` -> `185.199.109.153`
- `A` record for `@` -> `185.199.110.153`
- `A` record for `@` -> `185.199.111.153`
- `CNAME` record for `www` -> `GeekAmu.github.io`

Remove old `A` records that point to your droplet/server IP.

Then in GitHub Pages settings:
1. Set custom domain to `geekamu.com`
2. Wait for certificate provisioning
3. Enable **Enforce HTTPS**

## 6) Verify It Works

Use:
- `nslookup geekamu.com`
- `nslookup www.geekamu.com`

Then test:
- `https://geekamu.com`
- `https://www.geekamu.com`

If DNS is still propagating, it can take up to 24 hours, but often updates sooner.
