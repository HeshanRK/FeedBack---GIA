import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getForms } from "../../api/formApi";
import { downloadAllResponses } from "../../api/reportApi";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function DownloadReports() {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [filters, setFilters] = useState({
    formId: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await getForms();
      setForms(data);
    } catch (err) {
      console.error("Error fetching forms:", err);
      setError("Failed to load forms");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setError("");
      setSuccess("");

      const response = await downloadAllResponses(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const fileName = `FeedbackGIA_Report_${new Date().toISOString().split('T')[0]}_${Date.now()}.xlsx`;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess("✅ Excel report downloaded successfully!");
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.error("Error downloading responses:", err);
      setError(err.response?.data?.message || "Failed to download responses. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      formId: "",
      startDate: "",
      endDate: ""
    });
    setError("");
    setSuccess("");
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/forms")} 
          className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Forms
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with Icon - GIA COLORS */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-yellow-600/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg border-2 border-yellow-600">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Download Feedback Reports</h1>
                <p className="text-yellow-200 text-lg">Export all user responses in a single organized Excel file</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3 animate-pulse">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Excel Preview Info - GIA COLORS */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">📊 Excel Report Structure</h3>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Single Sheet Format</p>
                          <p className="text-gray-600">All responses are organized in one comprehensive sheet</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">User Sections</p>
                          <p className="text-gray-600">Each user's data is grouped together with their complete information</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Question & Answer Table</p>
                          <p className="text-gray-600">Each user section contains a formatted table with all questions and their answers</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">4</span>
                        <div>
                          <p className="font-semibold text-gray-800 mb-1">Professional Formatting</p>
                          <p className="text-gray-600">GIA brand colors with auto-sized columns and clear borders for easy reading</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter Options
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-indigo-600 font-semibold text-sm flex items-center gap-1 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear All
                </button>
              </div>

              {/* Form Filter */}
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Select Form (Optional)
                </label>
                <select
                  className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-800 font-medium transition-all"
                  value={filters.formId}
                  onChange={(e) => setFilters({ ...filters, formId: e.target.value })}
                  disabled={downloading}
                >
                  <option value="">🌐 All Forms</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      📋 {form.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <label className="block text-gray-700 font-bold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date Range (Optional)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-semibold">From Date</label>
                    <input
                      type="date"
                      className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-indigo-500 bg-white transition-all"
                      value={filters.startDate}
                      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                      disabled={downloading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2 font-semibold">To Date</label>
                    <input
                      type="date"
                      className="w-full border-2 border-gray-300 p-4 rounded-lg focus:outline-none focus:border-indigo-500 bg-white transition-all"
                      value={filters.endDate}
                      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                      disabled={downloading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold text-blue-900 mb-2">ℹ️ Download Instructions</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Leave all filters empty to download all feedback responses</li>
                    <li>• Date range is inclusive (both start and end dates included)</li>
                    <li>• Each user's complete feedback is grouped in one section</li>
                    <li>• All data is contained in a single organized Excel sheet</li>
                    <li>• Columns auto-size for easy reading and printing</li>
                    <li>• Download may take a moment for large datasets</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Download Button - GIA COLORS */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-700 text-white py-5 px-8 rounded-xl font-bold text-lg hover:from-yellow-700 hover:to-yellow-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-transform"
            >
              {downloading ? (
                <>
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full"></div>
                  <span>Generating Excel Report...</span>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>📥 Download Excel Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}