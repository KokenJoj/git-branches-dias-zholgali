# Project Charter — GreenWeekend  
**Smart Greenhouse · Week 1 · Idea and Team**

**Repository:** _paste GitHub link here after creating the repo_  
**Document version:** 1.1 · November 2026  

**Team**

| Name | Role |
|------|------|
| Zholgali Dias | Team lead · App / Control & automation |
| Basiev David | Design · UI |
| Umbetalieva Adelya | Data / Firebase |
| Marat Gaukhar | Extra feature · History & docs |

---

## 1. App name and one-sentence description

**Name:** GreenWeekend  

**Description:** GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.

---

## 2. Target user

Our primary user is a family that keeps a small vegetable greenhouse at a dacha (for example near a city in Kazakhstan) and lives in the city during the work week. They usually drive to the dacha only on Friday evening or Saturday morning and leave again on Sunday. Midweek they cannot check soil moisture, temperature, or whether ventilation was left open after a hot day.

Their main problems are realistic and repeated: plants dry out or overheat between visits; beginners do not know what to plant and when; they forget watering and planting dates; they want a rough idea of harvest and a simple way to track plant health with photos — without complex farm software. Secondary users are other family members who share the same greenhouse account on their phones.

---

## 3. Own extra feature

**Plant Guide (Справочник и уход)**  

**Formula:** Our app can give planting recommendations, a plant handbook, care reminders, an approximate harvest estimate, and a photo diary with health tags because our user is often a beginner who visits only on weekends and needs clear advice, not only sensor numbers.

How it works (buildable in 6 weeks, mobile-only):

1. **Handbook** — cards for common greenhouse crops (tomato, cucumber, pepper, greens): ideal ranges for temperature / moisture, short care tips.  
2. **Recommended plantings** — suggestions by season / month for a typical dacha greenhouse (curated list in the app / Firebase).  
3. **Reminders** — user sets or accepts reminders for watering, planting, and harvest windows (local notifications or in-app list).  
4. **Harvest estimate** — user enters crop + number of plants (or beds); app shows an approximate yield range using simple reference values (not AI).  
5. **Photo diary** — user adds a photo and tags plant condition (OK / yellow leaves / pests / other). Full AI disease detection is **out of scope** for 6 weeks; tags + notes are enough for defense and still useful for the family.

This is **not** a copy of M1–M8: sensors, control, and automation stay as required modules; Plant Guide is the educational / planning layer for the same user.

---

## 4. Direction (track)

Chosen from the course brief (section 4) — align labels with your instructor’s list if names differ:

1. **Beginner-friendly UX / education for non-farmers** — handbook, recommendations, and plain-language reminders.  
2. **Water-conscious automation** — irrigation rules water only when soil is low; reminders reinforce not overwatering.

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
| M7 | Settings | User edits thresholds, simple schedule, and units (°C / %); automation reads the saved values immediately. |
| M8 | No internet | Banner or screen message “No connection”; no crash; when the network returns, live data and control work again. |

---

## 6. Team setup

- GitHub repository created for the project.  
- All four members added as collaborators.  
- README lists names and roles (who designs, who codes what).  

See root `README.md`.

---

## 7. What we will show at Week 1 defense

1. App name + one-sentence description.  
2. Target user and their problem.  
3. Extra feature (Plant Guide) and why the user needs it.  
4. GitHub: members + README roles.

---

## 8. Out of scope (reminder from the brief)

- No physical sensors, Arduino/ESP, or extra desktop programs.  
- Data is test data in Firebase / Supabase, edited in the console for demos.  
- No full AI plant-disease model in the 6-week scope (photo diary with manual tags instead).
