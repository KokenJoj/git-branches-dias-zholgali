import type { AlertItem, Unit } from "../types";

export const round1 = (n: number) => Math.round(n * 10) / 10;

export function toDisplayTemp(celsius: number, unit: Unit) {
  return unit === "F" ? round1((celsius * 9) / 5 + 32) : round1(celsius);
}

export function fromDisplayTemp(value: number, unit: Unit) {
  return unit === "F" ? ((value - 32) * 5) / 9 : value;
}

export function formatTemp(celsius: number, unit: Unit, digits = 1) {
  const value = toDisplayTemp(celsius, unit);
  return `${value.toFixed(digits)}°${unit}`;
}

export function formatBand(min: number, max: number, unit: Unit) {
  if (unit === "C") return `${min}–${max}°C`;
  const low = Math.round(toDisplayTemp(min, unit));
  const high = Math.round(toDisplayTemp(max, unit));
  return `${low}–${high}°F`;
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatLight(value: number) {
  return `${value.toFixed(1)} klx`;
}

export function formatClock(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatSynced(ts: number, now = Date.now()) {
  const date = new Date(ts);
  const time = formatClock(ts);
  if (date.toDateString() === new Date(now).toDateString()) return `today at ${time}`;
  const day = date.toLocaleDateString([], { day: "numeric", month: "short" });
  return `${day} at ${time}`;
}

export function formatWhen(ts: number, now = Date.now()) {
  const date = new Date(ts);
  const time = formatClock(ts);
  if (date.toDateString() === new Date(now).toDateString()) return `Today · ${time}`;
  return `${date.toLocaleDateString([], { day: "numeric", month: "short" })} · ${time}`;
}

export function nextWatering(days: number[], time: string, now = new Date()) {
  const [hh, mm] = time.split(":").map(Number);
  for (let offset = 0; offset < 8; offset += 1) {
    const when = new Date(now);
    when.setDate(now.getDate() + offset);
    when.setHours(hh || 0, mm || 0, 0, 0);
    if (!days.includes(when.getDay())) continue;
    if (when.getTime() <= now.getTime()) continue;
    const label = when.toLocaleDateString([], { weekday: "short" });
    return `${label} ${time}`;
  }
  return "Not scheduled";
}

export function describeAlert(alert: AlertItem, unit: Unit) {
  if (alert.kind === "heat") {
    return alert.status === "active"
      ? {
          title: `Air is ${formatTemp(alert.tempC ?? 0, unit)}`,
          detail: `Above your ${formatTemp(alert.limitC ?? 0, unit, 0)} limit.`,
        }
      : {
          title: "Temperature back in range",
          detail: `The air cooled under ${formatTemp(alert.limitC ?? 0, unit, 0)}.`,
        };
  }
  if (alert.kind === "dry") {
    return alert.status === "active"
      ? {
          title: `Soil moisture is ${Math.round(alert.soil ?? 0)}%`,
          detail: `Below your ${Math.round(alert.limitSoil ?? 0)}% limit.`,
        }
      : {
          title: "Soil moisture in range",
          detail: `Soil is back above ${Math.round(alert.limitSoil ?? 0)}%.`,
        };
  }
  if (alert.kind === "irrigation") {
    return alert.status === "active"
      ? {
          title: "Auto-irrigation on",
          detail: `Soil was ${Math.round(alert.soil ?? 0)}%, under the ${Math.round(alert.limitSoil ?? 0)}% limit.`,
        }
      : {
          title: "Auto-irrigation off",
          detail: "Soil recovered, so watering stopped.",
        };
  }
  if (alert.kind === "ventilation") {
    return alert.status === "active"
      ? {
          title: "Auto-ventilation on",
          detail: `Air reached ${formatTemp(alert.tempC ?? 0, unit)}. Vents opened.`,
        }
      : {
          title: "Vents closed again",
          detail: "The air cooled under your limit.",
        };
  }
  return {
    title: "Connection restored",
    detail: "Live readings and device controls are available again.",
  };
}
