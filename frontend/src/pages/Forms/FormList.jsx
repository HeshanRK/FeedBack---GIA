import { useEffect, useState } from "react";
import { getForms } from "../../api/formApi";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function FormList() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchForms();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">Forms</h2>
  {/* TODO: Add Create Form functionality */}
</div>

      {forms.length === 0 ? (
        <div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold">Forms</h2>
  <Link 
    to="/forms/create" 
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    + Create Form
  </Link>
</div>
      ) : (
        <div className="bg-white shadow p-4 rounded">
          {forms.map((form) => (
            <div
              key={form.id}
              className="p-4 border-b last:border-b-0 flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <h3 className="font-bold">{form.title}</h3>
                <p className="text-gray-500 text-sm">{form.description}</p>
              </div>

              <div className="flex gap-3">
                <Link 
                  to={`/forms/${form.id}`} 
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
                <Link 
                  to={`/forms/${form.id}/questions`} 
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <Link 
                  to={`/forms/${form.id}/responses`} 
                  className="text-purple-600 hover:underline"
                >
                  Responses
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}