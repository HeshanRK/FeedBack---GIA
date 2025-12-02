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

  // --- BRAND COLORS ---
  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";
  const lightBg = "#F9F9F9";

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
    <div className="min-h-screen py-10 px-4 font-sans" style={{ backgroundColor: lightBg }}>
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate("/forms")} 
          className="mb-6 text-gray-500 hover:text-gray-800 font-semibold flex items-center gap-2 transition-colors group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Forms
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
          {/* Gold Accent Bar */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: gold }}></div>

          <h2 className="text-3xl font-bold mb-6 font-serif" style={{ color: dark }}>
            Edit Form Settings
          </h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6 pl-2">
            
            {/* Title Input */}
            <div>
              <label className="block font-bold text-sm uppercase tracking-wider mb-2" style={{ color: dark }}>
                Form Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                style={{ outlineColor: gold }}
                placeholder="e.g., Customer Feedback Form"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={saving}
                onFocus={(e) => {
                    e.target.style.borderColor = gold;
                    e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB"; // gray-300
                    e.target.style.backgroundColor = "#F9FAFB"; // gray-50
                }}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block font-bold text-sm uppercase tracking-wider mb-2" style={{ color: dark }}>
                Description (Optional)
              </label>
              <textarea
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none bg-gray-50 transition-all"
                rows="3"
                placeholder="Enter form description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                onFocus={(e) => {
                    e.target.style.borderColor = gold;
                    e.target.style.backgroundColor = "white";
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.backgroundColor = "#F9FAFB";
                }}
              />
            </div>

            {/* Visitor Type Selection */}
            <div>
              <label className="block font-bold text-sm uppercase tracking-wider mb-3" style={{ color: dark }}>
                Who can access this form? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                
                {/* Option: Both */}
                <label 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    visitorType === "both" ? "bg-[#FFFBF0]" : "hover:bg-gray-50"
                  }`}
                  style={{ borderColor: visitorType === "both" ? gold : "#E5E7EB" }}
                >
                  <input
                    type="radio"
                    name="visitor_type"
                    value="both"
                    checked={visitorType === "both"}
                    onChange={(e) => setVisitorType(e.target.value)}
                    className="w-5 h-5"
                    style={{ accentColor: gold }}
                    disabled={saving}
                  />
                  <div className="ml-3">
                    <span className="font-semibold block" style={{ color: dark }}>Both (Guest & Internal)</span>
                    <p className="text-sm text-gray-500">All visitors can access this form</p>
                  </div>
                </label>

                {/* Option: Guest */}
                <label 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    visitorType === "guest" ? "bg-[#FFFBF0]" : "hover:bg-gray-50"
                  }`}
                  style={{ borderColor: visitorType === "guest" ? gold : "#E5E7EB" }}
                >
                  <input
                    type="radio"
                    name="visitor_type"
                    value="guest"
                    checked={visitorType === "guest"}
                    onChange={(e) => setVisitorType(e.target.value)}
                    className="w-5 h-5"
                    style={{ accentColor: gold }}
                    disabled={saving}
                  />
                  <div className="ml-3">
                    <span className="font-semibold block" style={{ color: dark }}>Guest Visitors Only</span>
                    <p className="text-sm text-gray-500">Only external guests can access this form</p>
                  </div>
                </label>

                {/* Option: Internal */}
                <label 
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    visitorType === "internal" ? "bg-[#FFFBF0]" : "hover:bg-gray-50"
                  }`}
                  style={{ borderColor: visitorType === "internal" ? gold : "#E5E7EB" }}
                >
                  <input
                    type="radio"
                    name="visitor_type"
                    value="internal"
                    checked={visitorType === "internal"}
                    onChange={(e) => setVisitorType(e.target.value)}
                    className="w-5 h-5"
                    style={{ accentColor: gold }}
                    disabled={saving}
                  />
                  <div className="ml-3">
                    <span className="font-semibold block" style={{ color: dark }}>Internal Visitors Only</span>
                    <p className="text-sm text-gray-500">Only internal employees can access this form</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t border-gray-100">
              <button
                onClick={handleUpdate}
                className="flex-1 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                style={{ backgroundColor: gold }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = goldHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = gold}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => navigate("/forms")}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-bold uppercase tracking-wider hover:bg-gray-200 transition-all"
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}