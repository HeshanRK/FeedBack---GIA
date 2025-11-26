import { Link } from "react-router-dom";

export default function VisitorSelect() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-[900px] h-[550px] flex">
        {/* Left Side - Branding */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex flex-col justify-center items-center p-10 relative">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-5 text-3xl">
            📋
          </div>
          <h2 className="text-3xl font-semibold mb-2">Feedback System</h2>
          <p className="text-sm opacity-80">Help us improve GIA factory processes.</p>
          <div className="absolute bottom-5 text-xs opacity-60">
            @TeamDigitalizationGIA | v3.0.2
          </div>
        </div>

        {/* Right Side - Login Options */}
        <div className="w-1/2 flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-1">
            Feedback<span className="text-indigo-600">GIA</span>
          </h1>
          <p className="text-gray-500 mb-10">Please select your visitor type to continue</p>

          <Link
            to="/login/internal"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg text-center font-semibold hover:bg-indigo-700 transition-all mb-4"
          >
            Internal Visitor
          </Link>

          <Link
            to="/login/guest"
            className="w-full bg-transparent border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg text-center font-semibold hover:border-indigo-600 hover:text-indigo-600 hover:bg-gray-50 transition-all mb-4"
          >
            Guest Visitor
          </Link>

          <Link
            to="/admin/login"
            className="text-gray-400 text-sm hover:text-indigo-600 transition-colors mt-3 text-center"
          >
            Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}