# InstaConnect Platform (Phase 1 – Meta OAuth Ready)

Production-ready SaaS foundation allowing any customer to connect their own Instagram Professional account through the official Meta OAuth flow.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma**.

---

## 🌟 Core Architecture & Principles

- **Single Platform Meta App**: Our platform owns a single Meta Developer App. Every customer who signs up connects their own Instagram account through official Meta OAuth. Customers never need to create Meta Apps, generate access tokens, or configure webhooks.
- **Single Source of Truth**: All Instagram connection data shown on the dashboard comes directly from PostgreSQL after successful Meta OAuth synchronization.
- **No Mock or Seeded Data**: 100% real Meta OAuth flow. Zero fake accounts or demo simulation.
- **AES-256 Token Encryption**: Long-lived Meta access tokens are encrypted using AES-256-GCM before being persisted.
- **Fail-Fast Environment Validation**: Zod-based runtime schema validation on app startup.
- **Production Security Headers**: Includes `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Strict-Transport-Security`.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- PostgreSQL database (Local or Cloud e.g., Supabase / Neon)
- Meta Developer Account (for configuring `META_APP_ID` & `META_APP_SECRET`)

### 2. Environment Setup
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in required variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/instaconnect"
SESSION_SECRET="super_secret_session_key_at_least_32_characters"
ENCRYPTION_KEY="super_secret_aes_encryption_key_32_chars"

META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_REDIRECT_URI="http://localhost:3000/api/instagram/callback"
META_WEBHOOK_VERIFY_TOKEN="your_custom_webhook_verify_token"
META_GRAPH_API_VERSION="v23.0"
```

### 3. Database Migration
Generate Prisma Client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🛠️ Meta Developer App Setup Guide

To connect real Instagram Professional accounts:

### 1. Create Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/).
2. Click **My Apps** -> **Create App**.
3. Select **Business** app type or the appropriate product type for your business.

### 2. Enable Required Meta Products & Permissions
- Add **Facebook Login** (or *Facebook Login for Business*, depending on your app type).
- Add **Instagram Graph API**.
- Ensure the following minimum permissions are configured:
  - `instagram_basic`
  - `pages_show_list`
  - `business_management`

### 3. Configure OAuth Redirect URIs
In Meta App Dashboard -> **Facebook Login** -> **Settings**:
- Add `http://localhost:3000/api/instagram/callback` to **Valid OAuth Redirect URIs** for local testing.
- Add `https://your-domain.vercel.app/api/instagram/callback` for production.

### 4. Configure Webhooks (Verification Endpoint)
In Meta App Dashboard -> **Webhooks** -> Select **Instagram**:
- **Callback URL**: `https://your-domain.vercel.app/api/webhooks/meta` (or local ngrok URL).
- **Verify Token**: Must match `META_WEBHOOK_VERIFY_TOKEN` in your `.env`.

### 5. Development Mode & Test Users
While your Meta App is in **Development Mode**:
- Only App Admins, Developers, and explicit **Testers** can log in via OAuth.
- Go to **Roles** -> **Roles** -> Add **Instagram Testers** or **Test Users** to test with your own Instagram Professional account.

---

## 🚀 Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set Environment Variables in Vercel Project Settings:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `SESSION_SECRET`
   - `ENCRYPTION_KEY`
   - `META_APP_ID`
   - `META_APP_SECRET`
   - `META_REDIRECT_URI` (e.g. `https://your-app.vercel.app/api/instagram/callback`)
   - `META_WEBHOOK_VERIFY_TOKEN`
   - `META_GRAPH_API_VERSION` (`v23.0`)
4. Deploy!

---

## 📦 Project Structure

```
├── app/
│   ├── (auth)/login, register
│   ├── (dashboard)/dashboard
│   ├── api/
│   │   ├── auth/register, login, logout, session
│   │   ├── instagram/connect, callback, account, unlink
│   │   └── webhooks/meta
│   ├── layout.tsx & page.tsx (Landing Page)
│   └── globals.css
├── components/ (Navbar, Footer)
├── lib/
│   ├── db.ts (Prisma Singleton)
│   ├── auth.ts (BCrypt & Session Cookies)
│   ├── crypto.ts (AES-256 Token Encryption)
│   ├── meta.ts (Meta Graph API SDK v23.0)
│   ├── env.ts (Zod Validation)
│   └── logger.ts (Privacy-Guarded Structured Logger)
├── services/ (auth.service.ts, instagram.service.ts)
├── prisma/ (schema.prisma)
├── README.md
├── INSTALLATION.md
└── ENV_SETUP.md
```
