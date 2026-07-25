# Environment Variables Reference & Setup Guide

This document describes all required environment variables for InstaConnect.

---

## Required Environment Variables

| Variable Name | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/dbname` |
| `SESSION_SECRET` | Yes | Secret key used to sign HTTP-only session cookies (min 16 chars) | `my_super_secret_session_key_32_chars` |
| `ENCRYPTION_KEY` | Yes | Key used for AES-256 token encryption (min 16 chars) | `my_super_secret_aes_key_32_chars_123` |
| `META_APP_ID` | Yes | App ID from Meta Developer Dashboard | `123456789012345` |
| `META_APP_SECRET` | Yes | App Secret from Meta Developer Dashboard | `a1b2c3d4e5f6g7h8i9j0` |
| `META_REDIRECT_URI` | Yes | OAuth Callback URL | `http://localhost:3000/api/instagram/callback` |
| `META_WEBHOOK_VERIFY_TOKEN` | Yes | Custom secret string for Meta webhook verification | `meta_webhook_secret_verify_token_99` |
| `META_GRAPH_API_VERSION` | Optional | Meta Graph API Version (defaults to `v23.0`) | `v23.0` |
| `NODE_ENV` | Optional | Runtime environment (`development`, `production`, `test`) | `development` |

---

## Security Best Practices

1. **Never commit `.env` to Git**: Always keep secret keys in local `.env` or Vercel Environment Variables.
2. **Key Length**: Use at least 32 random characters for `SESSION_SECRET` and `ENCRYPTION_KEY`.
3. **Meta App Secret**: Treat `META_APP_SECRET` as a root password. Never expose it to client components or logs.
