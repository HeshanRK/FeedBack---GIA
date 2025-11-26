import { useEffect, useState } from "react";
import { getForms } from "../../api/formApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function FormSelect() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const visitorType = localStorage.getItem("visitorType");
  const visitorId = localStorage.getItem("visitorId");

  useEffect(() => {
    // Check if visitor is logged in
    if (!visitorId || !visitorType) {
      navigate("/");
      return;
    }

    const fetchForms = async () => {
      try {
        setLoading(true);
        const data = await getForms(visitorType);
        setForms(data);
      } catch (err) {
        console.error("Error fetching forms:", err);
        setError(err.response?.data?.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [visitorType, visitorId, navigate]);

  const handleFormClick = (formId) => {
    navigate(`/forms/${formId}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Select a <span className="text-indigo-600">Feedback Form</span>
          </h1>
          <p className="text-gray-500">Choose a form to provide your feedback</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms available</h3>
            <p className="text-gray-500 mb-6">There are no feedback forms available for you at this time.</p>
            <button
              onClick={() => {
                localStorage.removeItem("visitorId");
                localStorage.removeItem("visitorType");
                navigate("/");
              }}
              className="text-indigo-600 hover:text-indigo-700 font-semibold"
            >
              ← Back to Login
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {forms.map((form) => (
              <div
                key={form.id}
                onClick={() => handleFormClick(form.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all p-6 cursor-pointer border-2 border-transparent hover:border-indigo-500 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-all flex-shrink-0">
                    <svg className="w-6 h-6 text-indigo-600 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-all">
                      {form.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3">
                      {form.description || "Click to fill out this feedback form"}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                        {form.visitor_type === 'both' ? 'All Visitors' : 
                         form.visitor_type === 'guest' ? 'Guest Only' : 'Internal Only'}
                      </span>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logout Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              localStorage.removeItem("visitorId");
              localStorage.removeItem("visitorType");
              navigate("/");
            }}
            className="text-gray-500 hover:text-gray-700 font-semibold"
          >
            ← Logout
          </button>
        </div>
      </div>
    </div>
  );
}