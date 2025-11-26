import { useState } from "react";
import { createForm } from "../../api/formApi";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }

      const res = await createForm({ title, description });
      const formId = res.data.formId;
      
      // Redirect to add questions page
      navigate(`/forms/${formId}/questions`);
    } catch (err) {
      console.error("Error creating form:", err);
      setError(err.response?.data?.message || "Failed to create form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Form</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-2">
          Form Title <span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border p-2 rounded"
          placeholder="Enter form title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Description (Optional)</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          placeholder="Enter form description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Form"}
        </button>

        <button
          onClick={() => navigate("/forms")}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}