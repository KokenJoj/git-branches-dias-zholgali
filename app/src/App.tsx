import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/Shell";
import { AlertsScreen } from "./screens/alerts";
import { PairScreen, SignIn, SignUp, Welcome } from "./screens/auth";
import { Controls, RulesScreen } from "./screens/controls";
import { HistoryScreen } from "./screens/history";
import { Dashboard, SensorScreen } from "./screens/home";
import { CalendarScreen, CropDetail, DiaryScreen, HarvestScreen, PlantsHome, RemindersScreen } from "./screens/plants";
import { SettingsScreen } from "./screens/settings";
import { useSession } from "./store/useStore";

function RequireAuth() {
  const { user } = useSession();
  if (!user) return <Navigate to="/signin" replace />;
  return <AppShell />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route element={<RequireAuth />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/controls" element={<Controls />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/plants" element={<PlantsHome />} />
        <Route path="/plants/:cropId" element={<CropDetail />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/reminders" element={<RemindersScreen />} />
        <Route path="/harvest" element={<HarvestScreen />} />
        <Route path="/diary" element={<DiaryScreen />} />
        <Route path="/alerts" element={<AlertsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/sensor/:metric" element={<SensorScreen />} />
        <Route path="/rules" element={<RulesScreen />} />
        <Route path="/pair" element={<PairScreen />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
