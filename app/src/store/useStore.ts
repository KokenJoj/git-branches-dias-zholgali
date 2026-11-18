import { create } from "zustand";
import type { DeviceKey, Estimate, Greenhouse, Mode, PersistedData, PhotoEntry, Reminder, Schedule, Thresholds, Unit } from "../types";
import { connectionAlert, createGreenhouse, reconcile, setDeviceState } from "../lib/greenhouse";
import {
  api,
  bootstrapFirebaseSession,
  ensureSeedGreenhouse,
  removeGreenhouse,
  ServiceError,
  subscribeGreenhouse,
  useFirebase,
} from "../services";

interface Store {
  data: PersistedData;
  ready: boolean;
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
  hydrate: (data: PersistedData) => void;
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
  ready: !useFirebase,
  hydrate(data) {
    set({ data, ready: true });
  },
  async signUp(input) {
    const created = await api.signUp(get().data, input);
    set({
      data: {
        ...get().data,
        users: created.users,
        sessionUserId: created.sessionUserId,
        greenhouses: created.greenhouses ?? get().data.greenhouses,
        online: created.online ?? get().data.online,
      },
    });
  },
  async signIn(input) {
    const authed = await api.signIn(get().data, input);
    set({
      data: {
        ...get().data,
        users: authed.users,
        sessionUserId: authed.sessionUserId,
        greenhouses: authed.greenhouses ?? {},
        online: authed.online ?? get().data.online,
      },
    });
  },
  async signOut() {
    await api.signOut(get().data);
    set({ data: { ...get().data, sessionUserId: null, users: useFirebase ? [] : get().data.users, greenhouses: useFirebase ? {} : get().data.greenhouses } });
  },
  async pair(input) {
    const code = input.code.trim();
    const name = input.name.trim() || "Dacha No. 12";
    if (code.length < 3) throw new ServiceError("invalid", "Enter the code from the controller.");
    const userId = requireUser(get().data);

    if (useFirebase) {
      const greenhouse = await ensureSeedGreenhouse(userId, name, code);
      set({
        data: {
          ...get().data,
          greenhouses: { ...get().data.greenhouses, [userId]: greenhouse },
        },
      });
      return;
    }

    commit(set, get, (data) => {
      const greenhouse = reconcile(createGreenhouse(name, code, Date.now()), Date.now(), false);
      return { ...data, greenhouses: { ...data.greenhouses, [userId]: greenhouse } };
    });
  },
  unpair() {
    const userId = get().data.sessionUserId;
    commit(set, get, (data) => {
      if (!userId) return data;
      const greenhouses = { ...data.greenhouses };
      delete greenhouses[userId];
      return { ...data, greenhouses };
    });
    if (useFirebase && userId) {
      void removeGreenhouse(userId).catch(() => undefined);
    }
  },
  setMode(mode) {
    commit(set, get, (data) => {
      if (!data.online) return data;
      return withGreenhouse(data, (greenhouse) =>
        useFirebase ? { ...greenhouse, mode } : reconcile({ ...greenhouse, mode }, Date.now(), false),
      );
    });
  },
  setDevice(key, value) {
    commit(set, get, (data) => {
      if (!data.online) return data;
      return withGreenhouse(data, (greenhouse) =>
        useFirebase
          ? {
              ...greenhouse,
              devices: { ...greenhouse.devices, [key]: value },
              mode: "manual",
            }
          : setDeviceState(greenhouse, key, value, Date.now()),
      );
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
        if (useFirebase) return next;
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
    if (useFirebase) return;
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
        new Notification("GreenWeekend", {
          body: alert.kind === "heat" ? "The greenhouse is above your temperature limit." : "A greenhouse alert needs a look.",
        });
      } catch {
        // ignore
      }
    }
  }
}

export function useSession() {
  const data = useStore((state) => state.data);
  const ready = useStore((state) => state.ready);
  const user = data.users.find((item) => item.id === data.sessionUserId) ?? null;
  const greenhouse = user ? data.greenhouses[user.id] ?? null : null;
  return { user, greenhouse, online: data.online, ready };
}

export function startEngine() {
  if (typeof window === "undefined") return;
  const holder = globalThis as typeof globalThis & {
    __greenweekendTick?: () => void;
    __greenweekendOnline?: (online: boolean) => void;
    __greenweekendTimer?: number;
    __greenweekendBoot?: boolean;
  };

  holder.__greenweekendTick = () => useStore.getState().tick();
  holder.__greenweekendOnline = (online) => useStore.getState().setOnline(online);

  if (!holder.__greenweekendTimer) {
    holder.__greenweekendTimer = window.setInterval(() => holder.__greenweekendTick?.(), 2000);
    window.addEventListener("offline", () => holder.__greenweekendOnline?.(false));
    window.addEventListener("online", () => {
      if (navigator.onLine) holder.__greenweekendOnline?.(true);
    });
  }

  if (holder.__greenweekendBoot) return;
  holder.__greenweekendBoot = true;

  if (useFirebase) {
    void bootstrapFirebaseSession()
      .then((session) => {
        useStore.getState().hydrate(session);
      })
      .catch(() => {
        useStore.getState().hydrate(api.load());
      });

    subscribeGreenhouse((greenhouse) => {
      const state = useStore.getState();
      const uid = state.data.sessionUserId;
      if (!uid) return;
      const previous = state.data;
      const next: PersistedData = {
        ...previous,
        greenhouses: greenhouse
          ? { ...previous.greenhouses, [uid]: greenhouse }
          : Object.fromEntries(Object.entries(previous.greenhouses).filter(([key]) => key !== uid)),
      };
      useStore.setState({ data: next });
      notifyNew(previous, next);
    });
  }
}

export async function enableNotifications() {
  if (typeof Notification === "undefined") return false;
  const permission = await Notification.requestPermission();
  return permission === "granted";
}
