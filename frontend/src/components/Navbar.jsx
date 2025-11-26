import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center text-white text-xl">
            📋
          </div>
          <span className="font-bold text-2xl text-gray-800">
            Feedback<span className="text-indigo-600">GIA</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <Link 
              to="/admin/login" 
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              Admin Login
            </Link>
          ) : (
            <>
              <span className="text-gray-600 text-sm">
                Welcome, <span className="font-semibold">{user.username}</span>
              </span>
              <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}