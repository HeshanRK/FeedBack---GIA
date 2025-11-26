import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadPdf } from "../../api/responseApi";
import axios from "axios";
import { getToken } from "../../utils/storage";
import { API_BASE_URL } from "../../config/api";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ResponseView() {
  const { id } = useParams();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/responses/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
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

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!response || response.length === 0) {
    return <p className="text-center mt-10">No response data found</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="font-bold text-xl mb-4">Response #{id}</h2>

      <button
        onClick={download}
        className="bg-purple-600 text-white p-2 rounded mb-4 w-full hover:bg-purple-700"
      >
        Download PDF
      </button>

      {response.map((a, idx) => (
        <div key={idx} className="border-b p-2">
          <p className="font-semibold">{a.q_text}</p>
          <p className="text-gray-600">{a.value}</p>
        </div>
      ))}
    </div>
  );
}