# GreenWeekend — Smart Greenhouse App

**GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.**

Mobile app only (no hardware). Greenhouse readings live in Firebase; test values are edited in the console.

---

## Team and roles

| Name | GitHub | Role | Responsibility |
|------|--------|------|----------------|
| Диас | _add username_ | Team lead · Data / Firebase | Project charter, database schema, auth, live readings |
| _Имя 2_ | _add username_ | Design · UI | Figma, logo, style, screens matching mockups |
| _Имя 3_ | _add username_ | App · Features | Navigation, device control, automation, alerts |
| _Имя 4 (optional)_ | _add username_ | Extra feature · Docs | Away Plan, README, demo video, presentation |

> Replace `_Имя N_` and GitHub usernames before the Week 1 defense. Add every member as a collaborator on this repository.

---

## Week 1 deliverables

- [Project charter (Week 1)](docs/week1/PROJECT_CHARTER.md)
- [Defense script](docs/week1/DEFENSE_SCRIPT.md)

---

## Planned stack (Week 2+)

- **Flutter** — one codebase for Android APK required by Week 6
- **Firebase** — Auth + Firestore (readings, devices, settings, history)

---

## Modules (M1–M8)

| Module | In our app |
|--------|------------|
| M1 Login | Email/password; each user sees only their greenhouse |
| M2 Dashboard | Live air temp, humidity, soil moisture, light + last update |
| M3 Control | Irrigation, ventilation, lighting on/off → Firebase |
| M4 Modes | Manual / automatic; e.g. soil &lt; threshold → irrigation on |
| M5 Alerts | In-app alert when a value leaves the allowed range |
| M6 History | Charts for ≥2 parameters; day / week |
| M7 Settings | Thresholds, schedule, units; used by automation |
| M8 Offline | Clear “no connection” message; recover when online |

**Extra feature:** Away Plan — see the charter.

---

## How to run (filled from Week 3)

Coming after the app skeleton is ready.
