# GreenWeekend — Smart Greenhouse App

**GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.**

Mobile app only (no hardware). Greenhouse readings live in Firebase; test values are edited in the console.

---

## Team and roles

| Name | GitHub | Role | Responsibility |
|------|--------|------|----------------|
| Zholgali Dias | _add username_ | Team lead · App / Control & automation | Charter, navigation, device control (M3), modes (M4), offline (M8) |
| Basiev David | _add username_ | Design · UI | Figma, logo, colors, fonts, screens match mockups |
| Umbetalieva Adelya | _add username_ | Data / Firebase | Database schema, auth, live readings, settings (M1, M2, M7) |
| Marat Gaukhar | _add username_ | Extra feature · History & docs | Plant Guide, charts (M6), alerts (M5), README, video, presentation |

> Add every member as a collaborator on this repository. Fill GitHub usernames before the defense.

---

## Week 1 deliverables

- [Project charter (Week 1)](docs/week1/PROJECT_CHARTER.md)
- [Defense script](docs/week1/DEFENSE_SCRIPT.md)
- Printable PDF source: [PROJECT_CHARTER.html](docs/week1/PROJECT_CHARTER.html)

---

## Planned stack (Week 2+)

- **Flutter** — one codebase for Android APK required by Week 6
- **Firebase** — Auth + Firestore (readings, devices, settings, history, plant guide data)

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

**Extra feature:** Plant Guide — handbook, planting tips, care reminders, harvest estimate, photo diary (manual condition tags). See the charter.

---

## How to run (filled from Week 3)

Coming after the app skeleton is ready.
