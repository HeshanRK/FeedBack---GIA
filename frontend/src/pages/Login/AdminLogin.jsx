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
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Admin Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <input
        className="w-full border p-2 mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
      />

      <button 
        onClick={submit} 
        className="bg-gray-800 text-white w-full p-2 rounded disabled:bg-gray-400 hover:bg-gray-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}