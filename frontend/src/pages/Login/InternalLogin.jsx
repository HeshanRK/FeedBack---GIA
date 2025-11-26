import { useState } from "react";
import { internalLogin } from "../../api/visitorApi";
import { useNavigate } from "react-router-dom";

export default function InternalLogin() {
  const [id_number, setId] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    const res = await internalLogin({ id_number, name });
    localStorage.setItem("visitorId", res.visitorId);
    navigate("/forms/1");
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Internal Visitor Login</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="ID Number"
        value={id_number}
        onChange={(e) => setId(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={submit} className="bg-green-600 text-white w-full p-2 rounded">
        Continue
      </button>
    </div>
  );
}
