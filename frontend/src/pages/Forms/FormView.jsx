import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import { submitResponse } from "../../api/responseApi";
import QuestionBox from "../../components/forms/QuestionBox";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function FormView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const visitorId = localStorage.getItem("visitorId");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const data = await getFormById(id);
        setForm(data);
        setAnswers(
          data.questions.map((q) => ({
            question_id: q.id,
            value: q.q_type === "checkbox" ? [] : "",
          }))
        );
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(err.response?.data?.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [id]);

  const changeAnswer = (qid, value) => {
    setAnswers((prev) =>
      prev.map((a) => (a.question_id === qid ? { ...a, value } : a))
    );
  };

  const validateAnswers = () => {
    if (!form) return false;

    for (const question of form.questions) {
      if (question.required) {
        const answer = answers.find((a) => a.question_id === question.id);
        if (
          !answer ||
          !answer.value ||
          (Array.isArray(answer.value) && answer.value.length === 0) ||
          (typeof answer.value === "string" && answer.value.trim() === "")
        ) {
          setError(`Please answer the required question: "${question.q_text}"`);
          return false;
        }
      }
    }
    return true;
  };

  const submit = async () => {
    try {
      setError("");
      setSuccess(false);

      if (!visitorId) {
        setError("Please login first");
        return;
      }

      if (!validateAnswers()) {
        return;
      }

      setSubmitting(true);
      await submitResponse(id, { visitorId, answers });
      setSuccess(true);

      setTimeout(() => {
        navigate("/forms/select");
      }, 2000);
    } catch (err) {
      console.error("Error submitting response:", err);
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/forms/select")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            Back to Form Selection
          </button>
        </div>
      </div>
    );
  }

  if (!form) return <p className="text-center mt-10">Form not found</p>;

  // Format Date for the Auto-fill (Readable for display)
  const today = new Date();
  const displayDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 font-serif">
      {/* This Style Block overrides the inputs inside QuestionBox 
        to look like "Paper Lines" instead of boxes 
      */}
      <style>{`
        .paper-theme input[type="text"], 
        .paper-theme input[type="email"], 
        .paper-theme input[type="number"], 
        .paper-theme textarea,
        .paper-theme select {
            background-color: transparent !important;
            border-width: 0 0 1px 0 !important; /* Bottom border only */
            border-color: #9ca3af !important; /* gray-400 */
            border-radius: 0 !important;
            font-family: 'Courier New', Courier, monospace !important;
            padding: 4px 0 !important;
            box-shadow: none !important;
            font-size: 1.1rem !important;
        }
        .paper-theme input:focus, 
        .paper-theme textarea:focus {
            border-color: #4f46e5 !important; /* Indigo-600 */
            background-color: rgba(79, 70, 229, 0.05) !important;
            outline: none !important;
            box-shadow: none !important;
        }
        /* Style the labels to look like printed form text */
        .paper-theme label {
            font-family: 'Segoe UI', sans-serif !important;
            font-weight: 700 !important;
            color: #374151 !important;
            text-transform: uppercase !important;
            font-size: 0.85rem !important;
            letter-spacing: 0.05em !important;
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        {/* Back Button - Outside the paper */}
        <button
          onClick={() => navigate("/forms/select")}
          className="mb-6 text-gray-600 hover:text-indigo-700 font-sans font-semibold flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Selection
        </button>

        {/* --- THE PAPER DOCUMENT --- */}
        {/* max-w-[210mm] creates the A4 width */}
        <div className="bg-white shadow-2xl relative mx-auto max-w-[210mm] min-h-[297mm] p-[25mm] pb-[40mm]">
          
          {/* 1. Watermark (Faded Logo) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <img
              src="/gia Logo.png"
              alt="Watermark"
              className="w-[400px] opacity-[0.06]"
            />
          </div>

          {/* 2. Header (Letterhead) */}
          <div className="relative z-10 flex justify-between items-end border-b-2 border-black pb-6 mb-10">
            <div className="flex items-center gap-4">
              <img
                src="/gia Logo.png"
                alt="GIA Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest m-0">
                Feedback Form
              </h1>
              <p className="text-xs text-gray-500 font-sans font-bold uppercase mt-1">
                GIA Feedback System
              </p>
            </div>
          </div>

          {/* 3. Form Content */}
          <div className="relative z-10 paper-theme">
            
            {/* Auto Date Field */}
            <div className="flex justify-end mb-10">
              <div className="w-48">
                <label className="block text-xs font-bold text-gray-500 uppercase font-sans mb-1">
                  Date
                </label>
                <div className="border-b border-gray-400 font-mono text-lg text-gray-800 pb-1">
                   {displayDate}
                </div>
              </div>
            </div>

            {/* Error / Success Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-800 font-sans text-sm border border-green-200 text-center">
                Feedback recorded successfully. Redirecting...
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-800 font-sans text-sm border border-red-200 text-center">
                {error}
              </div>
            )}

            {/* Questions Loop */}
            <div className="space-y-10">
              {form.questions.map((q) => (
                <div key={q.id}>
                  <QuestionBox
                    question={q}
                    answer={answers.find((a) => a.question_id === q.id)?.value}
                    setAnswer={(val) => changeAnswer(q.id, val)}
                  />
                </div>
              ))}
            </div>

            {/* 4. Submit Button (Stamps the paper) */}
            <div className="mt-16 mb-16 text-center">
              <button
                onClick={submit}
                disabled={submitting}
                className="bg-indigo-600 text-white font-sans text-sm font-bold uppercase tracking-wider py-3 px-10 rounded shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Record"}
              </button>
            </div>
          </div>

          {/* 5. Footer - Changed from absolute to relative */}
          <div className="relative z-10 border-t border-gray-300 pt-4 text-center mt-8">
            <p className="text-[10px] text-gray-400 font-sans">
              Generated by GIA Feedback System. Internal Use Only. © 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}