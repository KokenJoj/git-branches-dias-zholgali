import type { Greenhouse, Reading } from "../types";
import { createGreenhouse, seedHistory } from "../lib/greenhouse";

function asNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function buildSeedGreenhouse(name: string, code: string, now = Date.now()): Greenhouse {
  const greenhouse = createGreenhouse(name, code, now);
  const history = seedHistory(now).map((point, index, list) => {
    if (index === Math.max(0, list.length - 20)) {
      return { ...point, tempC: 45 };
    }
    return point;
  });
  return {
    ...greenhouse,
    metrics: {
      airTempC: 24.5,
      humidity: 61,
      soilMoisture: 42,
      lightKlx: 16.2,
      updatedAt: now,
    },
    history,
  };
}

export function greenhouseToFirestore(greenhouse: Greenhouse) {
  return {
    code: greenhouse.code,
    name: greenhouse.name,
    mode: greenhouse.mode,
    devices: greenhouse.devices,
    metrics: greenhouse.metrics,
    thresholds: greenhouse.thresholds,
    unit: greenhouse.unit,
    schedule: greenhouse.schedule,
    notifications: greenhouse.notifications,
    alerts: greenhouse.alerts,
    history: greenhouse.history,
    reminders: greenhouse.reminders,
    photos: greenhouse.photos.slice(0, 12).map((photo) => ({
      ...photo,
      image: photo.image.length > 180_000 ? "" : photo.image,
    })),
    estimate: greenhouse.estimate,
    updatedAt: Date.now(),
  };
}

export function firestoreToGreenhouse(raw: Record<string, unknown>, fallbackName = "Dacha greenhouse"): Greenhouse {
  const base = buildSeedGreenhouse(fallbackName, "DW-12");
  const metricsRaw = (raw.metrics ?? {}) as Record<string, unknown>;
  const devicesRaw = (raw.devices ?? {}) as Record<string, unknown>;
  const thresholdsRaw = (raw.thresholds ?? {}) as Record<string, unknown>;
  const scheduleRaw = (raw.schedule ?? {}) as Record<string, unknown>;
  const history = Array.isArray(raw.history) ? (raw.history as Reading[]) : base.history;

  return {
    code: asString(raw.code, base.code),
    name: asString(raw.name, base.name),
    mode: raw.mode === "manual" ? "manual" : "auto",
    devices: {
      irrigation: asBool(devicesRaw.irrigation, false),
      ventilation: asBool(devicesRaw.ventilation, false),
      lighting: asBool(devicesRaw.lighting, false),
    },
    metrics: {
      airTempC: asNumber(metricsRaw.airTempC, base.metrics.airTempC),
      humidity: asNumber(metricsRaw.humidity, base.metrics.humidity),
      soilMoisture: asNumber(metricsRaw.soilMoisture, base.metrics.soilMoisture),
      lightKlx: asNumber(metricsRaw.lightKlx, base.metrics.lightKlx),
      updatedAt: asNumber(metricsRaw.updatedAt, Date.now()),
    },
    thresholds: {
      minSoil: asNumber(thresholdsRaw.minSoil, base.thresholds.minSoil),
      maxTempC: asNumber(thresholdsRaw.maxTempC, base.thresholds.maxTempC),
    },
    unit: raw.unit === "F" ? "F" : "C",
    schedule: {
      days: Array.isArray(scheduleRaw.days) ? (scheduleRaw.days as number[]) : base.schedule.days,
      time: asString(scheduleRaw.time, base.schedule.time),
    },
    notifications: asBool(raw.notifications, false),
    alerts: Array.isArray(raw.alerts) ? (raw.alerts as Greenhouse["alerts"]) : [],
    history,
    reminders: Array.isArray(raw.reminders) ? (raw.reminders as Greenhouse["reminders"]) : base.reminders,
    photos: Array.isArray(raw.photos) ? (raw.photos as Greenhouse["photos"]) : [],
    estimate: (raw.estimate as Greenhouse["estimate"]) ?? null,
  };
}
