import { Link } from "react-router-dom";

export default function VisitorSelect() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-center mb-6">Choose Login Type</h2>

      <div className="flex flex-col gap-4">
        <Link
          to="/login/guest"
          className="bg-blue-600 text-white p-3 rounded text-center"
        >
          Guest Visitor
        </Link>

        <Link
          to="/login/internal"
          className="bg-green-600 text-white p-3 rounded text-center"
        >
          Internal Visitor
        </Link>

        <Link
          to="/admin/login"
          className="bg-gray-800 text-white p-3 rounded text-center"
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}
