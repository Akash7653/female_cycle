# SkyLove Cycle — Backend (server/)

Node.js + Express + MongoDB Atlas API for **SkyLove Cycle**.

## Setup

```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, SMTP creds
npm install
npm run dev
```

Server runs on `http://localhost:8787`.

## Environment

See `.env.example` for all variables (`MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `SMTP_*`, `CLIENT_URL`, `PORT`).

## API Endpoints

All `/api/*` routes (except `auth/register`, `auth/login`, `auth/forgot`) require a `Authorization: Bearer <token>` header.

| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/register` | Register, returns JWT + user |
| POST | `/api/auth/login` | Login, returns JWT + user |
| POST | `/api/auth/forgot` | Send password reset email |
| GET | `/api/auth/me` | Current user |
| PUT | `/api/auth/me` | Update profile |
| DELETE | `/api/auth/me` | Delete account |
| GET | `/api/cycles` | List cycles |
| POST | `/api/cycles` | Add cycle (blooms a flower if endDate set) |
| PUT | `/api/cycles/:id` | Update cycle |
| DELETE | `/api/cycles/:id` | Delete cycle |
| GET | `/api/symptoms` | List symptoms |
| POST | `/api/symptoms` | Set symptoms for a date |
| GET | `/api/moods` | List moods |
| POST | `/api/moods` | Set mood for a date |
| GET | `/api/journals` | List journals |
| POST | `/api/journals` | Add journal |
| DELETE | `/api/journals/:id` | Delete journal |
| GET | `/api/water` | List water logs |
| POST | `/api/water` | Set water for a date |
| GET | `/api/medicines` | List medicines |
| POST | `/api/medicines` | Add medicine |
| PATCH | `/api/medicines/:id/toggle` | Toggle completed |
| DELETE | `/api/medicines/:id` | Delete medicine |
| GET | `/api/partner` | Get partner permissions |
| PUT | `/api/partner` | Update partner permissions |
| GET | `/api/flowers` | List Memory Garden flowers |
| GET | `/api/notifications` | List notifications |
| PATCH | `/api/notifications/:id/read` | Mark notification read |
| GET | `/api/predictions` | Current cycle prediction |

## Security

- JWT auth with `bcryptjs` password hashing
- Zod input validation on all write endpoints
- Rate limiting (general + auth-specific)
- Per-user data scoping on every query
- `node-cron` daily job generates period-approaching notifications

## Deployment (Render)

- Build command: `npm install`
- Start command: `npm start`
- Add all env vars from `.env.example` in the Render dashboard.
