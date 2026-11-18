import type { CropId, PhotoStatus, ReminderKind } from "../types";

export interface Crop {
  id: CropId;
  name: string;
  summary: string;
  dayMin: number;
  dayMax: number;
  nightMin: number;
  nightMax: number;
  soil: string;
  humidity: string;
  care: string[];
  feeding: string;
  problems: { title: string; body: string }[];
  yieldMin: number;
  yieldMax: number;
  yieldNote: string;
}

export const crops: Crop[] = [
  {
    id: "tomatoes",
    name: "Tomatoes",
    summary: "Warm days, cooler nights, and soil that stays evenly moist. Do not soak the bed.",
    dayMin: 20,
    dayMax: 26,
    nightMin: 16,
    nightMax: 18,
    soil: "35–45%",
    humidity: "60–70%",
    care: [
      "Water in the morning, at the soil, not on the leaves.",
      "Shake the flower truss gently when you visit if the air is still.",
      "Remove yellow leaves near the soil so air can move.",
    ],
    feeding: "A light feed every 7–10 days once fruit is set. Skip a feed if the soil is already wet.",
    problems: [
      { title: "Yellow lower leaves", body: "Often old growth or uneven water. Remove them and check the soil before watering again." },
      { title: "Flowers drop", body: "Usually a hot afternoon or dry air. Open the vents earlier next time." },
    ],
    yieldMin: 2,
    yieldMax: 3,
    yieldNote: "Rough guide: 2–3 kg per plant. Results vary with heat, watering, and feeding.",
  },
  {
    id: "cucumbers",
    name: "Cucumbers",
    summary: "They drink more than tomatoes and dislike cold nights and wet leaves.",
    dayMin: 22,
    dayMax: 28,
    nightMin: 18,
    nightMax: 20,
    soil: "70–80%",
    humidity: "70–85%",
    care: [
      "Keep the soil moist. A dry swing makes fruit bitter.",
      "Train the main stem up a string so the path stays open.",
      "Pick often. A ripe cucumber tells the plant to slow down.",
    ],
    feeding: "Feed lightly once a week while they are cropping. Water first, then feed.",
    problems: [
      { title: "Bitter fruit", body: "The bed dried out. Short, regular waterings are safer than one heavy soak." },
      { title: "Pale leaves", body: "Often hungry plants. Feed only if the soil is not already soggy." },
    ],
    yieldMin: 4,
    yieldMax: 6,
    yieldNote: "Rough guide: 4–6 kg per plant across the season in a small greenhouse.",
  },
  {
    id: "peppers",
    name: "Peppers",
    summary: "Steady warmth and patience. They set fruit poorly if the greenhouse overheats.",
    dayMin: 21,
    dayMax: 27,
    nightMin: 17,
    nightMax: 19,
    soil: "55–65%",
    humidity: "60–70%",
    care: [
      "Let the top of the soil dry slightly between waterings.",
      "Support heavy plants with a stake before fruit pulls them over.",
      "Pick the first fruit green if the plant looks tired.",
    ],
    feeding: "A modest feed every 10–14 days. Too much nitrogen makes leaves instead of fruit.",
    problems: [
      { title: "Flowers fall off", body: "Heat above the limit, or nights that are too cold. Vent earlier on hot days." },
      { title: "Slow fruit", body: "Normal in cool weeks. Do not add extra water to speed them up." },
    ],
    yieldMin: 1.2,
    yieldMax: 1.8,
    yieldNote: "Rough guide: 1.2–1.8 kg per plant. Sweet peppers vary a lot with summer heat.",
  },
  {
    id: "greens",
    name: "Greens",
    summary: "The forgiving crop. Sow little and often, and keep them cooler than the tomatoes.",
    dayMin: 16,
    dayMax: 22,
    nightMin: 10,
    nightMax: 14,
    soil: "60–75%",
    humidity: "60–75%",
    care: [
      "Sow a short row each visit instead of one big sowing.",
      "Water the row lightly. Greens collapse if they dry, and rot if they sit wet.",
      "Cut outer leaves and leave the center to grow on.",
    ],
    feeding: "Most beds have enough food. Feed only if leaves turn pale after several cuts.",
    problems: [
      { title: "Bolting", body: "A hot spell. Harvest what you can and sow again in a cooler corner." },
      { title: "Slugs", body: "Check under trays on Saturday morning. Pick them off before you water." },
    ],
    yieldMin: 0.4,
    yieldMax: 0.6,
    yieldNote: "Rough guide: 0.4–0.6 kg of cut leaves per sowing, taken over several weekends.",
  },
];

export const cropMap = Object.fromEntries(crops.map((crop) => [crop.id, crop])) as Record<CropId, Crop>;

export const photoStatuses: { id: PhotoStatus; label: string }[] = [
  { id: "ok", label: "OK" },
  { id: "yellow", label: "Yellow leaves" },
  { id: "pests", label: "Pests" },
  { id: "other", label: "Other" },
];

export const reminderKinds: { id: ReminderKind; label: string }[] = [
  { id: "watering", label: "Watering" },
  { id: "planting", label: "Planting" },
  { id: "harvest", label: "Harvest" },
];

export interface MonthGuide {
  id: number;
  name: string;
  season: "Spring" | "Early summer" | "Harvest" | "Autumn rest";
  plant: string;
  avoid: string;
  tip: string;
}

export const months: MonthGuide[] = [
  { id: 0, name: "January", season: "Autumn rest", plant: "Plan the beds and check stored seed. A heated bench can start the first tomato trays at the end of the month.", avoid: "Do not sow cucumbers or put tender pots on the cold soil.", tip: "Open the door for an hour on a dry day so the air does not stay stale." },
  { id: 1, name: "February", season: "Autumn rest", plant: "Sow tomatoes and peppers indoors. Greens can go in a tray if you can keep nights above 10°C.", avoid: "Do not fill the whole greenhouse yet. Seedlings need the light bench, not the back wall.", tip: "Water seed trays with a little warm water. Cold water checks growth." },
  { id: 2, name: "March", season: "Spring", plant: "Pot on tomatoes and peppers. Sow the first short row of greens in the ground if the soil is workable.", avoid: "Do not plant cucumbers out. A March night still chills them.", tip: "Vent on sunny middays. Closed glass overheats even when the morning was cold." },
  { id: 3, name: "April", season: "Spring", plant: "Harden tomatoes and move strong plants into the beds. Sow another row of greens and start cucumber pots.", avoid: "Do not leave trays in a closed house over a hot Saturday.", tip: "Water in the morning only. Wet leaves overnight invite mildew." },
  { id: 4, name: "May", season: "Spring", plant: "Plant cucumbers once nights stay mild. Peppers can join the tomatoes. Keep sowing greens every other week.", avoid: "Do not flood new transplants. Water them in once, then let roots search.", tip: "Tie tomato strings before the plants flop into the path." },
  { id: 5, name: "June", season: "Early summer", plant: "The main crops are in. Sow a last row of heat-tolerant greens in a shadier spot.", avoid: "Do not feed dry soil. Water first.", tip: "Open vents before you leave on Sunday if the forecast is hot." },
  { id: 6, name: "July", season: "Early summer", plant: "Focus on care, not new plantings. A pinch of basil or dill in a pot is enough.", avoid: "Do not let cucumbers sit oversized on the plant.", tip: "Check soil with a finger before you water. Hot air does not always mean a dry bed." },
  { id: 7, name: "August", season: "Harvest", plant: "Harvest tomatoes, cucumbers, and peppers as they color. Sow spinach or lettuce for autumn.", avoid: "Do not start new tomatoes. They will not finish.", tip: "Pick in the morning and leave fruit that is still pale." },
  { id: 8, name: "September", season: "Harvest", plant: "Clear finished cucumbers and sow autumn greens in the gap. Green tomatoes can ripen on a tray indoors.", avoid: "Do not keep watering summer crops that have stopped.", tip: "Close the vents earlier in the evening so nights stay kinder." },
  { id: 9, name: "October", season: "Autumn rest", plant: "Greens, spinach, and a pot of herbs. That is the useful sowing now.", avoid: "Do not leave wet fruit on the ground. It feeds mould.", tip: "Reduce water. Plants drink much less once the days shorten." },
  { id: 10, name: "November", season: "Autumn rest", plant: "A last tray of greens if the house stays above freezing. Otherwise, clean the beds.", avoid: "Do not store damp tools or wet soil bags against the cover.", tip: "Note what did well in the photo diary before you forget the season." },
  { id: 11, name: "December", season: "Autumn rest", plant: "Rest the soil. Add compost and write next year’s list: tomatoes, cucumbers, peppers, greens.", avoid: "Do not water an empty house. Standing water freezes and splits the bed.", tip: "Check the cover and the door latch before a windy week." },
];

export const seasons = ["Spring", "Early summer", "Harvest", "Autumn rest"] as const;
