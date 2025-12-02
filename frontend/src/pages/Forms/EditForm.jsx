import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../utils/storage";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function EditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visitorType, setVisitorType] = useState("both");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadForm();
  }, [id]);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await getFormById(id);
      setTitle(data.title);
      setDescription(data.description || "");
      setVisitorType(data.visitor_type || "both");
    } catch (err) {
      console.error("Error loading form:", err);
      setError("Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      setError("");

      if (!title.trim()) {
        setError("Title is required");
        setSaving(false);
        return;
      }

      await axios.put(
        `${API_BASE_URL}/api/forms/${id}`,
        {
          title: title.trim(),
          description: description.trim(),
          visitor_type: visitorType
        },
        {
          headers: { Authorization: `Bearer ${getToken()}` }
        }
      );

      alert("Form updated successfully!");
      navigate("/forms");
    } catch (err) {
      console.error("Error updating form:", err);
      setError(err.response?.data?.message || "Failed to update form");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <button 
        onClick={() => navigate("/forms")} 
        className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forms
      </button>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Edit Form Settings</h2>

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
              disabled={saving}
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
              disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
                  disabled={saving}
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
              onClick={handleUpdate}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => navigate("/forms")}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}