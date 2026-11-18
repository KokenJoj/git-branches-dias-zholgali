import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button, Field, LogoMark, PhoneFrame, ScreenHeader } from "../components/ui";
import { ServiceError } from "../services";
import { useSession, useStore } from "../store/useStore";

function emailOk(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function Welcome() {
  const { user } = useSession();
  if (user) return <Navigate to="/home" replace />;
  return (
    <PhoneFrame>
    <div className="flex h-full min-h-0 flex-1 flex-col justify-between overflow-y-auto px-5 py-10">
      <div />
      <div>
        <LogoMark />
        <p className="mt-6 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Weekend greenhouse</p>
        <h1 className="mt-2 text-[32px] leading-[38px] font-medium tracking-[-0.03em]">GreenWeekend</h1>
        <p className="mt-3 max-w-[280px] text-[15px] leading-6 text-muted">A calm check on the dacha greenhouse between Friday and Sunday.</p>
      </div>
      <div className="grid gap-3">
        <Link to="/signup" className="block"><Button>Create account</Button></Link>
        <Link to="/signin" className="block"><Button variant="secondary">Sign in</Button></Link>
      </div>
    </div>
    </PhoneFrame>
  );
}

export function SignUp() {
  const { user } = useSession();
  const signUp = useStore((state) => state.signUp);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/home" replace />;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = "Add your name.";
    if (!emailOk(email)) next.email = "Enter a valid email.";
    if (password.length < 6) next.password = "Use at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await signUp({ name, email, password });
      navigate("/home");
    } catch (error) {
      setErrors({ email: error instanceof ServiceError ? error.message : "Could not create the account." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneFrame>
    <form onSubmit={submit} className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-5 pt-6 pb-10">
      <ScreenHeader eyebrow="GreenWeekend" title="Create account" back />
      <Field label="Name" value={name} onChange={(event) => setName(event.target.value)} error={errors.name} autoComplete="name" />
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} autoComplete="email" />
      <Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} error={errors.password} autoComplete="new-password" />
      <Button type="submit" disabled={busy}>{busy ? "Creating account…" : "Create account"}</Button>
      <Link to="/signin" className="text-center text-[13px] font-semibold text-forest">Already have an account? Sign in</Link>
    </form>
    </PhoneFrame>
  );
}

export function SignIn() {
  const { user } = useSession();
  const signIn = useStore((state) => state.signIn);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/home" replace />;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const next: typeof errors = {};
    if (!emailOk(email)) next.email = "Enter a valid email.";
    if (!password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setBusy(true);
    try {
      await signIn({ email, password });
      navigate("/home");
    } catch (error) {
      if (error instanceof ServiceError && error.code === "wrong-password") setErrors({ password: "Incorrect password" });
      else if (error instanceof ServiceError && error.code === "user-not-found") setErrors({ email: error.message });
      else setErrors({ password: "Could not sign in." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneFrame>
    <form onSubmit={submit} className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-5 pt-6 pb-10">
      <ScreenHeader eyebrow="GreenWeekend" title="Sign in" back />
      <Field label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} error={errors.email} autoComplete="email" />
      <Field label="Password" type="password" value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined })); }} error={errors.password} autoComplete="current-password" />
      <Button type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      <Link to="/signup" className="text-center text-[13px] font-semibold text-forest">New here? Create account</Link>
    </form>
    </PhoneFrame>
  );
}

export function PairScreen() {
  const { user, greenhouse } = useSession();
  const pair = useStore((state) => state.pair);
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [name, setName] = useState("Dacha No. 12");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (!user) return <Navigate to="/signin" replace />;
  if (greenhouse) return <Navigate to="/home" replace />;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await pair({ code, name });
      navigate("/home");
    } catch (err) {
      setError(err instanceof ServiceError ? err.message : "Could not pair the greenhouse.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhoneFrame>
    <form onSubmit={submit} className="grid min-h-0 flex-1 content-start gap-5 overflow-y-auto px-5 pt-2 pb-10">
      <ScreenHeader eyebrow="Greenhouse access" title="Pair controller" back />
      <p className="text-[13px] leading-[18px] text-muted">The code is on the white controller box inside the greenhouse.</p>
      <Field label="Greenhouse name" value={name} onChange={(event) => setName(event.target.value)} />
      <Field label="Pairing code" value={code} onChange={(event) => setCode(event.target.value)} placeholder="DW-12" error={error} autoCapitalize="characters" />
      <Button type="submit" disabled={busy}>{busy ? "Pairing…" : "Pair greenhouse"}</Button>
    </form>
    </PhoneFrame>
  );
}
