# GreenWeekend

GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.

This is a mobile app for the Smart Greenhouse course. There is no hardware. The app in `app/` runs in the browser and keeps each person's greenhouse on their phone. A Firebase service file is ready for a later connection.

## Team

| Name | Role |
|------|------|
| Zholgali Dias | Team lead, control and automation |
| Basiev David | Design (Figma, logo, style) |
| Umbetalieva Adelya | Data and Firebase |
| Marat Gaukhar | Plant Guide, charts, documents |

Add all members as collaborators on GitHub.

## Week 1

- Project charter: `docs/week1/PROJECT_CHARTER.md`
- Defense notes: `docs/week1/DEFENSE_SCRIPT.md`
- For PDF: open `docs/week1/PROJECT_CHARTER.html` in the browser and print to PDF

## Stack

React, TypeScript, and Vite. Open it on a phone or in a narrow browser window.

## Modules

- **M1 Login** — account login, only own greenhouse
- **M2 Dashboard** — live temperature, humidity, soil moisture, light
- **M3 Control** — irrigation, ventilation, lighting
- **M4 Modes** — manual / automatic rules
- **M5 Alerts** — warning when values are out of range
- **M6 History** — charts for day or week
- **M7 Settings** — thresholds and units
- **M8 Offline** — message when there is no internet

**Extra feature:** Plant Guide (handbook, planting tips, reminders, harvest estimate, photo diary).

## How to run

```bash
cd app
npm install
npm run dev
```

Open the address Vite prints (usually http://127.0.0.1:5173/). Create an account, then pair a greenhouse with any code, for example `DW-12`.
