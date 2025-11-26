import { useState } from "react";
import { createForm } from "../../api/formApi";
import { useNavigate } from "react-router-dom";

export default function CreateForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visitorType, setVisitorType] = useState("both");
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

      const res = await createForm({ title, description, visitor_type: visitorType });
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
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Form</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Form Title <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-50"
              placeholder="e.g., Customer Feedback Form"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description (Optional)
            </label>
            <textarea
              className="w-full border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 bg-gray-50"
              rows="3"
              placeholder="Enter form description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Who can access this form? <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                <input
                  type="radio"
                  name="visitor_type"
                  value="both"
                  checked={visitorType === "both"}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                  disabled={loading}
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-800">Both (Guest & Internal)</span>
                  <p className="text-sm text-gray-500">All visitors can access this form</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                <input
                  type="radio"
                  name="visitor_type"
                  value="guest"
                  checked={visitorType === "guest"}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                  disabled={loading}
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-800">Guest Visitors Only</span>
                  <p className="text-sm text-gray-500">Only external guests can access this form</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 transition-all">
                <input
                  type="radio"
                  name="visitor_type"
                  value="internal"
                  checked={visitorType === "internal"}
                  onChange={(e) => setVisitorType(e.target.value)}
                  className="w-4 h-4 text-indigo-600"
                  disabled={loading}
                />
                <div className="ml-3">
                  <span className="font-semibold text-gray-800">Internal Visitors Only</span>
                  <p className="text-sm text-gray-500">Only internal employees can access this form</p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={submit}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Form"}
            </button>

            <button
              onClick={() => navigate("/forms")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}