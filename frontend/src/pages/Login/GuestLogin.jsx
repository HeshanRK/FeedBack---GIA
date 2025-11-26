import { useState } from "react";
import { guestLogin } from "../../api/visitorApi";
import { getForms } from "../../api/formApi";
import { useNavigate } from "react-router-dom";

export default function GuestLogin() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!name.trim()) {
        setError("Name is required");
        setLoading(false);
        return;
      }

      const res = await guestLogin({ name, organization, purpose });
      localStorage.setItem("visitorId", res.visitorId);
      
      // Fetch available forms and redirect to the first one
      const forms = await getForms();
      if (forms && forms.length > 0) {
        navigate(`/forms/${forms[0].id}`);
      } else {
        setError("No forms available at the moment");
      }
    } catch (err) {
      console.error("Guest login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Guest Visitor Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <input
        className="w-full border p-2 mb-3"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Organization (optional)"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
        disabled={loading}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Purpose (optional)"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        disabled={loading}
      />

      <button 
        onClick={submit} 
        className="bg-blue-600 text-white w-full p-2 rounded disabled:bg-blue-300"
        disabled={loading}
      >
        {loading ? "Loading..." : "Continue"}
      </button>
    </div>
  );
}