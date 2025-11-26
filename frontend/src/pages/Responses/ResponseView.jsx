import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { downloadPdf } from "../../api/responseApi";
import axios from "axios";

export default function ResponseView() {
  const { id } = useParams();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/responses/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then((res) => setResponse(res.data));
  }, []);

  const download = async () => {
    const res = await downloadPdf(id);
    const url = window.URL.createObjectURL(
      new Blob([res.data], { type: "application/pdf" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `response_${id}.pdf`;
    a.click();
  };

  if (!response) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="font-bold text-xl mb-4">Response #{id}</h2>

      <button
        onClick={download}
        className="bg-purple-600 text-white p-2 rounded mb-4 w-full"
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
