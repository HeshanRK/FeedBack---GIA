import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import { addQuestion, deleteQuestion, updateQuestion } from "../../api/questionApi";
import QuestionEditor from "../../components/forms/QuestionEditor";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function AddQuestions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFormById(id);
      setForm(data);
    } catch (err) {
      console.error("Error loading form:", err);
      setError(err.response?.data?.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const add = async () => {
    try {
      setSaving(true);
      setError("");
      const q = {
        q_text: "New question",
        q_type: "short",
        required: false,
        extra: { options: [] },
      };

      await addQuestion(id, q);
      await load();
    } catch (err) {
      console.error("Error adding question:", err);
      setError(err.response?.data?.message || "Failed to add question");
    } finally {
      setSaving(false);
    }
  };

  const save = async (question) => {
    try {
      setError("");
      await updateQuestion(question.id, question);
      await load();
    } catch (err) {
      console.error("Error updating question:", err);
      setError(err.response?.data?.message || "Failed to save question");
    }
  };

  const remove = async (qid) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    try {
      setError("");
      await deleteQuestion(qid);
      await load();
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.response?.data?.message || "Failed to delete question");
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error && !form) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
        {error}
      </div>
    );
  }

  if (!form) return <p className="text-center mt-10">Form not found</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 pb-8">
      <button 
        onClick={() => navigate("/forms")} 
        className="mb-4 text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Forms
      </button>

      <div className="bg-white p-6 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4">{form.title} — Edit Questions</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {form.questions.length === 0 && (
          <p className="text-gray-500 text-center my-8">
            No questions yet. Click "Add Question" to get started.
          </p>
        )}

        {form.questions.map((q) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={save}
            onDelete={() => remove(q.id)}
          />
        ))}

        <button
          onClick={add}
          className="bg-indigo-600 text-white p-2 px-4 rounded mt-4 hover:bg-indigo-700 disabled:bg-indigo-300"
          disabled={saving}
        >
          {saving ? "Adding..." : "+ Add Question"}
        </button>
      </div>
    </div>
  );
}