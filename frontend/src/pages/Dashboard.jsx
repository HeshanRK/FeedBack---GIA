import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 gap-4">
        <Link className="p-6 bg-white shadow rounded text-center" to="/forms">
          Manage Forms
        </Link>

        <Link className="p-6 bg-white shadow rounded text-center" to="/admin/users">
          Manage Users
        </Link>

        <Link className="p-6 bg-white shadow rounded text-center" to="/analytics">
          Analytics
        </Link>

        <Link className="p-6 bg-white shadow rounded text-center" to="/">
          Visitor Page
        </Link>
      </div>
    </div>
  );
}
