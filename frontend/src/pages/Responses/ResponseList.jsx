import { useEffect, useState } from "react";
import { getResponses } from "../../api/responseApi";
import { Link, useParams } from "react-router-dom";

export default function ResponseList() {
  const { id } = useParams();
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    getResponses(id).then((data) => setResponses(data));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Responses</h2>

      {responses.map((r) => (
        <div key={r.id} className="p-4 border-b flex justify-between">
          <div>
            <p className="font-semibold">Response #{r.id}</p>
            <p className="text-sm text-gray-600">
              {r.visitor_name} ({r.visitor_type})
            </p>
          </div>

          <Link to={`/responses/${r.id}`} className="text-blue-600">
            View
          </Link>
        </div>
      ))}
    </div>
  );
}
