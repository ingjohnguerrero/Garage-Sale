# Deployment Guide

This guide covers deployment options and procedures for the Garage Sale application.

## Overview

Garage Sale is a **static web application** that can be deployed to any static hosting service. This document covers multiple deployment options, with a focus on Firebase Hosting (recommended).

## Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All changes committed to git
- ✅ Tests passing: `npm test -- --run`
- ✅ Build succeeds: `npm run build`
- ✅ Sale dates configured in `src/constants.ts`
- ✅ Items data updated in `src/data/items.csv`
- ✅ Images seeded: `node scripts/seed-from-csv.mjs [--with-sharp]`
- ✅ `.gitignore` excludes `node_modules/` and `dist/`

## Build Process

### Production Build

```bash
npm run build
```

**What happens:**
1. TypeScript compilation (`tsc`)
2. Vite production build
3. Output generated in `dist/` directory

**Build Output:**

```
dist/
├── index.html                    # Entry HTML
├── assets/
│   ├── index-[hash].js          # Main JavaScript bundle (~177KB, ~58KB gzipped)
│   └── index-[hash].css         # Stylesheet (~7.5KB, ~2KB gzipped)
└── images/                       # Copied from public/
    └── items/                    # Item images
```

### Verify Build

Preview the production build locally:

```bash
npm run preview
```

Visit http://localhost:4173 to verify the build works correctly.

## Deployment Options

### 1. Firebase Hosting (Recommended)

Firebase Hosting provides global CDN, SSL, and SPA routing support.

#### Initial Setup

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   # Or use npx for one-time commands
   ```

2. **Login to Firebase:**
   ```bash
   firebase login
   ```

3. **Initialize Firebase (if not already configured):**
   ```bash
   firebase init hosting
   ```
   
   Configuration prompts:
   - **Public directory**: `dist`
   - **Configure as SPA**: **Yes**
   - **Automatic builds with GitHub**: **Optional**
   - **Overwrite index.html**: **No**

4. **Update Project ID:**
   
   Edit `.firebaserc`:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

#### Deploy

**Option 1: Using npm script (recommended):**
```bash
npm run deploy
```

This runs: `npm run build && firebase deploy --only hosting`

**Option 2: Manual deployment:**
```bash
# Build first
npm run build

# Then deploy
firebase deploy --only hosting
```

#### Deployment Output

```
=== Deploying to 'your-project'...

i  deploying hosting
i  hosting[your-project]: beginning deploy...
i  hosting[your-project]: found 10 files in dist
✔  hosting[your-project]: file upload complete
i  hosting[your-project]: finalizing version...
✔  hosting[your-project]: version finalized
i  hosting[your-project]: releasing new version...
✔  hosting[your-project]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

#### Firebase Configuration

The repository includes `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

**Key settings:**
- `public: "dist"` - Serve from build output directory
- `rewrites` - SPA routing (all routes serve index.html)
- `ignore` - Don't deploy these files

#### Firebase Hosting Features

- **Global CDN** - Fast delivery worldwide
- **Free SSL** - HTTPS included
- **Custom domain** - Map your own domain
- **Rollback** - Revert to previous deployment
- **Preview channels** - Test before production
- **Analytics** - View traffic and performance

#### Custom Domain Setup

1. **Add domain in Firebase Console:**
   - Go to Hosting section
   - Click "Add custom domain"
   - Follow verification steps

2. **Update DNS records:**
   - Add A records pointing to Firebase IPs
   - Or CNAME record for subdomain

3. **SSL provisioning:**
   - Firebase automatically provisions SSL
   - Takes a few hours to activate

### 2. Netlify

Netlify offers drag-and-drop deployment and GitHub integration.

#### Option A: Drag and Drop

1. Build locally: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist/` folder to the drop zone
4. Done! Site is live

#### Option B: GitHub Integration

1. **Connect repository:**
   - Sign in to Netlify
   - Click "New site from Git"
   - Connect GitHub
   - Select repository

2. **Configure build:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Netlify configuration (optional):**
   
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Features

- Free SSL
- Continuous deployment from Git
- Preview deployments for PRs
- Custom domains
- Form handling (if needed)

### 3. Vercel

Vercel provides zero-configuration deployment.

#### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow the prompts to configure:
- Set up and deploy
- Link to existing project or create new
- Build command: `npm run build`
- Output directory: `dist`

#### Deploy via GitHub

1. Import repository at https://vercel.com/new
2. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Deploy

#### Features

- Automatic deployments from Git
- Preview URLs for branches
- Custom domains
- Edge caching
- Analytics

### 4. GitHub Pages

GitHub Pages is free hosting for public repositories.

#### Setup

1. **Install gh-pages package:**
   ```bash
   npm install -D gh-pages
   ```

2. **Add deploy script to package.json:**
   ```json
   {
     "scripts": {
       "deploy:ghpages": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Configure base URL in vite.config.ts:**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/Garage-Sale/' // Repository name
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy:ghpages
   ```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Save

**Access:** https://ingjohnguerrero.github.io/Garage-Sale/

#### Limitations

- Must be public repository (or GitHub Pro)
- Slightly slower than dedicated hosting
- Limited to 1GB total size

### 5. Cloudflare Pages

Cloudflare provides fast global CDN hosting.

#### Via Dashboard

1. Log in to Cloudflare dashboard
2. Pages → Create a project
3. Connect GitHub
4. Configure:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Deploy

#### Via Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Deploy
npm run build
wrangler pages publish dist
```

#### Features

- Global CDN with 200+ locations
- Free unlimited bandwidth
- Analytics
- Custom domains
- Preview deployments

### 6. AWS S3 + CloudFront

Enterprise-grade hosting with AWS.

#### Setup

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://your-garage-sale-bucket
   ```

2. **Enable static website hosting:**
   ```bash
   aws s3 website s3://your-garage-sale-bucket \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload files:**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-garage-sale-bucket --delete
   ```

4. **Make public:**
   ```bash
   aws s3api put-bucket-policy \
     --bucket your-garage-sale-bucket \
     --policy file://bucket-policy.json
   ```

5. **Create CloudFront distribution (optional):**
   - Improves global performance
   - Provides SSL
   - Caches content at edge locations

#### Features

- Highly scalable
- Pay-as-you-go pricing
- Full control
- Integration with AWS services

## Continuous Deployment

### GitHub Actions

Automate deployment on push to main branch.

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test -- --run
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-firebase-project-id
```

**Required Secrets:**
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON

### Netlify / Vercel Auto-Deploy

Both platforms automatically deploy on Git push when connected:

1. Connect repository in platform dashboard
2. Configure build settings
3. Push to main branch
4. Platform automatically builds and deploys

## Environment-Specific Configurations

### Development vs Production

Currently, all configuration is in source code. For environment-specific settings:

**Option 1: Environment variables (Vite)**

Create `.env.production`:
```bash
VITE_API_URL=https://api.example.com
VITE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Option 2: Build-time configuration**

Create multiple config files:
```typescript
// src/config/production.ts
export const config = {
  apiUrl: 'https://api.example.com',
  analyticsId: 'UA-XXXXXXXXX-X'
};
```

Import based on environment:
```typescript
import { config } from './config/production';
```

## Post-Deployment Verification

### Checklist

- [ ] Site loads at deployment URL
- [ ] Images display correctly
- [ ] Filters and sorting work
- [ ] Item detail modal opens/closes
- [ ] Browser back button works with modal
- [ ] Mobile responsive layout works
- [ ] All links functional
- [ ] SSL certificate valid (https://)
- [ ] Correct sale window behavior

### Performance Testing

```bash
# Lighthouse audit
npx lighthouse https://your-site.web.app --view

# Check bundle size
npm run build -- --stats
```

**Target Metrics:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

### Monitoring

Consider adding:

1. **Google Analytics:**
   ```html
   <!-- In index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

2. **Error tracking:**
   - Sentry
   - LogRocket
   - Rollbar

3. **Uptime monitoring:**
   - UptimeRobot
   - Pingdom
   - StatusCake

## Rollback Procedures

### Firebase Hosting

```bash
# List previous releases
firebase hosting:releases:list

# Rollback to previous version
firebase hosting:rollback
```

### Netlify

1. Go to Deploys tab
2. Find previous successful deploy
3. Click "Publish deploy"

### Vercel

1. Go to Deployments
2. Find previous deployment
3. Click "Promote to Production"

### Manual Rollback

1. Checkout previous git commit
2. Rebuild: `npm run build`
3. Redeploy: `npm run deploy`

## Troubleshooting

### Build Failures

**TypeScript errors:**
```bash
# Check for type errors
npx tsc --noEmit
```

**Out of memory:**
```bash
# Increase Node memory
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Deployment Failures

**Firebase authentication:**
```bash
# Re-authenticate
firebase logout
firebase login
```

**Wrong project:**
```bash
# Check current project
firebase projects:list

# Switch project
firebase use your-project-id
```

### Runtime Issues

**404 on refresh:**
- Ensure SPA routing configured (rewrites to index.html)
- Check hosting platform documentation

**Images not loading:**
- Verify images in `public/images/` before build
- Check console for 404 errors
- Verify image paths in `items.ts`

**Incorrect sale window:**
- Check server time vs configured times
- Ensure dates in UTC format
- Clear browser cache

## Security Considerations

### HTTPS

All modern hosting platforms provide free SSL. Ensure:
- Site accessible via https://
- No mixed content warnings
- SSL certificate valid

### Content Security

Since this is a static site:
- No API keys in client code
- No sensitive data in bundle
- All content reviewed before deployment

### Headers

Configure security headers (platform-specific):

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

## Cost Estimates

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| **Firebase Hosting** | 10GB storage, 360MB/day transfer | $0.026/GB storage, $0.15/GB transfer |
| **Netlify** | 100GB bandwidth/month | $19/month starter |
| **Vercel** | 100GB bandwidth/month | $20/month pro |
| **GitHub Pages** | 1GB, 100GB bandwidth/month | Free (public repos) |
| **Cloudflare Pages** | Unlimited requests, bandwidth | $20/month (additional features) |
| **AWS S3** | 5GB storage, 15GB transfer (first year) | ~$0.023/GB storage, $0.09/GB transfer |

**Estimated monthly cost for typical garage sale site:**
- Traffic: ~1000 visitors/month
- Bandwidth: ~10GB/month
- Storage: ~500MB

**Result:** $0-5/month on most platforms

## Best Practices

1. **Always test locally before deploying**
   ```bash
   npm run build && npm run preview
   ```

2. **Use preview deployments for testing**
   - Firebase: Preview channels
   - Netlify: Deploy previews
   - Vercel: Preview URLs

3. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

4. **Monitor bundle size**
   ```bash
   npm run build -- --stats
   ```

5. **Backup before major changes**
   ```bash
   git tag v1.0.0
   git push --tags
   ```

6. **Document configuration changes**
   - Update this wiki
   - Add comments in code
   - Update README

---

**Last Updated**: November 2025
