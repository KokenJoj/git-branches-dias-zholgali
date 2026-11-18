import { Navigate, useNavigate } from "react-router-dom";
import { Card, EmptyState, IconDrop, IconSun, IconWind, ScreenHeader, Segmented, Toggle } from "../components/ui";
import { formatTemp, fromDisplayTemp, toDisplayTemp } from "../lib/format";
import type { DeviceKey } from "../types";
import { useSession, useStore } from "../store/useStore";

const devices: { key: DeviceKey; label: string; body: string; icon: typeof IconDrop }[] = [
  { key: "irrigation", label: "Irrigation", body: "Beds and drip lines", icon: IconDrop },
  { key: "ventilation", label: "Ventilation", body: "Roof vents and the door", icon: IconWind },
  { key: "lighting", label: "Lighting", body: "Grow lamps", icon: IconSun },
];

export function Controls() {
  const { user, greenhouse, online } = useSession();
  const setMode = useStore((state) => state.setMode);
  const setDevice = useStore((state) => state.setDevice);
  const navigate = useNavigate();
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader eyebrow="Devices" title="Controls" />
        <EmptyState title="No greenhouse yet" body="Pair a controller before changing irrigation, vents, or lights." />
      </div>
    );
  }
  const unit = greenhouse.unit;
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow={greenhouse.name} title="Controls" />
      <Segmented
        value={greenhouse.mode}
        disabled={!online}
        options={[{ id: "manual", label: "Manual" }, { id: "auto", label: "Automatic" }]}
        onChange={setMode}
      />
      <p className="mt-3 text-[13px] leading-[18px] text-muted">
        {greenhouse.mode === "auto"
          ? `Automatic turns irrigation on below ${greenhouse.thresholds.minSoil}% soil and opens vents above ${formatTemp(greenhouse.thresholds.maxTempC, unit, 0)}.`
          : "Manual keeps each device where you set it. Alerts still appear if a reading crosses a limit."}
      </p>
      <div className="mt-4 grid gap-3">
        {devices.map((device) => {
          const on = greenhouse.devices[device.key];
          return (
            <Card key={device.key} className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-[12px] bg-mint text-forest">
                <device.icon />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold">{device.label}</span>
                <span className="block text-[13px] text-muted">{device.body}</span>
              </span>
              <Toggle on={on} disabled={!online} label={device.label} onChange={(next) => setDevice(device.key, next)} />
            </Card>
          );
        })}
      </div>
      {!online ? <p className="mt-3 text-[13px] font-medium text-muted">Device controls are paused until the connection returns.</p> : null}
      <button type="button" onClick={() => navigate("/rules")} className="mt-4 text-[13px] font-semibold text-forest">Edit automatic rules</button>
    </div>
  );
}

export function RulesScreen() {
  const { user, greenhouse, online } = useSession();
  const setThresholds = useStore((state) => state.setThresholds);
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) return <Navigate to="/home" replace />;
  const { minSoil, maxTempC } = greenhouse.thresholds;
  const displayMax = Math.round(toDisplayTemp(maxTempC, greenhouse.unit));
  const unitLabel = greenhouse.unit === "F" ? "°F" : "°C";
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Automatic" title="Rules" back />
      <Card className="mt-3">
        <p className="text-[15px] font-semibold">Irrigation</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">Turns on when soil moisture drops below {minSoil}%, and turns off again 5% above that.</p>
        <Stepper label="Minimum soil moisture" value={minSoil} suffix="%" disabled={!online} onChange={(value) => setThresholds({ minSoil: value, maxTempC })} />
      </Card>
      <Card className="mt-3">
        <p className="text-[15px] font-semibold">Ventilation</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">Opens when air rises above {formatTemp(maxTempC, greenhouse.unit, 0)}, then closes once it cools a little under that limit.</p>
        <Stepper
          label="Maximum temperature"
          value={displayMax}
          suffix={unitLabel}
          disabled={!online}
          onChange={(value) => setThresholds({ minSoil, maxTempC: fromDisplayTemp(value, greenhouse.unit) })}
        />
      </Card>
      <p className="mt-3 text-[13px] text-muted">Lighting stays on the switch you set. These rules use the same limits as Settings.</p>
    </div>
  );
}

function Stepper({ label, value, suffix, onChange, disabled }: { label: string; value: number; suffix: string; onChange: (value: number) => void; disabled?: boolean }) {
  return (
    <div className="mt-4">
      <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <button type="button" disabled={disabled} onClick={() => onChange(value - 1)} className="grid h-12 w-12 place-items-center rounded-[12px] border border-hairline bg-card text-[20px] disabled:opacity-40" aria-label={`Decrease ${label}`}>–</button>
        <p className="tabular flex-1 text-center text-[28px] leading-8 font-medium">{value}{suffix}</p>
        <button type="button" disabled={disabled} onClick={() => onChange(value + 1)} className="grid h-12 w-12 place-items-center rounded-[12px] border border-hairline bg-card text-[20px] disabled:opacity-40" aria-label={`Increase ${label}`}>+</button>
      </div>
    </div>
  );
}
