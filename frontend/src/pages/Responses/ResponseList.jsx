import { useEffect, useState, useCallback } from "react";
import { getResponses } from "../../api/responseApi";
import { Link, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";
import { API_BASE_URL } from "../../config/api";
import { getToken } from "../../utils/storage";

export default function ResponseList() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- BRAND COLORS ---
  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";
  const lightBg = "#F9F9F9";

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getResponses(id);
      setResponses(res.data);
    } catch (err) {
      console.error("Error fetching responses:", err);
      setError(err.response?.data?.message || "Failed to load responses");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const handleDelete = async (responseId) => {
    if (!window.confirm("Are you sure you want to delete this response? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/responses/${responseId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      alert("Response deleted successfully!");
      fetchResponses(); // Refresh the list
    } catch (err) {
      console.error("Error deleting response:", err);
      alert(err.response?.data?.message || "Failed to delete response");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen py-8" style={{ backgroundColor: lightBg }}>
        <div className="max-w-4xl mx-auto px-4">
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
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-1" style={{ color: dark }}>
              Form Responses
            </h2>
            <p className="text-gray-500 text-sm">
              Viewing all submissions for Form #{id}
            </p>
          </div>
          
          <Link 
            to={`/forms`}
            className="group flex items-center gap-2 text-sm font-semibold transition-colors mt-4 md:mt-0"
            style={{ color: "#888" }}
            onMouseOver={(e) => e.currentTarget.style.color = dark}
            onMouseOut={(e) => e.currentTarget.style.color = "#888"}
          >
            <span className="group-hover:-translate-x-1 transition-transform">?</span> 
            Back to Forms List
          </Link>
        </div>

        {/* --- CONTENT --- */}
        {responses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-50">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No responses received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {responses.map((r) => (
              <div 
                key={r.id} 
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-gray-100 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-4"
              >
                {/* Gold Accent Bar */}
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: gold }}></div>

                {/* Left: Info */}
                <div className="flex-1 pl-3 w-full">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-bold text-lg" style={{ color: dark }}>
                      {r.visitor_name || "Anonymous Visitor"}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                      r.visitor_type === 'guest' 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-green-50 text-green-600 border-green-100'
                    }`}>
                      {r.visitor_type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-4 4 4M5 7h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Response #{r.id}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {new Date(r.submitted_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                  <Link 
                    to={`/responses/${r.id}`} 
                    className="text-sm font-semibold px-4 py-2 rounded-lg text-white shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5"
                    style={{ backgroundColor: gold }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = goldHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = gold}
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    title="Delete Response"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}