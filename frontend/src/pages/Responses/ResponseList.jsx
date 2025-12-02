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
      <div className="max-w-3xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Responses</h2>
        <Link 
          to={`/forms/${id}/questions`}
          className="text-blue-600 hover:underline"
        >
          ← Back to Form
        </Link>
      </div>

      {responses.length === 0 ? (
        <div className="bg-white shadow p-8 rounded text-center">
          <p className="text-gray-500">No responses yet</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded">
          {responses.map((r) => (
            <div key={r.id} className="p-4 border-b last:border-b-0 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-semibold">Response #{r.id}</p>
                <p className="text-sm text-gray-600">
                  {r.visitor_name} ({r.visitor_type})
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(r.submitted_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Link 
                  to={`/responses/${r.id}`} 
                  className="text-blue-600 hover:underline px-3 py-1"
                >
                  View Details
                </Link>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}