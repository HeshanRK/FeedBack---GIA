import { useEffect, useState } from "react";
import { getForms } from "../../api/formApi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../utils/storage";

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      // Refresh the list
      fetchForms();
      alert("Form deleted successfully!");
    } catch (err) {
      console.error("Error deleting form:", err);
      alert(err.response?.data?.message || "Failed to delete form");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 px-4 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Forms</h1>
          <p className="text-gray-500 mt-1">Manage your feedback forms</p>
        </div>
        <Link 
          to="/forms/create" 
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Form
        </Link>
      </div>

      {/* Forms List */}
      {forms.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No forms yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first feedback form</p>
          <Link 
            to="/forms/create" 
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
          >
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{form.title}</h3>
                  <p className="text-gray-500 text-sm mb-3">{form.description || "No description"}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-600">
                      {form.visitor_type === 'both' ? 'All Visitors' : 
                       form.visitor_type === 'guest' ? 'Guest Only' : 'Internal Only'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Link 
                    to={`/forms/${form.id}`} 
                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all font-medium text-sm"
                  >
                    View
                  </Link>
                  <Link 
                    to={`/forms/${form.id}/questions`} 
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/forms/${form.id}/responses`} 
                    className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all font-medium text-sm"
                  >
                    Responses
                  </Link>
                  <button 
                    onClick={() => handleDelete(form.id)} 
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}