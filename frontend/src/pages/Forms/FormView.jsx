import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import { submitResponse } from "../../api/responseApi";
import QuestionBox from "../../components/forms/QuestionBox";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function FormView() {
  const { id } = useParams();
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
            value: q.q_type === "checkbox" ? [] : ""
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
        const answer = answers.find(a => a.question_id === question.id);
        if (!answer || !answer.value || 
            (Array.isArray(answer.value) && answer.value.length === 0) ||
            (typeof answer.value === 'string' && answer.value.trim() === '')) {
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
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error submitting response:", err);
      setError(err.response?.data?.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error && !form) {
    return (
      <div className="max-w-2xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!form) return <p className="text-center mt-10">Form not found</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{form.title}</h2>
      {form.description && (
        <p className="text-gray-600 mb-6">{form.description}</p>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Feedback submitted successfully! Page will refresh...
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {form.questions.map((q) => (
        <QuestionBox
          key={q.id}
          question={q}
          answer={answers.find((a) => a.question_id === q.id)?.value}
          setAnswer={(val) => changeAnswer(q.id, val)}
        />
      ))}

      <button
        onClick={submit}
        className="bg-blue-600 text-white p-2 w-full rounded hover:bg-blue-700 disabled:bg-blue-300"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}