import { useEffect, useState } from "react";
import { getForms } from "../../api/formApi";
import { Link } from "react-router-dom";

export default function FormList() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    getForms().then((data) => setForms(data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Forms</h2>

      <div className="bg-white shadow p-4 rounded">
        {forms.map((form) => (
          <div
            key={form.id}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <h3 className="font-bold">{form.title}</h3>
              <p className="text-gray-500 text-sm">{form.description}</p>
            </div>

            <div className="flex gap-3">
              <Link to={`/forms/${form.id}`} className="text-blue-600">
                View
              </Link>
              <Link to={`/forms/${form.id}/questions`} className="text-green-600">
                Edit
              </Link>
              <Link to={`/forms/${form.id}/responses`} className="text-purple-600">
                Responses
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
