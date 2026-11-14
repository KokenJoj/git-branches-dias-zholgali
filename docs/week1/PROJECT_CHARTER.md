# Project Charter — GreenWeekend
Smart Greenhouse, Week 1

**Team:** Zholgali Dias, Basiev David, Umbetalieva Adelya, Marat Gaukhar  
**Repository:** (add GitHub link)

---

## App name and description

**Name:** GreenWeekend

**One sentence:** GreenWeekend helps weekend dacha owners keep their greenhouse healthy between Friday and Sunday visits.

---

## Target user

We focus on a family that has a small greenhouse at the dacha and lives in the city most of the week. They usually come on Friday or Saturday and leave on Sunday. During the week nobody is there to check temperature, soil moisture or if the ventilation was left open.

Because of that, plants often dry out or overheat before the next weekend. Many of these people are not professional farmers. They forget watering and planting dates, do not know which crops fit the season, and want a simple answer: is the greenhouse OK, and what should we do next. Other family members may use the same app on their phones.

---

## Our extra feature

**Plant Guide**

Our app can show a plant handbook, planting recommendations, care reminders, a rough harvest estimate, and a photo diary with simple health tags because our user comes only on weekends and often needs basic advice, not only sensor numbers.

What we plan to build:

- Handbook for common crops (tomato, cucumber, pepper, greens) with short care tips and normal ranges for temperature and moisture.
- Recommended plantings by month for a typical dacha greenhouse.
- Reminders for watering, planting and harvest time.
- Approximate harvest: user enters the crop and how many plants, the app shows a rough yield range from simple reference values.
- Photo diary: user adds a photo and marks the plant as OK, yellow leaves, pests, or other. The app does not recognize diseases from the photo by itself.

Plant Guide is separate from the required modules. Login, dashboard, control, automation, alerts, history, settings and offline mode stay as required. Plant Guide is the advice and planning part for the same user.

---

## Direction

1. Easy to use for beginners who are not farmers (clear texts, handbook, reminders).
2. Careful with water (automatic irrigation only when soil is dry enough; reminders not to overwater).

---

## Feature list M1–M8

**M1 Login.** Email and password. Wrong password shows an error. Logout works. Each user sees only their own greenhouse.

**M2 Dashboard.** Air temperature, air humidity, soil moisture, light, and time of last update. Values update when data in the database changes.

**M3 Control.** Buttons for irrigation, ventilation and lighting. A press changes the device state in the database, and the app shows the new state.

**M4 Modes.** Manual and automatic. In automatic mode a rule works, for example: soil moisture below the set threshold turns irrigation on.

**M5 Alerts.** If a value goes outside the allowed range (for example 45 °C), the app shows an alert with clear text.

**M6 History.** Charts for at least two parameters. User can choose day or week.

**M7 Settings.** User can change thresholds, a simple schedule and units. Automation uses the new values.

**M8 No internet.** The app shows that there is no connection, does not crash, and works again when the internet returns.

---

## Team and roles

| Name | Role |
|------|------|
| Zholgali Dias | Team lead, app control and automation |
| Basiev David | Design (Figma, logo, style) |
| Umbetalieva Adelya | Data and Firebase |
| Marat Gaukhar | Plant Guide, history charts, documents |

All members are added to the GitHub repository. Roles are also listed in the README.
