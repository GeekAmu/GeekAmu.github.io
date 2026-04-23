# GeekamuWeb

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.3.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

---

## Deploy to Azure App Service (Free F1 Tier)

### 1. Create a free Azure account

Go to [portal.azure.com](https://portal.azure.com) and sign up for a free account if you don't have one.

### 2. Create an App Service

1. In the Azure Portal, click **Create a resource** → search for **App Service** → click **Create**.
2. Fill in the basics:
   - **Subscription**: your subscription
   - **Resource Group**: create new or use existing
   - **Name**: choose a unique name (e.g. `geekamu-web`) — this becomes `<name>.azurewebsites.net`
   - **Publish**: Code
   - **Runtime stack**: Node 20 LTS
   - **Operating System**: Linux
   - **Region**: pick the closest to you
3. Under **Pricing plans**, click **Explore pricing plans** and select **F1 (Free)**.
4. Click **Review + create** → **Create**.

### 3. Configure the startup command

Angular builds a static site — you need a lightweight server to serve it:

1. In your App Service, go to **Settings** → **Configuration** → **General settings**.
2. Set **Startup Command** to:
   ```
   pm2 serve /home/site/wwwroot/browser --no-daemon --spa
   ```
3. Click **Save**.

### 4. Get the publish profile

1. In your App Service, go to **Overview**.
2. Click **Download publish profile** — save the `.PublishSettings` file.
3. Open your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
4. Name: `AZUREAPPSERVICE_PUBLISHPROFILE`
5. Value: paste the entire contents of the `.PublishSettings` file.

---

## GitHub Actions CI/CD Pipeline

Create the file `.github/workflows/azure-deploy.yml` in the **root of the repository** with the following contents. Replace `<YOUR_APP_SERVICE_NAME>` with the name you chose in step 2 above.

```yaml
name: Build and Deploy to Azure App Service

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/geekamu-web/package-lock.json

      - name: Install dependencies
        run: npm ci
        working-directory: frontend/geekamu-web

      - name: Build
        run: npx ng build --configuration production
        working-directory: frontend/geekamu-web

      - name: Deploy to Azure App Service
        uses: azure/webapps-deploy@v3
        with:
          app-name: <YOUR_APP_SERVICE_NAME>
          publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE }}
          package: frontend/geekamu-web/dist/geekamu-web/browser
```

Once this file is pushed to `main`, GitHub Actions will automatically build and deploy the app on every push to `main`.
