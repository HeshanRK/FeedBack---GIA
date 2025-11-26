import { useState } from "react";
import { guestLogin } from "../../api/visitorApi";
import { useNavigate } from "react-router-dom";

export default function GuestLogin() {
  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [purpose, setPurpose] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    const res = await guestLogin({ name, organization, purpose });
    localStorage.setItem("visitorId", res.visitorId);
    navigate("/forms/1"); // redirect to form 1 for now
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Guest Visitor Login</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Organization (optional)"
        value={organization}
        onChange={(e) => setOrganization(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Purpose (optional)"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      />

      <button onClick={submit} className="bg-blue-600 text-white w-full p-2 rounded">
        Continue
      </button>
    </div>
  );
}

