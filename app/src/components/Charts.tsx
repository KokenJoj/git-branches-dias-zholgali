import { useState } from "react";

export interface ChartPoint {
  t: number;
  v: number;
  label: string;
}

export function LineChart({
  points,
  color,
  unit,
}: {
  points: ChartPoint[];
  color: string;
  unit: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  if (points.length < 2) {
    return <p className="text-[13px] text-muted">Not enough readings for this range yet.</p>;
  }
  const width = 320;
  const height = 148;
  const pad = 8;
  const values = points.map((point) => point.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const coords = points.map((point, index) => {
    const x = pad + (index / (points.length - 1)) * (width - pad * 2);
    const y = height - pad - ((point.v - min) / span) * (height - pad * 2);
    return { x, y };
  });
  const line = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x.toFixed(1)},${coord.y.toFixed(1)}`).join(" ");
  const area = `${line} L${coords[coords.length - 1].x.toFixed(1)},${height - pad} L${coords[0].x.toFixed(1)},${height - pad} Z`;
  const selected = active === null ? points.length - 1 : active;

  function choose(clientX: number, bounds: DOMRect) {
    const ratio = (clientX - bounds.left) / bounds.width;
    const index = Math.round(ratio * (points.length - 1));
    setActive(Math.min(points.length - 1, Math.max(0, index)));
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="tabular text-[20px] leading-6 font-medium text-ink">
          {points[selected].v.toFixed(1)}
          <span className="ml-1 text-[13px] text-muted">{unit}</span>
        </p>
        <p className="text-[13px] text-muted">{points[selected].label}</p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-36 w-full touch-pan-y"
        role="img"
        aria-label={`Chart from ${points[0].label} to ${points[points.length - 1].label}`}
        onPointerDown={(event) => choose(event.clientX, event.currentTarget.getBoundingClientRect())}
        onPointerMove={(event) => {
          if (event.buttons === 0 && event.pointerType === "mouse") choose(event.clientX, event.currentTarget.getBoundingClientRect());
        }}
        onPointerLeave={() => setActive(null)}
      >
        <path d={area} fill={color} opacity="0.12" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <line x1={coords[selected].x} x2={coords[selected].x} y1={pad} y2={height - pad} stroke="#E6E8E4" strokeWidth="1" />
        <circle cx={coords[selected].x} cy={coords[selected].y} r="4.5" fill="#FFFFFF" stroke={color} strokeWidth="2.5" />
      </svg>
    </div>
  );
}
