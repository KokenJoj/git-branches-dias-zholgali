import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LineChart } from "../components/Charts";
import { Card, EmptyState, ScreenHeader, Segmented } from "../components/ui";
import { buildSeries } from "../lib/series";
import { toDisplayTemp } from "../lib/format";
import { useSession } from "../store/useStore";

export function HistoryScreen() {
  const { user, greenhouse } = useSession();
  const [range, setRange] = useState<"day" | "week">("day");
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader eyebrow="Readings" title="History" />
        <EmptyState title="No greenhouse yet" body="History appears after a greenhouse is paired." />
      </div>
    );
  }
  const temp = buildSeries(greenhouse.history, range, "tempC").map((point) => ({ ...point, v: toDisplayTemp(point.v, greenhouse.unit) }));
  const soil = buildSeries(greenhouse.history, range, "soil");
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow={greenhouse.name} title="History" />
      <Segmented value={range} options={[{ id: "day", label: "Day" }, { id: "week", label: "Week" }]} onChange={setRange} />
      <Card className="mt-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Temperature</p>
        <div className="mt-2">
          <LineChart points={temp} color="#C84B31" unit={greenhouse.unit === "F" ? "°F" : "°C"} />
        </div>
      </Card>
      <Card className="mt-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Soil moisture</p>
        <div className="mt-2">
          <LineChart points={soil} color="#1F4E3D" unit="%" />
        </div>
      </Card>
      <p className="mt-3 text-[13px] leading-[18px] text-muted">Drag across a chart to read a point. Day shows the last 24 hours. Week shows a daily average.</p>
    </div>
  );
}
