import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Banner, IconBell, IconControls, IconGear, IconHistory, IconHome, IconLeaf, PhoneFrame } from "./ui";
import { useSession, useStore } from "../store/useStore";

const tabs = [
  { to: "/home", label: "Home", icon: IconHome },
  { to: "/controls", label: "Controls", icon: IconControls },
  { to: "/history", label: "History", icon: IconHistory },
  { to: "/plants", label: "Plants", icon: IconLeaf },
];

export function AppShell() {
  const { online } = useSession();
  const setOnline = useStore((state) => state.setOnline);

  return (
    <PhoneFrame>
      {!online ? (
        <div className="px-5 pt-3">
          <Banner
            tone="offline"
            title="No internet connection — showing last synced data"
            action={
              <button type="button" className="text-[13px] font-semibold text-forest" onClick={() => setOnline(navigator.onLine !== false)}>
                Retry connection
              </button>
            }
          />
        </div>
      ) : null}
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <nav className="shrink-0 border-t border-hairline bg-card px-2 pt-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={({ isActive }) => `flex flex-col items-center gap-1 py-1 text-[11px] font-semibold ${isActive ? "text-forest" : "text-muted"}`}>
              {({ isActive }) => (
                <>
                  <span className={`grid h-8 place-items-center rounded-full px-3 ${isActive ? "bg-mint" : ""}`}>
                    <tab.icon />
                  </span>
                  {tab.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </PhoneFrame>
  );
}

export function HeaderActions() {
  const navigate = useNavigate();
  const { greenhouse } = useSession();
  const active = greenhouse?.alerts.filter((alert) => alert.status === "active").length ?? 0;
  return (
    <div className="flex gap-2">
      <button type="button" aria-label="Alerts" onClick={() => navigate("/alerts")} className="relative grid h-10 w-10 place-items-center rounded-full border border-hairline bg-card">
        <IconBell />
        {active > 0 ? <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-terracotta" /> : null}
      </button>
      <button type="button" aria-label="Settings" onClick={() => navigate("/settings")} className="grid h-10 w-10 place-items-center rounded-full border border-hairline bg-card">
        <IconGear />
      </button>
    </div>
  );
}
