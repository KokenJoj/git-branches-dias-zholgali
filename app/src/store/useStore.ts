import { create } from "zustand";
import type { DeviceKey, Estimate, Greenhouse, Mode, PersistedData, PhotoEntry, Reminder, Schedule, Thresholds, Unit } from "../types";
import { connectionAlert, createGreenhouse, reconcile, setDeviceState } from "../lib/greenhouse";
import { api, ServiceError } from "../services";

interface Store {
  data: PersistedData;
  signUp: (input: { name: string; email: string; password: string }) => Promise<void>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  pair: (input: { code: string; name: string }) => Promise<void>;
  unpair: () => void;
  setMode: (mode: Mode) => void;
  setDevice: (key: DeviceKey, value: boolean) => void;
  setThresholds: (thresholds: Thresholds) => void;
  setUnit: (unit: Unit) => void;
  setSchedule: (schedule: Schedule) => void;
  setNotifications: (on: boolean) => void;
  setOnline: (online: boolean) => void;
  saveEstimate: (estimate: Estimate) => void;
  addReminder: (reminder: Omit<Reminder, "id" | "done">) => void;
  toggleReminder: (id: string) => void;
  addPhoto: (photo: Omit<PhotoEntry, "id" | "at">) => void;
  deletePhoto: (id: string) => void;
  tick: () => void;
}

function requireUser(data: PersistedData) {
  if (!data.sessionUserId) throw new ServiceError("invalid", "Sign in first.");
  return data.sessionUserId;
}

function commit(set: (partial: Partial<Store>) => void, get: () => Store, recipe: (data: PersistedData) => PersistedData) {
  const next = recipe(get().data);
  set({ data: next });
  api.persist(next);
}

function withGreenhouse(data: PersistedData, recipe: (greenhouse: Greenhouse) => Greenhouse) {
  const userId = requireUser(data);
  const greenhouse = data.greenhouses[userId];
  if (!greenhouse) return data;
  return { ...data, greenhouses: { ...data.greenhouses, [userId]: recipe(greenhouse) } };
}

export const useStore = create<Store>((set, get) => ({
  data: api.load(),
  async signUp(input) {
    const created = await api.signUp(get().data, input);
    const next = { ...get().data, users: created.users, sessionUserId: created.sessionUserId };
    set({ data: next });
    api.persist(next);
  },
  async signIn(input) {
    const authed = await api.signIn(get().data, input);
    const next = { ...get().data, users: authed.users, sessionUserId: authed.sessionUserId };
    set({ data: next });
    api.persist(next);
  },
  async signOut() {
    await api.signOut(get().data);
    const next = { ...get().data, sessionUserId: null };
    set({ data: next });
    api.persist(next);
  },
  async pair(input) {
    const code = input.code.trim();
    const name = input.name.trim() || "Dacha No. 12";
    if (code.length < 3) throw new ServiceError("invalid", "Enter the code from the controller.");
    commit(set, get, (data) => {
      const userId = requireUser(data);
      const greenhouse = reconcile(createGreenhouse(name, code, Date.now()), Date.now(), false);
      return { ...data, greenhouses: { ...data.greenhouses, [userId]: greenhouse } };
    });
  },
  unpair() {
    commit(set, get, (data) => {
      const userId = requireUser(data);
      const greenhouses = { ...data.greenhouses };
      delete greenhouses[userId];
      return { ...data, greenhouses };
    });
  },
  setMode(mode) {
    commit(set, get, (data) => {
      if (!data.online) return data;
      return withGreenhouse(data, (greenhouse) => reconcile({ ...greenhouse, mode }, Date.now(), false));
    });
  },
  setDevice(key, value) {
    commit(set, get, (data) => {
      if (!data.online) return data;
      return withGreenhouse(data, (greenhouse) => setDeviceState(greenhouse, key, value, Date.now()));
    });
  },
  setThresholds(thresholds) {
    commit(set, get, (data) =>
      withGreenhouse(data, (greenhouse) => {
        const next = {
          ...greenhouse,
          thresholds: {
            minSoil: Math.min(90, Math.max(10, Math.round(thresholds.minSoil))),
            maxTempC: Math.min(50, Math.max(10, thresholds.maxTempC)),
          },
        };
        return data.online ? reconcile(next, Date.now(), false) : next;
      }),
    );
  },
  setUnit(unit) {
    commit(set, get, (data) => withGreenhouse(data, (greenhouse) => ({ ...greenhouse, unit })));
  },
  setSchedule(schedule) {
    commit(set, get, (data) => withGreenhouse(data, (greenhouse) => ({ ...greenhouse, schedule })));
  },
  setNotifications(on) {
    commit(set, get, (data) => withGreenhouse(data, (greenhouse) => ({ ...greenhouse, notifications: on })));
  },
  setOnline(online) {
    const data = get().data;
    if (data.online === online) return;
    let next: PersistedData = { ...data, online };
    if (online && data.sessionUserId && data.greenhouses[data.sessionUserId]) {
      const greenhouse = connectionAlert(data.greenhouses[data.sessionUserId], Date.now());
      next = { ...next, greenhouses: { ...next.greenhouses, [data.sessionUserId]: greenhouse } };
    }
    set({ data: next });
    api.persist(next);
    if (online) notifyNew(data, next);
  },
  saveEstimate(estimate) {
    commit(set, get, (data) => withGreenhouse(data, (greenhouse) => ({ ...greenhouse, estimate })));
  },
  addReminder(reminder) {
    commit(set, get, (data) =>
      withGreenhouse(data, (greenhouse) => ({
        ...greenhouse,
        reminders: [{ ...reminder, id: crypto.randomUUID(), done: false }, ...greenhouse.reminders],
      })),
    );
  },
  toggleReminder(id) {
    commit(set, get, (data) =>
      withGreenhouse(data, (greenhouse) => ({
        ...greenhouse,
        reminders: greenhouse.reminders.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
      })),
    );
  },
  addPhoto(photo) {
    commit(set, get, (data) =>
      withGreenhouse(data, (greenhouse) => ({
        ...greenhouse,
        photos: [{ ...photo, id: crypto.randomUUID(), at: Date.now() }, ...greenhouse.photos].slice(0, 24),
      })),
    );
  },
  deletePhoto(id) {
    commit(set, get, (data) =>
      withGreenhouse(data, (greenhouse) => ({
        ...greenhouse,
        photos: greenhouse.photos.filter((photo) => photo.id !== id),
      })),
    );
  },
  tick() {
    const data = get().data;
    if (!data.online || !data.sessionUserId) return;
    const greenhouse = data.greenhouses[data.sessionUserId];
    if (!greenhouse) return;
    const nextGreenhouse = reconcile(greenhouse, Date.now(), true);
    const next = { ...data, greenhouses: { ...data.greenhouses, [data.sessionUserId]: nextGreenhouse } };
    set({ data: next });
    api.persist(next);
    notifyNew(data, next);
  },
}));

function notifyNew(previous: PersistedData, next: PersistedData) {
  const userId = next.sessionUserId;
  if (!userId) return;
  const before = previous.greenhouses[userId];
  const after = next.greenhouses[userId];
  if (!before || !after || !after.notifications) return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  for (const alert of after.alerts) {
    const prior = before.alerts.find((item) => item.id === alert.id);
    if (alert.status === "active" && prior?.status !== "active") {
      try {
        new Notification("GreenWeekend", { body: alert.kind === "heat" ? "The greenhouse is above your temperature limit." : "A greenhouse alert needs a look." });
      } catch {
        // Notifications are optional.
      }
    }
  }
}

export function useSession() {
  const data = useStore((state) => state.data);
  const user = data.users.find((item) => item.id === data.sessionUserId) ?? null;
  const greenhouse = user ? data.greenhouses[user.id] ?? null : null;
  return { user, greenhouse, online: data.online };
}

export function startEngine() {
  if (typeof window === "undefined") return;
  const holder = globalThis as typeof globalThis & {
    __greenweekendTick?: () => void;
    __greenweekendOnline?: (online: boolean) => void;
    __greenweekendTimer?: number;
  };
  holder.__greenweekendTick = () => useStore.getState().tick();
  holder.__greenweekendOnline = (online) => useStore.getState().setOnline(online);
  if (holder.__greenweekendTimer) return;
  holder.__greenweekendTimer = window.setInterval(() => holder.__greenweekendTick?.(), 2000);
  window.addEventListener("offline", () => holder.__greenweekendOnline?.(false));
  window.addEventListener("online", () => {
    if (navigator.onLine) holder.__greenweekendOnline?.(true);
  });
}

export async function enableNotifications() {
  if (typeof Notification === "undefined") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}
