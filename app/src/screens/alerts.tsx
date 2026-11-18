import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, EmptyState, Pill, ScreenHeader } from "../components/ui";
import { describeAlert, formatWhen } from "../lib/format";
import { useSession } from "../store/useStore";

const filters = ["All", "Active", "Resolved"] as const;

export function AlertsScreen() {
  const { user, greenhouse } = useSession();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader eyebrow="Log" title="Alerts" back />
        <EmptyState title="No greenhouse yet" body="Alerts appear after a greenhouse is paired." />
      </div>
    );
  }
  const items = greenhouse.alerts.filter((alert) => {
    if (filter === "Active") return alert.status === "active";
    if (filter === "Resolved") return alert.status === "resolved";
    return true;
  });
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow={greenhouse.name} title="Alerts" back />
      <div className="mt-2 flex gap-2">
        {filters.map((item) => (
          <Pill key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</Pill>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {items.length === 0 ? (
          <EmptyState title="No alerts yet" body="When a reading crosses a limit, or automatic mode acts, it shows up here." />
        ) : items.map((alert) => {
          const copy = describeAlert(alert, greenhouse.unit);
          return (
            <Card key={alert.id}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-[15px] font-semibold">{copy.title}</p>
                <Pill tone={alert.status === "active" ? "alert" : "ok"}>{alert.status === "active" ? "Active" : "Resolved"}</Pill>
              </div>
              <p className="mt-1 text-[13px] leading-[18px] text-muted">{copy.detail}</p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{formatWhen(alert.at)}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
