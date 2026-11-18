import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-canvas shadow-[0_0_0_1px_#E6E8E4]">{children}</div>;
}

export function LogoMark({ size = "md" }: { size?: "md" | "sm" }) {
  const box = size === "sm" ? "h-11 w-11 rounded-[16px]" : "h-14 w-14 rounded-[20px]";
  return (
    <span className={`grid place-items-center bg-forest text-white ${box}`}>
      <svg viewBox="0 0 24 24" className={size === "sm" ? "h-6 w-6" : "h-7 w-7"} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 21V10" />
        <path d="M12 13c0-4 3-6 7-7-1 5-3 8-7 7Z" />
        <path d="M12 14c0-3-2.5-5-6-6 1 4 2.5 6 6 6Z" />
      </svg>
    </span>
  );
}

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function IconHome({ className = "h-6 w-6" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" /></svg>;
}
export function IconControls({ className = "h-6 w-6" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /><circle cx="8" cy="7" r="2" fill="#F5F5F2" /><circle cx="15" cy="12" r="2" fill="#F5F5F2" /><circle cx="10" cy="17" r="2" fill="#F5F5F2" /></svg>;
}
export function IconHistory({ className = "h-6 w-6" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M4 16c2-4 4-4 6 0s4 4 6 0 4-4 4-2" /><path d="M4 20h16" /></svg>;
}
export function IconLeaf({ className = "h-6 w-6" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M5 19c8 0 14-8 14-14-6 0-14 6-14 14Z" /><path d="M8 16c2-2 5-5 8-7" /></svg>;
}
export function IconBell({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
}
export function IconGear({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><circle cx="12" cy="12" r="3" /><path d="M12 3.5v2.2M12 18.3v2.2M4.8 6.8l1.6 1.6M17.6 15.6l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.2l1.6-1.6M17.6 8.4l1.6-1.6" /></svg>;
}
export function IconBack({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M15 5 8 12l7 7" /></svg>;
}
export function IconDrop({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" /></svg>;
}
export function IconWind({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><path d="M3 8h11a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h8" /></svg>;
}
export function IconSun({ className = "h-5 w-5" }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} {...stroke} aria-hidden><circle cx="12" cy="12" r="3.5" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" /></svg>;
}

export function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const styles = {
    primary: "bg-forest text-white",
    secondary: "border border-hairline bg-card text-forest",
    danger: "border border-hairline bg-card text-terracotta",
    ghost: "bg-transparent text-forest",
  }[variant];
  return (
    <button type="button" className={`flex h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`w-full rounded-[20px] border border-hairline bg-card p-4 text-left ${className}`}>
        {children}
      </button>
    );
  }
  return <div className={`rounded-[20px] border border-hairline bg-card p-4 ${className}`}>{children}</div>;
}

export function Field({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-2">
      <span className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{label}</span>
      <input
        className={`h-12 rounded-[12px] border bg-card px-3 text-[16px] text-ink outline-none ${error ? "border-terracotta" : "border-hairline focus:border-forest"}`}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error ? <span className="text-[13px] font-medium text-terracotta">{error}</span> : null}
    </label>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (id: T) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid rounded-[12px] bg-mint p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.id)}
            className={`h-10 rounded-[10px] text-[13px] font-semibold disabled:opacity-40 ${active ? "bg-forest text-white" : "text-forest"}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ on, disabled, label, onChange }: { on: boolean; disabled?: boolean; label: string; onChange: (next: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-40 ${on ? "bg-forest" : "bg-[#D7DBD6]"}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

export function Pill({ children, active, tone = "neutral", onClick }: { children: ReactNode; active?: boolean; tone?: "neutral" | "ok" | "warn" | "alert"; onClick?: () => void }) {
  const tones = {
    neutral: active ? "bg-forest text-white" : "bg-mint text-forest",
    ok: "bg-ok/10 text-ok",
    warn: "bg-amber/10 text-amber",
    alert: "bg-terracotta/10 text-terracotta",
  }[tone];
  const className = `inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${tones} ${active && tone !== "neutral" ? "ring-2 ring-forest ring-offset-2 ring-offset-canvas" : ""}`;
  if (!onClick) return <span className={className}>{children}</span>;
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function Banner({ tone, title, children, action }: { tone: "alert" | "offline"; title: string; children?: ReactNode; action?: ReactNode }) {
  const styles = tone === "alert" ? "border-terracotta/20 bg-terracotta/10 text-terracotta" : "border-hairline bg-tint text-ink";
  return (
    <div className={`rounded-[20px] border px-4 py-3 ${styles}`} role={tone === "alert" ? "status" : "status"}>
      <p className="text-[15px] leading-5 font-semibold">{title}</p>
      {children ? <div className="mt-1 text-[13px] leading-[18px] font-medium opacity-90">{children}</div> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function ScreenHeader({ eyebrow, title, back, right }: { eyebrow?: string; title: string; back?: boolean; right?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="flex items-start justify-between gap-3 pt-4 pb-2">
      <div className="flex items-start gap-3">
        {back ? (
          <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="mt-1 grid h-10 w-10 place-items-center rounded-full border border-hairline bg-card">
            <IconBack />
          </button>
        ) : null}
        <div>
          {eyebrow ? <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{eyebrow}</p> : null}
          <h1 className="text-[28px] leading-[34px] font-medium tracking-[-0.03em] text-ink">{title}</h1>
        </div>
      </div>
      {right}
    </header>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-hairline bg-card px-5 py-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-[20px] bg-forest text-white">
        <IconLeaf />
      </div>
      <h2 className="mt-4 text-[18px] leading-6 font-medium">{title}</h2>
      <p className="mx-auto mt-2 max-w-[260px] text-[13px] leading-[18px] text-muted">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/30" onClick={onClose}>
      <div className="max-h-[88dvh] w-full max-w-[390px] overflow-auto rounded-t-[20px] border border-hairline bg-card px-5 pt-4 pb-8" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[18px] font-medium">{title}</h2>
          <button type="button" onClick={onClose} className="text-[13px] font-semibold text-muted">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
