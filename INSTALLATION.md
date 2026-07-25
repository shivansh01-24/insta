# InstaConnect Installation & Local Setup Guide

Follow this guide to get InstaConnect running locally on your computer.

---

## 1. Prerequisites

Make sure you have installed:
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- [PostgreSQL](https://www.postgresql.org/) database running locally or accessible via URL.

---

## 2. Clone & Install Dependencies

```bash
git clone <repository-url>
cd google
npm install
```

---

## 3. Configure Database & Environment

1. Create a `.env` file in the root folder:

```bash
cp .env.example .env
```

2. Open `.env` and set your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/instaconnect_db"
SESSION_SECRET="random_secure_secret_key_string_32chars_minimum"
ENCRYPTION_KEY="random_aes_encryption_key_string_32chars_minimum"

META_APP_ID="your_meta_app_id"
META_APP_SECRET="your_meta_app_secret"
META_REDIRECT_URI="http://localhost:3000/api/instagram/callback"
META_WEBHOOK_VERIFY_TOKEN="verify_token_12345"
META_GRAPH_API_VERSION="v23.0"
```

---

## 4. Run Prisma Database Migrations

Generate Prisma Client types and sync database schema:

```bash
npx prisma generate
npx prisma db push
```

---

## 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the SaaS landing page, register an account, and test the dashboard.
