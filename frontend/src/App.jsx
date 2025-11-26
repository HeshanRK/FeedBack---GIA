import { Routes, Route } from "react-router-dom";
import VisitorSelect from "./pages/Login/VisitorSelect.jsx";
import GuestLogin from "./pages/Login/GuestLogin.jsx";
import InternalLogin from "./pages/Login/InternalLogin.jsx";
import AdminLogin from "./pages/Login/AdminLogin.jsx";
import FormList from "./pages/Forms/FormList.jsx";
import FormView from "./pages/Forms/FormView.jsx";
import AddQuestions from "./pages/Forms/AddQuestions.jsx";
import ResponseList from "./pages/Responses/ResponseList.jsx";
import ResponseView from "./pages/Responses/ResponseView.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <Routes>
        {/* Visitor */}
        <Route path="/" element={<VisitorSelect />} />
        <Route path="/login/guest" element={<GuestLogin />} />
        <Route path="/login/internal" element={<InternalLogin />} />

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
      </Routes>
    </div>
  );
}

export default App;
