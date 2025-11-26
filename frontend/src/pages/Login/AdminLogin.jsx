import { useState } from "react";
import { loginAdmin } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!username.trim()) {
        setError("Username is required");
        setLoading(false);
        return;
      }
      
      if (!password) {
        setError("Password is required");
        setLoading(false);
        return;
      }

      const res = await loginAdmin(username, password);
      login(res.token);
      navigate("/forms");
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex">
        {/* Left Side - Branding */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-5 text-3xl">
            📋
          </div>
          <h2 className="text-3xl font-semibold mb-2">Feedback System</h2>
          <p className="text-sm opacity-80">Help us improve GIA factory processes.</p>
          <div className="absolute bottom-5 text-xs opacity-60">
            @TeamDigitalizationGIA | Feedback System | v1.0.0
          </div>
        </div>

        {/* Right Side - Admin Form */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            Feedback<span className="text-indigo-600">GIA</span>
          </h1>
          <p className="text-gray-500 mb-8">Admin Login</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Employee ID / User ID
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-50"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-50"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <button 
              onClick={submit} 
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-400 text-sm hover:text-indigo-600 transition-colors mt-3"
            >
              ← Back to Login Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}