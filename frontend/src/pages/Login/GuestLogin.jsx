import { useState } from "react";
import { guestLogin } from "../../api/visitorApi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";

export default function GuestLogin() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exiting, setExiting] = useState(false);

  const navigate = useNavigate();

  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      // Mandatory fields
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      if (!organization.trim()) {
        setError("Organization is required");
        setLoading(false);
        return;
      }

      const res = await guestLogin({ name, organization, purpose });
      localStorage.setItem("visitorId", res.visitorId);
      localStorage.setItem("visitorType", "guest");

      try {
        const activeFormRes = await axios.get(`${API_BASE_URL}/api/forms/active/guest`);
        const activeForm = activeFormRes.data;

        // Exit animation
        setExiting(true);

        setTimeout(() => {
          navigate(`/forms/${activeForm.id}`);
        }, 500);

      } catch (formErr) {
        console.error("Error fetching active form:", formErr);
        setError(
          "No feedback form is currently available for guest visitors. Please contact the administrator."
        );
        setLoading(false);
      }
    } catch (err) {
      console.error("Guest login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans"
      style={{ backgroundColor: "#F9F9F9" }}
    >
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
        
        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-50px) scale(0.95);
          }
        }
        
        .page-enter {
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .page-exit {
          animation: slideOutLeft 0.5s ease-out forwards;
        }
      `}</style>

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(${gold}40 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
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
          filter: "grayscale(100%)",
        }}
      />

      <div
        className={`relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex ${
          exiting ? "page-exit" : "page-enter"
        }`}
      >
        <div
          className="w-1/2 text-white flex flex-col justify-center items-center p-10 relative"
          style={{ backgroundColor: dark }}
        >
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-5 overflow-hidden bg-white p-3 shadow-lg">
            <img src="/gia-logo.PNG" alt="Logo" className="w-full h-full object-contain" />
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
          <p className="text-gray-500 mb-8">Guest Visitor Login</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => (e.target.style.borderColor = gold)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Organization - MANDATORY NOW */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Organization <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => (e.target.style.borderColor = gold)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                placeholder="Enter organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Purpose - Optional */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: dark }}>
                Purpose (Optional)
              </label>
              <input
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                onFocus={(e) => (e.target.style.borderColor = gold)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                placeholder="Enter purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
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
              disabled={loading}
            >
              ← Back to Login Options
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
