import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Card, ScreenHeader, Segmented, Toggle } from "../components/ui";
import { formatTemp, fromDisplayTemp, nextWatering, toDisplayTemp } from "../lib/format";
import { enableNotifications, useSession, useStore } from "../store/useStore";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function SettingsScreen() {
  const { user, greenhouse, online } = useSession();
  const setThresholds = useStore((state) => state.setThresholds);
  const setUnit = useStore((state) => state.setUnit);
  const setSchedule = useStore((state) => state.setSchedule);
  const setNotifications = useStore((state) => state.setNotifications);
  const setOnline = useStore((state) => state.setOnline);
  const signOut = useStore((state) => state.signOut);
  const unpair = useStore((state) => state.unpair);
  const navigate = useNavigate();
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!user) return <Navigate to="/signin" replace />;

  async function logout() {
    await signOut();
    navigate("/");
  }

  function flash() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <div className="px-5 pt-2 pb-10">
      <ScreenHeader eyebrow="GreenWeekend" title="Settings" back />
      {!greenhouse ? (
        <p className="mt-3 text-[13px] text-muted">Pair a greenhouse to edit limits and the watering schedule.</p>
      ) : (
        <>
          <Card className="mt-3">
            <p className="text-[15px] font-semibold">Thresholds</p>
            <p className="mt-1 text-[13px] leading-[18px] text-muted">Automatic mode uses these values immediately.</p>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Minimum soil moisture</span>
                <input
                  className="tabular h-12 rounded-[12px] border border-hairline px-3 text-[16px]"
                  type="number"
                  min={10}
                  max={90}
                  value={greenhouse.thresholds.minSoil}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (!Number.isFinite(value)) return;
                    setThresholds({ minSoil: value, maxTempC: greenhouse.thresholds.maxTempC });
                  }}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Maximum temperature ({greenhouse.unit === "F" ? "°F" : "°C"})</span>
                <input
                  className="tabular h-12 rounded-[12px] border border-hairline px-3 text-[16px]"
                  type="number"
                  value={Math.round(toDisplayTemp(greenhouse.thresholds.maxTempC, greenhouse.unit))}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (!Number.isFinite(value)) return;
                    setThresholds({
                      minSoil: greenhouse.thresholds.minSoil,
                      maxTempC: fromDisplayTemp(value, greenhouse.unit),
                    });
                  }}
                />
              </label>
            </div>
          </Card>
          <Card className="mt-3">
            <p className="text-[15px] font-semibold">Watering schedule</p>
            <p className="mt-1 text-[13px] text-muted">Next watering · {nextWatering(greenhouse.schedule.days, greenhouse.schedule.time)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dayLabels.map((label, index) => {
                const on = greenhouse.schedule.days.includes(index);
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      const days = on ? greenhouse.schedule.days.filter((day) => day !== index) : [...greenhouse.schedule.days, index];
                      setSchedule({ ...greenhouse.schedule, days });
                    }}
                    className={`h-10 min-w-10 rounded-full px-3 text-[12px] font-semibold ${on ? "bg-forest text-white" : "bg-mint text-forest"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <label className="mt-3 grid gap-2">
              <span className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Time</span>
              <input className="h-12 rounded-[12px] border border-hairline px-3 text-[16px]" type="time" value={greenhouse.schedule.time} onChange={(event) => setSchedule({ ...greenhouse.schedule, time: event.target.value })} />
            </label>
          </Card>
          <Card className="mt-3">
            <p className="text-[15px] font-semibold">Units</p>
            <p className="mt-1 mb-3 text-[13px] text-muted">Temperature across the app, including alerts and charts.</p>
            <Segmented value={greenhouse.unit} options={[{ id: "C", label: "°C" }, { id: "F", label: "°F" }]} onChange={setUnit} />
            <p className="mt-3 text-[13px] text-muted">Air is {formatTemp(greenhouse.metrics.airTempC, greenhouse.unit)} right now.</p>
          </Card>
          <Card className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold">Internet connection</p>
              <p className="mt-1 text-[13px] leading-[18px] text-muted">Turn this off to keep the last synced readings on screen.</p>
            </div>
            <Toggle on={online} label="Internet connection" onChange={(next) => setOnline(next ? navigator.onLine !== false : false)} />
          </Card>
          <Card className="mt-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold">Push notifications</p>
              <p className="mt-1 text-[13px] leading-[18px] text-muted">A notice when a new alert becomes active.</p>
            </div>
            <Toggle
              on={greenhouse.notifications}
              label="Push notifications"
              onChange={async (next) => {
                if (next) {
                  const granted = await enableNotifications();
                  setNotifications(granted);
                  return;
                }
                setNotifications(false);
              }}
            />
          </Card>
          <Button className="mt-4" onClick={flash}>{saved ? "Saved" : "Save settings"}</Button>
          <div className="mt-3">
            <Button
              variant="danger"
              onClick={() => {
                if (!confirmRemove) {
                  setConfirmRemove(true);
                  return;
                }
                unpair();
                navigate("/home");
              }}
            >
              {confirmRemove ? "Confirm remove" : "Remove greenhouse"}
            </Button>
          </div>
        </>
      )}
      <Card className="mt-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Signed in</p>
        <p className="mt-1 text-[15px] font-semibold">{user.name}</p>
        <p className="text-[13px] text-muted">{user.email}</p>
      </Card>
      <div className="mt-3">
        <Button variant="danger" onClick={logout}>Logout</Button>
      </div>
    </div>
  );
}
