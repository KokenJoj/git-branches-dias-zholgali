import type { Reading } from "../types";
import type { ChartPoint } from "../components/Charts";

function downsample<T>(items: T[], max: number) {
  if (items.length <= max) return items;
  const step = (items.length - 1) / (max - 1);
  return Array.from({ length: max }, (_, index) => items[Math.round(index * step)]);
}

export function buildSeries(points: Reading[], range: "day" | "week", key: keyof Pick<Reading, "tempC" | "soil" | "humidity" | "lightKlx">): ChartPoint[] {
  if (range === "day") {
    const cut = Date.now() - 24 * 60 * 60 * 1000;
    const recent = points.filter((point) => point.t >= cut);
    const source = recent.length > 1 ? recent : points.slice(-24);
    return downsample(source, 36).map((point) => ({
      t: point.t,
      v: point[key],
      label: new Date(point.t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
  }
  const buckets = new Map<string, { t: number; sum: number; n: number }>();
  for (const point of points) {
    const keyName = new Date(point.t).toDateString();
    const bucket = buckets.get(keyName) ?? { t: point.t, sum: 0, n: 0 };
    bucket.sum += point[key];
    bucket.n += 1;
    bucket.t = point.t;
    buckets.set(keyName, bucket);
  }
  return [...buckets.values()].slice(-7).map((bucket) => ({
    t: bucket.t,
    v: Math.round((bucket.sum / bucket.n) * 10) / 10,
    label: new Date(bucket.t).toLocaleDateString([], { weekday: "short" }),
  }));
}
