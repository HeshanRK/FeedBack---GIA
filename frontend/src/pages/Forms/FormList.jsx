import { useEffect, useState } from "react";
import { getForms } from "../../api/formApi";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../utils/storage";
import { useAuth } from "../../context/AuthContext";

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // --- BRAND COLORS ---
  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";
  const lightBg = "#F9F9F9";

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await getForms();
      setForms(data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError(err.response?.data?.message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm("Are you sure you want to delete this form? This action cannot be undone and will delete all questions and responses.")) {
      return;
    }
    
    try {
      await axios.delete(`${API_BASE_URL}/api/forms/${formId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchForms();
      alert("Form deleted successfully!");
    } catch (err) {
      console.error("Error deleting form:", err);
      alert(err.response?.data?.message || "Failed to delete form");
    }
  };

  const handleSetActiveGuest = async (formId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/forms/${formId}/set-active-guest`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchForms();
    } catch (err) {
      console.error("Error setting active guest form:", err);
      alert(err.response?.data?.message || "Failed to set active guest form");
    }
  };

  const handleSetActiveInternal = async (formId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/forms/${formId}/set-active-internal`, {}, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchForms();
    } catch (err) {
      console.error("Error setting active internal form:", err);
      alert(err.response?.data?.message || "Failed to set active internal form");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: lightBg }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white border-l-4 border-red-500 text-red-700 px-6 py-4 rounded shadow-md">
            <h3 className="font-bold">Error</h3>
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 font-sans" style={{ backgroundColor: lightBg }}>
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: dark }}>
              Forms Management
            </h1>
            <p className="text-gray-500">Create, organize, and manage your feedback systems.</p>
          </div>
          
          <div className="flex flex-col items-end gap-4 mt-6 md:mt-0">
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Logged in as</p>
              <p className="font-bold text-lg" style={{ color: gold }}>{user?.username}</p>
            </div>
            
            <div className="flex items-center gap-3">
               <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-400 hover:text-red-500 text-sm font-semibold transition-colors"
              >
                Logout
              </button>

              <Link 
                to="/reports/download" 
                className="px-5 py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                style={{ backgroundColor: dark }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Reports
              </Link>

              <Link 
                to="/forms/create" 
                className="px-6 py-2.5 rounded-lg font-semibold text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
                style={{ backgroundColor: gold }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = goldHover}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = gold}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Form
              </Link>
            </div>
          </div>
        </div>

        {/* --- FORMS LIST --- */}
        {forms.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">No forms created yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Get started by creating a new feedback form for your visitors.
            </p>
            <Link 
              to="/forms/create" 
              className="inline-block px-8 py-3 rounded-lg font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
              style={{ backgroundColor: gold }}
            >
              Create Your First Form
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {forms.map((form) => (
              <div
                key={form.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden"
              >
                {/* Gold Accent Bar on Left */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5"
                  style={{ backgroundColor: gold }}
                ></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pl-4">
                  
                  {/* LEFT: Form Details */}
                  <div className="flex-1">
                    <div className="flex items-start gap-5">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-50 text-gray-400 group-hover:text-white transition-colors duration-300"
                           style={{ backgroundColor: "#F5F5F5" }}>
                         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                              style={{ color: dark }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-800">{form.title}</h3>
                          {/* Badge has been removed from here */}
                        </div>

                        <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                          {form.description || "No description provided"}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>Created: {new Date(form.created_at).toLocaleDateString()}</span>
                          
                          {/* Active Status Indicators */}
                          {(form.is_active_guest || form.is_active_internal) && (
                            <div className="flex gap-2">
                              {form.is_active_guest && (
                                <span className="flex items-center gap-1 text-green-600 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                  Live (Guest)
                                </span>
                              )}
                              {form.is_active_internal && (
                                <span className="flex items-center gap-1 text-blue-600 font-bold">
                                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                  Live (Internal)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Action Buttons */}
                  <div className="flex flex-col gap-3">
                    
                    {/* Primary Actions Row */}
                    <div className="flex items-center gap-2">
                      
                      <Link 
                        to={`/forms/${form.id}/questions`} 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      
                      <Link 
                        to={`/forms/${form.id}/responses`} 
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        Data
                      </Link>

                      <button 
                        onClick={() => handleDelete(form.id)} 
                        className="px-3 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Form"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>

                    {/* Secondary Actions (Activation) Row */}
                    <div className="flex gap-2 justify-end">
                      
                      {/* Guest Activation Button */}
                      {(form.visitor_type === 'guest' || form.visitor_type === 'both') && (
                        <button
                          onClick={() => handleSetActiveGuest(form.id)}
                          disabled={form.is_active_guest}
                          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded border transition-all ${
                            form.is_active_guest
                              ? `bg-gray-100 text-gray-400 cursor-not-allowed border-transparent`
                              : `border-gray-200 text-gray-500 hover:border-[${gold}] hover:text-[${gold}]`
                          }`}
                        >
                          {form.is_active_guest ? (
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                          ) : null}
                          {form.is_active_guest ? 'Active (Guest)' : 'Set Active (Guest)'}
                        </button>
                      )}

                      {/* Internal Activation Button */}
                      {(form.visitor_type === 'internal' || form.visitor_type === 'both') && (
                        <button
                          onClick={() => handleSetActiveInternal(form.id)}
                          disabled={form.is_active_internal}
                          className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded border transition-all ${
                            form.is_active_internal
                              ? `bg-gray-100 text-gray-400 cursor-not-allowed border-transparent`
                              : `border-gray-200 text-gray-500 hover:border-[${gold}] hover:text-[${gold}]`
                          }`}
                        >
                          {form.is_active_internal ? (
                             <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                             </svg>
                          ) : null}
                          {form.is_active_internal ? 'Active (Internal)' : 'Set Active (Internal)'}
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}