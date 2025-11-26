import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <Link to="/" className="font-bold text-xl text-blue-600">
        Feedback App
      </Link>

      <div>
        {!user ? (
          <Link to="/admin/login" className="text-blue-600">
            Admin Login
          </Link>
        ) : (
          <button onClick={logout} className="text-red-500">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
