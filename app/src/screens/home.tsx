import { Navigate, useNavigate, useParams } from "react-router-dom";
import { LineChart } from "../components/Charts";
import { HeaderActions } from "../components/Shell";
import { Banner, Button, Card, EmptyState, Pill, ScreenHeader } from "../components/ui";
import { buildSeries } from "../lib/series";
import { describeAlert, formatLight, formatPercent, formatSynced, formatTemp, nextWatering, toDisplayTemp } from "../lib/format";
import type { MetricKey } from "../types";
import { useSession } from "../store/useStore";
import { useState } from "react";

const rank = { heat: 0, dry: 1, irrigation: 2, ventilation: 3, system: 4 };

export function Dashboard() {
  const { user, greenhouse } = useSession();
  const navigate = useNavigate();
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-8 pb-8">
        <ScreenHeader eyebrow="GreenWeekend" title="My greenhouse" right={<HeaderActions />} />
        <div className="mt-6">
          <EmptyState title="No greenhouse yet" body="Pair a controller to see temperature, soil, light, and alerts for your dacha." action={<Button onClick={() => navigate("/pair")}>Pair greenhouse</Button>} />
        </div>
      </div>
    );
  }
  const unit = greenhouse.unit;
  const active = greenhouse.alerts.filter((alert) => alert.status === "active").sort((a, b) => rank[a.kind] - rank[b.kind]);
  const lead = active[0];
  const copy = lead ? describeAlert(lead, unit) : null;
  const metrics = [
    { key: "temp" as const, label: "Air temp", value: formatTemp(greenhouse.metrics.airTempC, unit), hint: `Limit ${formatTemp(greenhouse.thresholds.maxTempC, unit, 0)}` },
    { key: "humidity" as const, label: "Humidity", value: formatPercent(greenhouse.metrics.humidity), hint: "Air moisture" },
    { key: "soil" as const, label: "Soil moisture", value: formatPercent(greenhouse.metrics.soilMoisture), hint: `Limit ${greenhouse.thresholds.minSoil}%` },
    { key: "light" as const, label: "Light", value: formatLight(greenhouse.metrics.lightKlx), hint: greenhouse.devices.lighting ? "Lamps on" : "Daylight" },
  ];

  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow={`GreenWeekend · ${greenhouse.name}`} title="My greenhouse" right={<HeaderActions />} />
      {copy ? (
        <div className="mt-3">
          <Banner tone="alert" title={copy.title} action={<button type="button" className="text-[13px] font-semibold" onClick={() => navigate("/alerts")}>View alerts</button>}>
            {copy.detail}
          </Banner>
        </div>
      ) : null}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <Card key={metric.key} onClick={() => navigate(`/sensor/${metric.key}`)}>
            <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{metric.label}</p>
            <p className="tabular mt-2 text-[32px] leading-9 font-medium tracking-[-0.03em]">{metric.value}</p>
            <p className="mt-1 text-[13px] text-muted">{metric.hint}</p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-muted">Synced {formatSynced(greenhouse.metrics.updatedAt)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill tone={greenhouse.devices.irrigation ? "ok" : "neutral"} onClick={() => navigate("/controls")}>Irrigation {greenhouse.devices.irrigation ? "on" : "off"}</Pill>
        <Pill tone={greenhouse.devices.ventilation ? "ok" : "neutral"} onClick={() => navigate("/controls")}>Vents {greenhouse.devices.ventilation ? "on" : "off"}</Pill>
        <Pill tone={greenhouse.devices.lighting ? "warn" : "neutral"} onClick={() => navigate("/controls")}>Lights {greenhouse.devices.lighting ? "on" : "off"}</Pill>
      </div>
      <Card className="mt-4">
        <p className="text-[15px] font-semibold">Water gently</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">
          {greenhouse.metrics.soilMoisture < greenhouse.thresholds.minSoil
            ? "The soil is under your limit. Water only until it recovers, then stop."
            : "Soil is in range. There is no need to water again today."}
        </p>
        <p className="mt-3 text-[13px] font-semibold text-forest">Next watering · {nextWatering(greenhouse.schedule.days, greenhouse.schedule.time)}</p>
      </Card>
    </div>
  );
}

const metricCopy: Record<MetricKey, { title: string; key: "tempC" | "humidity" | "soil" | "lightKlx"; unit: string }> = {
  temp: { title: "Air temp", key: "tempC", unit: "°" },
  humidity: { title: "Humidity", key: "humidity", unit: "%" },
  soil: { title: "Soil moisture", key: "soil", unit: "%" },
  light: { title: "Light", key: "lightKlx", unit: "klx" },
};

export function SensorScreen() {
  const { metric = "" } = useParams();
  const { user, greenhouse } = useSession();
  const [range, setRange] = useState<"day" | "week">("day");
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) return <Navigate to="/home" replace />;
  if (!(metric in metricCopy)) return <Navigate to="/home" replace />;
  const spec = metricCopy[metric as MetricKey];
  const points = buildSeries(greenhouse.history, range, spec.key).map((point) => (
    spec.key === "tempC" ? { ...point, v: toDisplayTemp(point.v, greenhouse.unit) } : point
  ));
  const value = spec.key === "tempC"
    ? formatTemp(greenhouse.metrics.airTempC, greenhouse.unit)
    : spec.key === "humidity"
      ? formatPercent(greenhouse.metrics.humidity)
      : spec.key === "soil"
        ? formatPercent(greenhouse.metrics.soilMoisture)
        : formatLight(greenhouse.metrics.lightKlx);
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Sensor detail" title={spec.title} back />
      <Card className="mt-3">
        <p className="tabular text-[32px] leading-9 font-medium">{value}</p>
        <p className="mt-1 text-[13px] text-muted">Synced {formatSynced(greenhouse.metrics.updatedAt)}</p>
        <div className="mt-4">
          <div className="mb-3 grid grid-cols-2 rounded-[12px] bg-mint p-1">
            {(["day", "week"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setRange(item)} className={`h-10 rounded-[10px] text-[13px] font-semibold capitalize ${range === item ? "bg-forest text-white" : "text-forest"}`}>{item}</button>
            ))}
          </div>
          <LineChart points={points} color={spec.key === "tempC" ? "#C84B31" : "#1F4E3D"} unit={spec.key === "tempC" ? (greenhouse.unit === "F" ? "°F" : "°C") : spec.unit} />
        </div>
      </Card>
    </div>
  );
}
