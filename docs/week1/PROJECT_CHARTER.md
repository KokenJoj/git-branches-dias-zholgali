# Project Charter — GreenWeekend  
**Smart Greenhouse · Week 1 · Idea and Team**

**Repository:** _paste GitHub link here after creating the repo_  
**Document version:** 1.0 · November 2026  
**Team:** Диас (+ teammates — list names in README)

---

## 1. App name and one-sentence description

**Name:** GreenWeekend  

**Description:** GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.

---

## 2. Target user

Our primary user is a family that keeps a small vegetable greenhouse at a dacha (for example near a city in Kazakhstan) and lives in the city during the work week. They usually drive to the dacha only on Friday evening or Saturday morning and leave again on Sunday. Midweek they cannot check soil moisture, temperature, or whether ventilation was left open after a hot day.

Their main problems are realistic and repeated: plants dry out or overheat between visits; someone forgets to turn irrigation or lighting off before leaving; they only discover damage on the next weekend; they do not want complex farm software — they need a simple phone app that shows “is everything OK?” and can act while they are away. Secondary users are other family members who share the same greenhouse account on their phones.

---

## 3. Own extra feature

**Away Plan (План отсутствия)**  

**Formula:** Our app can build a short “away” plan for N days (tighten thresholds, force automatic mode, and show a return summary) because our user leaves the greenhouse unattended from Monday to Friday and needs the app to watch it without daily manual control.

How it works (buildable in 6 weeks, mobile-only):

1. User opens Away Plan and chooses return date (or “until Sunday”).
2. App switches to automatic mode and applies slightly stricter thresholds for soil moisture and temperature (values stored in settings / Firebase).
3. While away, normal M4–M5 rules run; alerts still appear in the app.
4. On return, a one-screen summary lists important alerts and how many times irrigation / ventilation turned on.

This is **not** a copy of M4/M5: it is a guided weekend workflow on top of automation and alerts.

---

## 4. Direction (track)

Chosen from the course brief (section 4) — align labels with your instructor’s list if names differ:

1. **Beginner-friendly UX for non-farmers** — large status on the dashboard (“OK / Needs attention”), plain language, minimal steps to start Away Plan.  
2. **Water-conscious automation** — irrigation rules and Away Plan thresholds aim to water only when soil is low, not on a fixed wasteful schedule.

---

## 5. Feature list — required modules M1–M8

| ID | Module | How it works in GreenWeekend |
|----|--------|------------------------------|
| M1 | Login | Email/password via Firebase Auth; logout; wrong password shows a clear error; each account is linked to one greenhouse so users do not see each other’s data. |
| M2 | Dashboard | Shows air temperature, air humidity, soil moisture, light level, and time of last update; values refresh live when Firebase test data changes. |
| M3 | Control | Buttons for irrigation, ventilation, and lighting; a tap writes on/off to Firebase within seconds and the UI confirms the new state. |
| M4 | Modes | Manual vs automatic switch; in automatic mode, e.g. soil moisture below the user’s threshold → irrigation on (and off when recovered). |
| M5 | Alerts | When a reading leaves the allowed range (e.g. 45 °C), an in-app alert appears with clear text; tap opens the relevant screen. |
| M6 | History | Charts for at least two parameters (e.g. temperature and soil moisture) with day / week period switch. |
| M7 | Settings | User edits thresholds, simple schedule, and units (°C / %); automation and Away Plan read the saved values immediately. |
| M8 | No internet | Banner or screen message “No connection”; no crash; when the network returns, live data and control work again. |

---

## 6. Team setup

- GitHub repository created for the project.  
- All team members added as collaborators.  
- README lists names and roles (who designs, who codes what).  

See root `README.md`.

---

## 7. What we will show at Week 1 defense

1. App name + one-sentence description.  
2. Target user and their problem.  
3. Extra feature (Away Plan) and why the user needs it.  
4. GitHub: members + README roles.

---

## 8. Out of scope (reminder from the brief)

- No physical sensors, Arduino/ESP, or extra desktop programs.  
- Data is test data in Firebase / Supabase, edited in the console for demos.
