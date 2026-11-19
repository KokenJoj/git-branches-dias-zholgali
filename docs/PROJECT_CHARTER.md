# Project Charter - GreenWeekend
Smart Greenhouse, Week 1

**Team:** Zholgali Dias, Basiev David, Umbetalieva Adelya, Marat Gaukhar  
**Repository:** https://github.com/KokenJoj/git-branches-dias-zholgali/tree/greenweekend

---

## 1. App name and description

**Name:** GreenWeekend

GreenWeekend is a mobile app for people who visit their dacha only on weekends. It helps them check the greenhouse while they are away and take care of plants when they come back on Friday-Sunday.

---

## 2. Target user

Our main user is a family with a small greenhouse at the dacha. They live in the city during the week and usually arrive on Friday or Saturday and leave on Sunday. Nobody watches the greenhouse on weekdays, so they cannot check temperature, soil moisture, or whether the windows were left open.

Because of this, plants often dry out or get too hot before the next visit. These users are not farmers - they forget watering dates, are unsure which crops to plant when, and mostly want a simple answer: is the greenhouse OK and what should we do this weekend. Other family members may also open the same account from their phones.

---

## 3. Extra feature - Plant Guide

Besides sensors and control, we add a Plant Guide. Weekend visitors need short advice, not only numbers on the dashboard. In Plant Guide we plan:

- Handbook for tomato, cucumber, pepper and greens - short tips and normal ranges for temperature and moisture.
- What to plant by month in a typical dacha greenhouse.
- Reminders for watering, planting and harvest.
- Rough harvest estimate: user picks a crop and number of plants, app shows an approximate yield from simple reference values.
- Photo diary: user uploads a photo and tags the plant (OK, yellow leaves, pests, other). No automatic disease detection from photos.

Plant Guide is our team's own feature. Required modules stay the same: login, dashboard, control, automation, alerts, history, settings and offline mode.

---

## 4. Direction

1. Keep the UI simple for beginners (clear texts, handbook, reminders).
2. Save water - auto irrigation only when soil is dry enough; reminders not to overwater.

---

## 5. Feature list M1-M8

**M1 Login.** Email + password. Error on wrong password. Logout. Each user sees only their greenhouse.

**M2 Dashboard.** Shows air temperature, humidity, soil moisture, light and last update time. Values refresh when data changes.

**M3 Control.** Buttons for irrigation, ventilation and lighting. Press updates device state in the database and in the UI.

**M4 Modes.** Manual and automatic. In auto mode a rule runs, e.g. irrigate when soil moisture falls below the threshold.

**M5 Alerts.** If a value goes out of range (e.g. 45 C), the app shows a clear alert.

**M6 History.** Charts for at least two parameters. Day / week view.

**M7 Settings.** Change thresholds, a simple schedule and units. Automation uses the new values.

**M8 Offline.** If there is no internet, the app shows it, does not crash, and continues when connection returns.

---

## 6. Team and roles

| Name | Role |
|------|------|
| Zholgali Dias | Team lead, app control and automation |
| Basiev David | Design (Figma, logo, style) |
| Umbetalieva Adelya | Data and Firebase |
| Marat Gaukhar | Plant Guide, history charts, documents |

Everyone is added to the GitHub repo. The same roles are listed in the README.
