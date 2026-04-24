# GeekAmu Website

Angular site hosted on Cloudflare Pages at `geekamu.com`.

- Production: `main` branch → `geekamu.com`
- Staging: `staging` branch → `staging.geekamu-web.pages.dev`

---

## Run Locally

```bash
cd frontend/geekamu-web
npm ci
npm start
```

Open `http://localhost:4200`.

---

## Hosting: Cloudflare Pages

Cloudflare Pages handles all builds and deployments automatically when connected to this GitHub repo. No deploy scripts needed — just push to a branch.

### 1) Create a Cloudflare Pages project

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in (or create a free account).
2. In the left sidebar, click **Workers & Pages**, then **Create** → **Pages**.
3. Click **Connect to Git** and authorize Cloudflare to access your GitHub account.
4. Select this repository (`GeekAmu/GeekAmu-Website` or whatever it's named).
5. Click **Begin setup**.

### 2) Configure the build settings

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None (leave blank) |
| Root directory | `frontend/geekamu-web` |
| Build command | `npm run build -- --configuration production` |
| Build output directory | `dist/geekamu-web/browser` |

Click **Save and Deploy**. Cloudflare will run the first build immediately.

### 3) Set up the staging branch

Cloudflare Pages automatically deploys every branch to a unique preview URL. To make `staging` a permanent environment:

1. In the Cloudflare Pages project, go to **Settings** → **Builds & deployments**.
2. Under **Branch deployments**, make sure **All non-production branches** (or at minimum `staging`) is enabled.
3. Create a `staging` branch in git if it doesn't exist:

```bash
git checkout -b staging
git push origin staging
```

Every push to `staging` will now auto-deploy to:
`https://staging.geekamu-web.pages.dev`

You can also alias it to `staging.geekamu.com` — see step 6 below.

---

## Point geekamu.com to Cloudflare Pages

### Step 4) Move DNS to Cloudflare (recommended)

Moving DNS to Cloudflare is free and unlocks CDN, DDoS protection, and automatic HTTPS.

1. In [dash.cloudflare.com](https://dash.cloudflare.com), click **Add a site**, enter `geekamu.com`, and choose the **Free** plan.
2. Cloudflare will scan and import your existing DNS records. Review them — keep anything you need (MX records for email, etc.).
3. Cloudflare will give you two nameservers, e.g.:
   ```
   aria.ns.cloudflare.com
   bob.ns.cloudflare.com
   ```
4. Log in to your domain registrar (wherever you bought `geekamu.com`) and replace the existing nameservers with the two Cloudflare ones.
5. Wait for propagation — usually 15 minutes to a few hours.

> If your DNS is currently managed at DigitalOcean, you are updating nameservers at your **registrar**, not at DigitalOcean. DigitalOcean is just where the records live now; your registrar is where you bought the domain.

### Step 5) Add geekamu.com as a custom domain in Cloudflare Pages

1. In your Cloudflare Pages project, go to **Custom domains**.
2. Click **Set up a custom domain** and enter `geekamu.com`.
3. Also add `www.geekamu.com` and set it to redirect to `geekamu.com`.
4. Because your DNS is now on Cloudflare, it will automatically add the required DNS records. Click **Activate domain**.

Cloudflare handles SSL automatically — HTTPS will be active within a few minutes.

### Step 6) (Optional) Add staging.geekamu.com

1. In Cloudflare Pages → **Custom domains**, click **Set up a custom domain**.
2. Enter `staging.geekamu.com`.
3. Cloudflare will add a DNS record pointing it to your staging branch deployment.

---

## Verify

After DNS propagates:

```bash
nslookup geekamu.com
nslookup www.geekamu.com
```

Then confirm in a browser:
- `https://geekamu.com` → production site
- `https://staging.geekamu.com` → staging site (after step 6)

---

## CI

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs a production build on every push to `main` and `staging`, and on every pull request. This catches build errors before Cloudflare deploys.

Cloudflare Pages also runs its own build — the CI workflow is a fast pre-check so you catch failures in GitHub before they reach Cloudflare.
