import { Route, Routes } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import { ProtectedRoute } from "./providers/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import FormsPage from "./pages/dashboard/FormsPage";
import CreateFormPage from "./pages/dashboard/CreateFormPage";
import FormBuilderPage from "./pages/dashboard/FormBuilderPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import ResponsesPage from "./pages/dashboard/ResponsesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PublicFormPage from "./pages/PublicFormPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/f/:slug" element={<PublicFormPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/forms/new" element={<CreateFormPage />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/forms" element={<FormsPage />} />
          <Route path="/dashboard/responses" element={<ResponsesPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route
            path="/dashboard/forms/:id/edit"
            element={<FormBuilderPage />}
          />
          <Route
            path="/dashboard/forms/:id/responses"
            element={<ResponsesPage />}
          />
          <Route
            path="/dashboard/forms/:id/analytics"
            element={<AnalyticsPage />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
