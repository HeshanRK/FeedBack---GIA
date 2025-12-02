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

  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans" style={{ backgroundColor: "#F9F9F9" }}>
      
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .page-enter {
          animation: slideInRight 0.5s ease-out forwards;
        }
      `}</style>

      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: `radial-gradient(${gold}40 1px, transparent 1px)`, 
          backgroundSize: "30px 30px" 
        }}
      ></div>

      <img
        src="/gia-logo2.PNG" 
        alt="GIA Watermark"
        className="absolute z-0 pointer-events-none"
        style={{
          width: "2500px", 
          opacity: 0.08, 
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)", 
          filter: "grayscale(100%)" 
        }}
      />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex page-enter">
        <div className="w-1/2 text-white flex flex-col justify-center items-center p-10 relative" style={{ backgroundColor: dark }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 overflow-hidden bg-white p-3 shadow-lg">
            <img 
              src="/gia-logo2.PNG" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h2 className="text-3xl font-semibold mb-2">Feedback System</h2>
          <p className="text-sm opacity-80">Evolve GIA powered by Nucleus</p>
          <div className="absolute bottom-5 text-xs opacity-40">
            @TeamDigitalizationGIA | v3.0.2
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center px-16 relative">
          <div className="absolute top-0 right-0 w-24 h-2" style={{ backgroundColor: gold }}></div>

          <h1 className="text-4xl font-bold mb-1" style={{ color: dark }}>
            Feedback<span style={{ color: gold }}>GIA</span>
          </h1>
          <p className="text-gray-500 mb-8">Admin Login</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Employee ID / User ID
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => e.target.style.borderColor = gold}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Password
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => e.target.style.borderColor = gold}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
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
              className="w-full text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 shadow-md hover:shadow-xl"
              style={{ backgroundColor: gold }}
              onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = goldHover)}
              onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = gold)}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full text-gray-400 text-sm transition-colors mt-3"
              onMouseOver={(e) => (e.currentTarget.style.color = gold)}
              onMouseOut={(e) => (e.currentTarget.style.color = "#9CA3AF")}
            >
              ← Back to Login Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}