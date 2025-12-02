import { useState } from "react";
import { internalLogin } from "../../api/visitorApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function InternalLogin() {
  const [id_number, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!id_number.trim()) {
        setError("ID Number is required");
        setLoading(false);
        return;
      }
      
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      // 1. Perform Login
      const res = await internalLogin({ id_number, name });
      localStorage.setItem("visitorId", res.visitorId);
      localStorage.setItem("visitorType", "internal");
      
      // 2. CHECK FOR ACTIVE FORM
      try {
        const activeFormRes = await axios.get(`${API_BASE_URL}/api/forms/active/internal`);
        const activeForm = activeFormRes.data;
        navigate(`/forms/${activeForm.id}`);

      } catch (formErr) {
        // FIX: We use 'formErr' in the console.log so ESLint knows it's being used
        console.log("No active internal form found, redirecting...", formErr);
        navigate("/forms/select");
      }

    } catch (err) {
      console.error("Internal login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans" style={{ backgroundColor: "#F9F9F9" }}>
      {/* Background Layers */}
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

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex">
        {/* Left Side */}
        <div className="w-1/2 text-white flex flex-col justify-center items-center p-10 relative" style={{ backgroundColor: dark }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 overflow-hidden bg-white p-3 shadow-lg">
            <img src="/gia-logo.PNG" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-semibold mb-2">Feedback System</h2>
          <p className="text-sm opacity-80">Evolve GIA powered by Nucleus</p>
          <div className="absolute bottom-5 text-xs opacity-40">
            @TeamDigitalizationGIA | v3.0.2
          </div>
        </div>

        {/* Right Side */}
        <div className="w-1/2 flex flex-col justify-center px-16 relative">
          <div className="absolute top-0 right-0 w-24 h-2" style={{ backgroundColor: gold }}></div>

          <h1 className="text-4xl font-bold mb-1" style={{ color: dark }}>
            Feedback<span style={{ color: gold }}>GIA</span>
          </h1>
          <p className="text-gray-500 mb-8">Internal Visitor Login</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => e.target.style.borderColor = gold}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                placeholder="Enter ID number"
                value={id_number}
                onChange={(e) => setId(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => e.target.style.borderColor = gold}
                onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              {loading ? "Loading..." : "Continue"}
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