# GreenWeekend

GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.

## Team

| Name | Role |
|------|------|
| Zholgali Dias | Team lead, control and automation |
| Basiev David | Design (Figma, logo, style) |
| Umbetalieva Adelya | Data and Firebase |
| Marat Gaukhar | Plant Guide, charts, documents |

## Stack

React, TypeScript, Vite, Firebase Auth, Cloud Firestore.

## Run

```bash
cd app
npm install
npm run dev
```

Copy `app/.env.example` to `app/.env` and put your Firebase web config there.

Sign up, then pair a greenhouse with code `DW-12`.

## Structure

- `app/src/screens` — UI screens
- `app/src/services` — Firebase / data layer
- `app/src/store` — app state
- `docs/PROJECT_CHARTER.md` / `Week1_Project_Charter.pdf` — project charter
