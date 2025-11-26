import { useState } from "react";
import { internalLogin } from "../../api/visitorApi";
import { getForms } from "../../api/formApi";
import { useNavigate } from "react-router-dom";

export default function InternalLogin() {
  const [id_number, setId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

      const res = await internalLogin({ id_number, name });
      localStorage.setItem("visitorId", res.visitorId);
      
      // Fetch available forms and redirect to the first one
      const forms = await getForms();
      if (forms && forms.length > 0) {
        navigate(`/forms/${forms[0].id}`);
      } else {
        setError("No forms available at the moment");
      }
    } catch (err) {
      console.error("Internal login error:", err);
      setError(err.response?.data?.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Internal Visitor Login</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <input
        className="w-full border p-2 mb-3"
        placeholder="ID Number"
        value={id_number}
        onChange={(e) => setId(e.target.value)}
        disabled={loading}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={loading}
      />

      <button 
        onClick={submit} 
        className="bg-green-600 text-white w-full p-2 rounded disabled:bg-green-300"
        disabled={loading}
      >
        {loading ? "Loading..." : "Continue"}
      </button>
    </div>
  );
}