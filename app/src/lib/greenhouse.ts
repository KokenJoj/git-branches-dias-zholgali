import type { AlertItem, DeviceKey, Greenhouse, Metrics, Reading } from "../types";
import { round1 } from "./format";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

function daylight(now: number) {
  const hour = new Date(now).getHours();
  if (hour < 6 || hour > 20) return 1.2;
  return 12 + Math.sin(((hour - 6) / 14) * Math.PI) * 16;
}

export function seedHistory(now: number): Reading[] {
  const points: Reading[] = [];
  for (let i = 168; i >= 1; i -= 1) {
    const t = now - i * 60 * 60 * 1000;
    const hour = new Date(t).getHours();
    const wave = Math.sin(((hour - 5) / 24) * Math.PI * 2);
    points.push({
      t,
      tempC: round1(clamp(22 + wave * 4.5, 14, 34)),
      soil: round1(clamp(48 + Math.sin(i / 9) * 8, 28, 78)),
      humidity: round1(clamp(64 - wave * 8, 40, 88)),
      lightKlx: round1(Math.max(0.4, (wave + 1) * 10)),
    });
  }
  return points;
}

export function createGreenhouse(name: string, code: string, now: number): Greenhouse {
  const metrics: Metrics = {
    airTempC: 24.8,
    humidity: 62,
    soilMoisture: 38,
    lightKlx: 18.4,
    updatedAt: now,
  };
  return {
    code,
    name,
    mode: "auto",
    devices: { irrigation: false, ventilation: false, lighting: false },
    metrics,
    thresholds: { minSoil: 30, maxTempC: 32 },
    unit: "C",
    schedule: { days: [5, 6, 0], time: "08:00" },
    notifications: false,
    alerts: [],
    history: seedHistory(now),
    reminders: [
      { id: "water-sunday", title: "Water before you leave on Sunday", kind: "watering", when: "Every weekend", done: false },
      { id: "sow-greens", title: "Sow a short row of greens", kind: "planting", when: "This month", done: false },
      { id: "pick-ready", title: "Pick fruit that is ready", kind: "harvest", when: "Saturday morning", done: false },
    ],
    photos: [],
    estimate: null,
  };
}

function driftMetrics(g: Greenhouse, now: number): Metrics {
  const { devices, metrics } = g;
  const tempDelta = (devices.ventilation ? -0.35 : 0.45) + (devices.lighting ? 0.08 : 0);
  const soilDelta = devices.irrigation ? 0.7 : -0.28;
  const humidityDelta = (devices.irrigation ? 0.35 : -0.12) + (devices.ventilation ? -0.2 : 0.08);
  const lightTarget = devices.lighting ? 30 : daylight(now);
  return {
    airTempC: round1(clamp(metrics.airTempC + tempDelta, 8, 48)),
    soilMoisture: round1(clamp(metrics.soilMoisture + soilDelta, 8, 100)),
    humidity: round1(clamp(metrics.humidity + humidityDelta, 25, 96)),
    lightKlx: round1(clamp(metrics.lightKlx + (lightTarget - metrics.lightKlx) * 0.05, 0.2, 40)),
    updatedAt: now,
  };
}

function upsert(list: AlertItem[], item: AlertItem) {
  const index = list.findIndex((alert) => alert.id === item.id);
  if (index === -1) return [item, ...list];
  const previous = list[index];
  const next = { ...previous, ...item, at: previous.status === item.status ? previous.at : item.at };
  const copy = list.slice();
  copy[index] = next;
  return copy;
}

function resolve(list: AlertItem[], id: string, now: number) {
  const current = list.find((alert) => alert.id === id);
  if (!current || current.status === "resolved") return list;
  return upsert(list, { ...current, status: "resolved", at: now });
}

function cap(list: AlertItem[]) {
  const active = list.filter((alert) => alert.status === "active");
  const resolved = list.filter((alert) => alert.status === "resolved").slice(0, 24);
  return [...active, ...resolved];
}

function syncAlerts(g: Greenhouse, now: number) {
  let alerts = g.alerts;
  const { metrics, thresholds, mode, devices } = g;
  if (metrics.airTempC > thresholds.maxTempC) {
    alerts = upsert(alerts, {
      id: "heat",
      kind: "heat",
      status: "active",
      at: now,
      tempC: metrics.airTempC,
      limitC: thresholds.maxTempC,
    });
  } else {
    alerts = resolve(alerts, "heat", now);
  }

  if (mode === "auto" && metrics.soilMoisture < thresholds.minSoil && devices.irrigation) {
    alerts = upsert(alerts, {
      id: "irrigation",
      kind: "irrigation",
      status: "active",
      at: now,
      soil: metrics.soilMoisture,
      limitSoil: thresholds.minSoil,
    });
    alerts = resolve(alerts, "dry", now);
  } else if (mode === "auto") {
    alerts = resolve(alerts, "irrigation", now);
    alerts = resolve(alerts, "dry", now);
  } else if (metrics.soilMoisture < thresholds.minSoil) {
    alerts = upsert(alerts, {
      id: "dry",
      kind: "dry",
      status: "active",
      at: now,
      soil: metrics.soilMoisture,
      limitSoil: thresholds.minSoil,
    });
    alerts = resolve(alerts, "irrigation", now);
  } else {
    alerts = resolve(alerts, "dry", now);
    alerts = resolve(alerts, "irrigation", now);
  }

  if (mode === "auto" && metrics.airTempC > thresholds.maxTempC && devices.ventilation) {
    alerts = upsert(alerts, {
      id: "ventilation",
      kind: "ventilation",
      status: "active",
      at: now,
      tempC: metrics.airTempC,
      limitC: thresholds.maxTempC,
    });
  } else if (mode === "auto" && metrics.airTempC < thresholds.maxTempC - 2) {
    alerts = resolve(alerts, "ventilation", now);
  }

  return cap(alerts);
}

export function setDeviceState(g: Greenhouse, key: DeviceKey, value: boolean, now: number): Greenhouse {
  const devices = { ...g.devices, [key]: value };
  const next = { ...g, devices };
  return { ...next, alerts: syncAlerts(next, now) };
}

export function reconcile(g: Greenhouse, now: number, drift: boolean): Greenhouse {
  const metrics = drift ? driftMetrics(g, now) : g.metrics;
  const history = drift ? [...g.history, { t: now, tempC: metrics.airTempC, soil: metrics.soilMoisture, humidity: metrics.humidity, lightKlx: metrics.lightKlx }].slice(-420) : g.history;
  const devices = { ...g.devices };
  if (g.mode === "auto") {
    if (metrics.soilMoisture < g.thresholds.minSoil) devices.irrigation = true;
    else if (metrics.soilMoisture >= g.thresholds.minSoil + 5) devices.irrigation = false;
    if (metrics.airTempC > g.thresholds.maxTempC) devices.ventilation = true;
    else if (metrics.airTempC < g.thresholds.maxTempC - 2) devices.ventilation = false;
  }
  const next = { ...g, metrics, history, devices };
  return { ...next, alerts: syncAlerts(next, now) };
}

export function connectionAlert(g: Greenhouse, now: number): Greenhouse {
  const alerts = cap(upsert(g.alerts, { id: "connection", kind: "system", status: "resolved", at: now }));
  return reconcile({ ...g, alerts }, now, false);
}
