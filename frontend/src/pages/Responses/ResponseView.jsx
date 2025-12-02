import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { downloadPdf } from "../../api/responseApi";
import axios from "axios";
import { getToken } from "../../utils/storage";
import { API_BASE_URL } from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ResponseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/responses/details/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        console.log("Response data:", res.data);
        setResponse(res.data);
      } catch (err) {
        console.error("Error fetching response:", err);
        setError(err.response?.data?.message || "Failed to load response");
      } finally {
        setLoading(false);
      }
    };

    fetchResponse();
  }, [id]);

  const download = async () => {
    try {
      const res = await downloadPdf(id);
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = `response_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert(err.response?.data?.message || "Failed to download PDF");
    }
  };

  // Helper function to format answer values
  const formatAnswerValue = (value) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">No answer provided</span>;
    }
    
    // If it's already an array, join with commas
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : <span className="text-gray-400 italic">No answer provided</span>;
    }
    
    // If it's a string, try to parse as JSON
    if (typeof value === 'string') {
      const stringValue = value.trim();
      
      // Check if it looks like JSON (starts with [ or {)
      if (stringValue.startsWith('[') || stringValue.startsWith('{')) {
        try {
          const parsed = JSON.parse(stringValue);
          
          // If parsed result is an array, join with commas
          if (Array.isArray(parsed)) {
            return parsed.length > 0 ? parsed.join(", ") : <span className="text-gray-400 italic">No answer provided</span>;
          }
          
          // If it's an object, stringify it nicely
          return JSON.stringify(parsed, null, 2);
        } catch {
          // If parsing fails, return as-is
          return stringValue || <span className="text-gray-400 italic">No answer provided</span>;
        }
      }
      
      // Regular string - return as-is
      return stringValue || <span className="text-gray-400 italic">No answer provided</span>;
    }
    
    // If it's an object (but not array), stringify it
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    // For numbers or other types
    return String(value);
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>
      </div>
    );
  }

  if (!response || response.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500">No response data found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold mb-1">Response #{id}</h2>
                <p className="text-indigo-100 text-sm">Feedback Details</p>
              </div>
              <button
                onClick={download}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Answers */}
          <div className="p-6 space-y-6">
            {response.map((answer, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-indigo-600 font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-lg mb-3">{answer.q_text}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {formatAnswerValue(answer.value)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}