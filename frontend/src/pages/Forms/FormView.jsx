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

  // --- BRAND COLORS ---
  const gold = "#D9B64A";
  const goldHover = "#B9983C";
  const dark = "#231F20";
  const lightBg = "#F9F9F9";

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

      try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzOP0fPTgjMGHm7A7+OZSA4RV6zn77BdFwxJouDvwWwhBzmV0fPT');
        audio.play().catch(() => {});
      } catch { /* ignore */ }

      setTimeout(() => {
        localStorage.removeItem("visitorId");
        localStorage.removeItem("visitorType");
        navigate("/");
      }, 10000);

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

  const today = new Date();
  const displayDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: lightBg }}>
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full text-center border-t-4" style={{ borderColor: gold }}>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate("/forms/select")} 
            className="font-bold hover:underline"
            style={{ color: gold }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!form) return <p className="text-center mt-10">Form not found</p>;

  return (
    <div className="min-h-screen py-12 px-4 font-serif" style={{ backgroundColor: lightBg }}>
      <style>{`
        /* Paper Line Inputs - Updated with GOLD Focus */
        .paper-theme input[type="text"], 
        .paper-theme input[type="email"], 
        .paper-theme input[type="number"], 
        .paper-theme textarea,
        .paper-theme select {
            background-color: transparent !important;
            border-width: 0 0 1px 0 !important;
            border-color: #9ca3af !important;
            border-radius: 0 !important;
            font-family: 'Courier New', Courier, monospace !important;
            padding: 4px 0 !important;
            box-shadow: none !important;
            font-size: 1.1rem !important;
            transition: all 0.3s ease;
        }
        .paper-theme input:focus, .paper-theme textarea:focus {
            border-color: ${gold} !important;
            background-color: rgba(217, 182, 74, 0.05) !important;
            outline: none !important;
        }
        .paper-theme label {
            font-family: 'Segoe UI', sans-serif !important;
            font-weight: 700 !important;
            color: ${dark} !important;
            text-transform: uppercase !important;
            font-size: 0.85rem !important;
        }

        /* Animations remain same */
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .form-entrance { animation: fadeInScale 0.6s ease-out forwards; }
        
        @keyframes scaleIn {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck { to { stroke-dashoffset: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .anim-circle { animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .anim-check { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawCheck 0.6s ease-out forwards 0.5s; }
        .anim-text-1 { opacity: 0; animation: fadeUp 0.6s ease-out forwards 0.8s; }
        .anim-text-2 { opacity: 0; animation: fadeUp 0.6s ease-out forwards 1.0s; }
        .anim-text-3 { opacity: 0; animation: fadeUp 0.6s ease-out forwards 1.2s; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        
        {!success && (
          <button
            onClick={() => navigate("/forms/select")}
            className="mb-6 font-sans font-semibold flex items-center gap-2 transition-colors"
            style={{ color: "#888" }}
            onMouseOver={(e) => e.currentTarget.style.color = gold}
            onMouseOut={(e) => e.currentTarget.style.color = "#888"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Selection
          </button>
        )}

        <div className="bg-white shadow-2xl relative mx-auto max-w-[210mm] min-h-[297mm] p-[25mm] transition-all duration-500 form-entrance">
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
            <img src="/gia-logo2.PNG" alt="Watermark" className="w-[400px] opacity-[0.06]" />
          </div>

          <div className="relative z-10 flex justify-between items-end border-b-2 border-black pb-6 mb-10">
            <div className="flex items-center gap-4">
              <img src="/gia-logo2.PNG" alt="GIA Logo" className="h-16 w-auto object-contain" />
            </div>
            <div className="text-right">
              <h1 className="text-2xl font-bold uppercase tracking-widest m-0" style={{ color: dark }}>
                Feedback Form
              </h1>
              <p className="text-xs font-sans font-bold uppercase mt-1" style={{ color: gold }}>
                GIA Feedback System
              </p>
            </div>
          </div>

          <div className="relative z-10 paper-theme">

            {success ? (
              <div className="flex flex-col items-center justify-center pt-20 text-center">
                
                {/* Gold Success Circle */}
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-8 shadow-xl anim-circle"
                  style={{ backgroundColor: gold }}
                >
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      className="anim-check" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>

                <h2 className="text-4xl font-serif font-bold mb-6 anim-text-1" style={{ color: dark }}>
                  Thank You!
                </h2>
                
                <div className="max-w-lg mx-auto anim-text-2">
                  <p className="text-lg text-gray-600 font-sans leading-relaxed mb-8">
                    Thank you for taking the time to share your feedback. Your comments are valuable and help us improve our services.
                    <br />
                    <span className="font-bold mt-4 block text-xl font-serif" style={{ color: gold }}>– GIA Team</span>
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 px-6 py-3 rounded-full anim-text-3">
                  <p className="text-sm text-gray-500 font-sans flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: gold }}
                    ></span>
                    Logging out and returning to login page...
                  </p>
                </div>

              </div>

            ) : (
              <>
                <div className="flex justify-end mb-10">
                  <div className="w-48">
                    <label className="block text-xs font-bold text-gray-500 uppercase font-sans mb-1">Date</label>
                    <div className="border-b border-gray-400 font-mono text-lg text-gray-800 pb-1">
                      {displayDate}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-800 font-sans text-sm border border-red-200 text-center">
                    {error}
                  </div>
                )}

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

                <div className="mt-10 mb-14 text-center">
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="text-white font-sans text-sm font-bold uppercase tracking-wider py-3 px-10 rounded shadow-md transition-all disabled:opacity-50 hover:shadow-lg"
                    style={{ backgroundColor: gold }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = goldHover}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = gold}
                  >
                    {submitting ? "Submitting..." : "Submit Record"}
                  </button>
                </div>
              </>
            )}

          </div>

          <div className="absolute bottom-[25mm] left-[25mm] right-[25mm] border-t border-gray-300 pt-4 text-center">
            <p className="text-[10px] text-gray-400 font-sans">
              Generated by GIA Feedback System. Internal Use Only. © 2025
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}