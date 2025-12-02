import { Routes, Route } from "react-router-dom";
import VisitorSelect from "./pages/Login/VisitorSelect.jsx";
import GuestLogin from "./pages/Login/GuestLogin.jsx";
import InternalLogin from "./pages/Login/InternalLogin.jsx";
import AdminLogin from "./pages/Login/AdminLogin.jsx";
import FormList from "./pages/Forms/FormList.jsx";
import FormView from "./pages/Forms/FormView.jsx";
import CreateForm from "./pages/Forms/CreateForm.jsx";
import AddQuestions from "./pages/Forms/AddQuestions.jsx";
import ResponseList from "./pages/Responses/ResponseList.jsx";
import ResponseView from "./pages/Responses/ResponseView.jsx";
import DownloadReports from "./pages/Reports/DownloadReports.jsx"; // NEW
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import FormSelect from "./pages/Forms/FormSelect.jsx";

function App() {
  return (
    <Routes>
      {/* Visitor */}
      <Route path="/" element={<VisitorSelect />} />
      <Route path="/login/guest" element={<GuestLogin />} />
      <Route path="/login/internal" element={<InternalLogin />} />

      {/* Form Selection */}
      <Route path="/forms/select" element={<FormSelect />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* forms */}
      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <FormList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/forms/create"
        element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        }
      />

      <Route path="/forms/:id" element={<FormView />} />

      <Route
        path="/forms/:id/questions"
        element={
          <ProtectedRoute>
            <AddQuestions />
          </ProtectedRoute>
        }
      />

      {/* responses */}
      <Route
        path="/forms/:id/responses"
        element={
          <ProtectedRoute>
            <ResponseList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/responses/:id"
        element={
          <ProtectedRoute>
            <ResponseView />
          </ProtectedRoute>
        }
      />

      {/* NEW: Download Reports */}
      <Route
        path="/reports/download"
        element={
          <ProtectedRoute>
            <DownloadReports />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;