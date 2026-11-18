import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Button, Card, EmptyState, Field, Pill, ScreenHeader, Segmented, Sheet } from "../components/ui";
import { cropMap, crops, months, photoStatuses, reminderKinds, seasons, type MonthGuide } from "../data/content";
import { formatBand } from "../lib/format";
import type { CropId, PhotoStatus, ReminderKind, Unit } from "../types";
import { useSession, useStore } from "../store/useStore";

export function PlantsHome() {
  const { user, greenhouse } = useSession();
  const navigate = useNavigate();
  const unit: Unit = greenhouse?.unit ?? "C";
  if (!user) return <Navigate to="/signin" replace />;
  const estimate = greenhouse?.estimate;
  const saved = estimate ? cropMap[estimate.cropId] : null;
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Advice" title="Plant guide" />
      <div className="mt-2 grid grid-cols-2 gap-3">
        {crops.map((crop) => (
          <Card key={crop.id} onClick={() => navigate(`/plants/${crop.id}`)}>
            <p className="text-[15px] font-semibold">{crop.name}</p>
            <p className="mt-2 text-[13px] text-muted">{formatBand(crop.dayMin, crop.dayMax, unit)}</p>
            <p className="text-[13px] text-muted">Soil {crop.soil}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        <Card onClick={() => navigate("/calendar")}>
          <p className="text-[15px] font-semibold">Season calendar</p>
          <p className="mt-1 text-[13px] text-muted">What to sow this month, and what to leave until later.</p>
        </Card>
        <Card onClick={() => navigate("/reminders")}>
          <p className="text-[15px] font-semibold">Care reminders</p>
          <p className="mt-1 text-[13px] text-muted">{greenhouse ? `${greenhouse.reminders.filter((item) => !item.done).length} still open` : "Pair a greenhouse to keep a list."}</p>
        </Card>
        <Card onClick={() => navigate("/harvest")}>
          <p className="text-[15px] font-semibold">Harvest calculator</p>
          <p className="mt-1 text-[13px] text-muted">
            {saved ? `${saved.name}, ${estimate?.plants} plants · about ${Math.round(saved.yieldMin * (estimate?.plants ?? 0))}–${Math.round(saved.yieldMax * (estimate?.plants ?? 0))} kg` : "A rough yield from crop and plant count."}
          </p>
        </Card>
        <Card onClick={() => navigate("/diary")}>
          <p className="text-[15px] font-semibold">Photo diary</p>
          <p className="mt-1 text-[13px] text-muted">{greenhouse?.photos.length ? `${greenhouse.photos.length} photos` : "Add a photo and tag how the plant looks."}</p>
        </Card>
      </div>
    </div>
  );
}

export function CropDetail() {
  const { cropId = "" } = useParams();
  const crop = cropMap[cropId as CropId];
  const { greenhouse } = useSession();
  const unit: Unit = greenhouse?.unit ?? "C";
  const navigate = useNavigate();
  if (!crop) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader title="Plant guide" back />
        <EmptyState title="Crop not in the handbook" body="Tomatoes, cucumbers, peppers, and greens are the four crops in this guide." />
      </div>
    );
  }
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Crop handbook" title={crop.name} back />
      <p className="mt-1 text-[13px] leading-[18px] text-muted">{crop.summary}</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card><p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Day temperature</p><p className="tabular mt-2 text-[24px] leading-7 font-medium">{formatBand(crop.dayMin, crop.dayMax, unit)}</p></Card>
        <Card><p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Soil moisture</p><p className="tabular mt-2 text-[24px] leading-7 font-medium">{crop.soil}</p></Card>
        <Card><p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Night</p><p className="mt-2 text-[15px] font-semibold">{formatBand(crop.nightMin, crop.nightMax, unit)}</p></Card>
        <Card><p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Humidity</p><p className="mt-2 text-[15px] font-semibold">{crop.humidity}</p></Card>
      </div>
      <Card className="mt-3">
        <p className="text-[15px] font-semibold">Care this week</p>
        <ul className="mt-2 grid gap-2">
          {crop.care.map((item) => <li key={item} className="text-[13px] leading-[18px] text-muted">{item}</li>)}
        </ul>
      </Card>
      <Card className="mt-3">
        <p className="text-[15px] font-semibold">Feeding guide</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">{crop.feeding}</p>
      </Card>
      <div className="mt-3 grid gap-3">
        {crop.problems.map((problem) => (
          <Card key={problem.title}>
            <p className="text-[15px] font-semibold">{problem.title}</p>
            <p className="mt-1 text-[13px] leading-[18px] text-muted">{problem.body}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={() => navigate("/harvest")}>Estimate harvest</Button>
      </div>
    </div>
  );
}

export function CalendarScreen() {
  const now = new Date().getMonth();
  const [monthId, setMonthId] = useState(now);
  const month = months[monthId];
  const addReminder = useStore((state) => state.addReminder);
  const { greenhouse } = useSession();
  const [added, setAdded] = useState(false);
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Planting calendar" title="Season" back />
      <div className="flex gap-2 overflow-auto pb-1">
        {seasons.map((season) => (
          <Pill key={season} active={month.season === season} onClick={() => setMonthId(months.find((item) => item.season === season)?.id ?? 0)}>{season}</Pill>
        ))}
      </div>
      <div className="mt-3 flex gap-2 overflow-auto pb-1">
        {months.map((item) => (
          <Pill key={item.id} active={item.id === monthId} onClick={() => { setMonthId(item.id); setAdded(false); }}>{item.name.slice(0, 3)}</Pill>
        ))}
      </div>
      <MonthCard month={month} />
      <div className="mt-4">
        <Button
          disabled={!greenhouse || added}
          onClick={() => {
            addReminder({ title: month.plant, kind: "planting", when: month.name });
            setAdded(true);
          }}
        >
          {added ? "Added to reminders" : "Add planting to reminders"}
        </Button>
      </div>
      {!greenhouse ? <p className="mt-2 text-[13px] text-muted">Pair a greenhouse to save this onto the reminder list.</p> : null}
    </div>
  );
}

function MonthCard({ month }: { month: MonthGuide }) {
  return (
    <div className="mt-4 grid gap-3">
      <Card>
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">{month.season}</p>
        <p className="mt-2 text-[18px] font-medium">{month.name}</p>
        <p className="mt-2 text-[13px] leading-[18px] text-muted">{month.plant}</p>
      </Card>
      <Card>
        <p className="text-[15px] font-semibold">Leave this for later</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">{month.avoid}</p>
      </Card>
      <Card>
        <p className="text-[15px] font-semibold">This month</p>
        <p className="mt-1 text-[13px] leading-[18px] text-muted">{month.tip}</p>
      </Card>
    </div>
  );
}

export function RemindersScreen() {
  const { user, greenhouse } = useSession();
  const toggleReminder = useStore((state) => state.toggleReminder);
  const addReminder = useStore((state) => state.addReminder);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ReminderKind>("watering");
  const [when, setWhen] = useState("Every weekend");
  const [error, setError] = useState("");
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader eyebrow="Plant guide" title="Reminders" back />
        <EmptyState title="No greenhouse yet" body="Reminders are saved with your greenhouse." />
      </div>
    );
  }
  const openCount = greenhouse.reminders.filter((item) => !item.done).length;
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow={`${openCount} open`} title="Reminders" back />
      <div className="mt-2 grid gap-3">
        {greenhouse.reminders.map((item) => (
          <Card key={item.id} className="flex items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={item.done}
              aria-label={item.title}
              onClick={() => toggleReminder(item.id)}
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[8px] border ${item.done ? "border-forest bg-forest text-white" : "border-hairline bg-card"}`}
            >
              {item.done ? "✓" : ""}
            </button>
            <span>
              <span className={`block text-[15px] font-semibold ${item.done ? "text-muted line-through" : ""}`}>{item.title}</span>
              <span className="mt-1 block text-[13px] text-muted">{reminderKinds.find((kindItem) => kindItem.id === item.kind)?.label} · {item.when}</span>
            </span>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={() => setOpen(true)}>Add reminder</Button>
      </div>
      {open ? (
        <Sheet title="Add reminder" onClose={() => setOpen(false)}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (title.trim().length < 3) {
                setError("Add a short reminder.");
                return;
              }
              addReminder({ title: title.trim(), kind, when: when.trim() || "Every weekend" });
              setOpen(false);
              setTitle("");
              setError("");
            }}
          >
            <Field label="Reminder" value={title} onChange={(event) => setTitle(event.target.value)} error={error} />
            <Segmented value={kind} options={reminderKinds} onChange={setKind} />
            <Field label="When" value={when} onChange={(event) => setWhen(event.target.value)} />
            <Button type="submit">Save reminder</Button>
          </form>
        </Sheet>
      ) : null}
    </div>
  );
}

export function HarvestScreen() {
  const { greenhouse } = useSession();
  const saveEstimate = useStore((state) => state.saveEstimate);
  const [cropId, setCropId] = useState<CropId>(greenhouse?.estimate?.cropId ?? "tomatoes");
  const [plants, setPlants] = useState(greenhouse?.estimate?.plants ?? 8);
  const [saved, setSaved] = useState(false);
  const crop = cropMap[cropId];
  const count = Number.isFinite(plants) ? Math.max(0, Math.round(plants)) : 0;
  const min = useMemo(() => Math.round(crop.yieldMin * count * 10) / 10, [crop, count]);
  const max = useMemo(() => Math.round(crop.yieldMax * count * 10) / 10, [crop, count]);
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Plant guide · Yield estimate" title="Harvest" back />
      <div className="grid grid-cols-2 gap-2">
        {crops.map((item) => (
          <Pill key={item.id} active={item.id === cropId} onClick={() => { setCropId(item.id); setSaved(false); }}>{item.name}</Pill>
        ))}
      </div>
      <Card className="mt-4">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Plant count</p>
        <div className="mt-2 flex items-center gap-3">
          <button type="button" className="grid h-12 w-12 place-items-center rounded-[12px] border border-hairline text-[20px]" onClick={() => { setPlants(Math.max(1, count - 1)); setSaved(false); }} aria-label="Fewer plants">–</button>
          <input className="tabular h-12 flex-1 rounded-[12px] border border-hairline text-center text-[20px]" inputMode="numeric" value={count} onChange={(event) => { setPlants(Number(event.target.value)); setSaved(false); }} />
          <button type="button" className="grid h-12 w-12 place-items-center rounded-[12px] border border-hairline text-[20px]" onClick={() => { setPlants(count + 1); setSaved(false); }} aria-label="More plants">+</button>
        </div>
      </Card>
      <Card className="mt-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">Estimated season harvest</p>
        <p className="tabular mt-2 text-[32px] leading-9 font-medium">{count > 0 ? `${min}–${max} kg` : "—"}</p>
        <p className="mt-2 text-[13px] leading-[18px] text-muted">{crop.yieldNote}</p>
      </Card>
      <div className="mt-4">
        <Button
          disabled={!greenhouse || count < 1}
          onClick={() => {
            saveEstimate({ cropId, plants: count, at: Date.now() });
            setSaved(true);
          }}
        >
          {saved ? "Estimate saved" : "Save estimate"}
        </Button>
      </div>
      {!greenhouse ? <p className="mt-2 text-[13px] text-muted">Pair a greenhouse to keep this estimate.</p> : null}
    </div>
  );
}

async function compress(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 960 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  if (!context) return fileToData(file);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.72);
}

function fileToData(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function DiaryScreen() {
  const { user, greenhouse } = useSession();
  const addPhoto = useStore((state) => state.addPhoto);
  const deletePhoto = useStore((state) => state.deletePhoto);
  const [filter, setFilter] = useState<PhotoStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [cropId, setCropId] = useState<CropId>("tomatoes");
  const [status, setStatus] = useState<PhotoStatus>("ok");
  const [note, setNote] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  if (!user) return <Navigate to="/signin" replace />;
  if (!greenhouse) {
    return (
      <div className="px-5 pt-4">
        <ScreenHeader eyebrow="Plant guide" title="Photo diary" back />
        <EmptyState title="No greenhouse yet" body="Photos are saved with your greenhouse." />
      </div>
    );
  }
  const photos = greenhouse.photos.filter((photo) => filter === "all" || photo.status === filter);
  const current = greenhouse.photos.find((photo) => photo.id === selected);
  return (
    <div className="px-5 pt-2 pb-8">
      <ScreenHeader eyebrow="Photo diary" title="Diary" back />
      <div className="flex gap-2 overflow-auto pb-1">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>All</Pill>
        {photoStatuses.map((item) => (
          <Pill key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</Pill>
        ))}
      </div>
      {photos.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No photos yet" body="Add a photo, choose the crop, and tag it OK, yellow leaves, pests, or other." />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {photos.map((photo) => (
            <button key={photo.id} type="button" onClick={() => setSelected(photo.id)} className="overflow-hidden rounded-[20px] border border-hairline bg-card text-left">
              <img src={photo.image} alt="" className="h-32 w-full object-cover" />
              <span className="block px-3 py-2">
                <span className="block text-[13px] font-semibold">{cropMap[photo.cropId].name}</span>
                <span className="block text-[12px] text-muted">{photoStatuses.find((item) => item.id === photo.status)?.label}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Button onClick={() => setOpen(true)}>Add photo</Button>
      </div>
      {open ? (
        <Sheet title="Add photo entry" onClose={() => setOpen(false)}>
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!image) {
                setError("Add a photo first.");
                return;
              }
              addPhoto({ cropId, status, note: note.trim(), image });
              setOpen(false);
              setImage("");
              setNote("");
              setError("");
              setStatus("ok");
            }}
          >
            <label className="grid cursor-pointer place-items-center rounded-[20px] border border-dashed border-hairline bg-tint px-4 py-8 text-center">
              {image ? <img src={image} alt="" className="h-32 w-full rounded-[12px] object-cover" /> : <span className="text-[13px] font-semibold text-forest">Upload greenhouse photo</span>}
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    setImage(await compress(file));
                    setError("");
                  } catch {
                    setError("Could not read that photo.");
                  }
                }}
              />
            </label>
            {error ? <p className="text-[13px] font-medium text-terracotta">{error}</p> : null}
            <div className="grid grid-cols-2 gap-2">
              {crops.map((crop) => (
                <Pill key={crop.id} active={crop.id === cropId} onClick={() => setCropId(crop.id)}>{crop.name}</Pill>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {photoStatuses.map((item) => (
                <Pill key={item.id} active={status === item.id} tone={item.id === "ok" ? "ok" : item.id === "yellow" ? "warn" : item.id === "pests" ? "alert" : "neutral"} onClick={() => setStatus(item.id)}>{item.label}</Pill>
              ))}
            </div>
            <Field label="Note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Optional" />
            <Button type="submit">Save entry</Button>
          </form>
        </Sheet>
      ) : null}
      {current ? (
        <Sheet title={cropMap[current.cropId].name} onClose={() => setSelected(null)}>
          <img src={current.image} alt="" className="h-56 w-full rounded-[20px] object-cover" />
          <p className="mt-3 text-[15px] font-semibold">{photoStatuses.find((item) => item.id === current.status)?.label}</p>
          {current.note ? <p className="mt-1 text-[13px] text-muted">{current.note}</p> : null}
          <div className="mt-4">
            <Button variant="danger" onClick={() => { deletePhoto(current.id); setSelected(null); }}>Remove photo</Button>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}
