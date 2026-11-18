export type Unit = "C" | "F";
export type Mode = "manual" | "auto";
export type DeviceKey = "irrigation" | "ventilation" | "lighting";
export type CropId = "tomatoes" | "cucumbers" | "peppers" | "greens";
export type PhotoStatus = "ok" | "yellow" | "pests" | "other";
export type ReminderKind = "watering" | "planting" | "harvest";
export type AlertKind = "heat" | "dry" | "irrigation" | "ventilation" | "system";
export type MetricKey = "temp" | "humidity" | "soil" | "light";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Metrics {
  airTempC: number;
  humidity: number;
  soilMoisture: number;
  lightKlx: number;
  updatedAt: number;
}

export interface Devices {
  irrigation: boolean;
  ventilation: boolean;
  lighting: boolean;
}

export interface Thresholds {
  minSoil: number;
  maxTempC: number;
}

export interface Schedule {
  days: number[];
  time: string;
}

export interface Reading {
  t: number;
  tempC: number;
  soil: number;
  humidity: number;
  lightKlx: number;
}

export interface AlertItem {
  id: string;
  kind: AlertKind;
  status: "active" | "resolved";
  at: number;
  tempC?: number;
  soil?: number;
  limitC?: number;
  limitSoil?: number;
}

export interface Reminder {
  id: string;
  title: string;
  kind: ReminderKind;
  when: string;
  done: boolean;
}

export interface PhotoEntry {
  id: string;
  cropId: CropId;
  status: PhotoStatus;
  note: string;
  image: string;
  at: number;
}

export interface Estimate {
  cropId: CropId;
  plants: number;
  at: number;
}

export interface Greenhouse {
  code: string;
  name: string;
  mode: Mode;
  devices: Devices;
  metrics: Metrics;
  thresholds: Thresholds;
  unit: Unit;
  schedule: Schedule;
  notifications: boolean;
  alerts: AlertItem[];
  history: Reading[];
  reminders: Reminder[];
  photos: PhotoEntry[];
  estimate: Estimate | null;
}

export interface PersistedData {
  version: 1;
  users: UserRecord[];
  sessionUserId: string | null;
  online: boolean;
  greenhouses: Record<string, Greenhouse>;
}

export const emptyData = (): PersistedData => ({
  version: 1,
  users: [],
  sessionUserId: null,
  online: true,
  greenhouses: {},
});
