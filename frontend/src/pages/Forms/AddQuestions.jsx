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
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFormById(id);
      setForm(data);
      setQuestions(data.questions || []);
      setHasChanges(false);
    } catch (err) {
      console.error("Error loading form:", err);
      setError(err.response?.data?.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

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

  // Update question locally (not saving to backend yet)
  const updateQuestionLocally = (updatedQuestion) => {
    setQuestions(prev => 
      prev.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
    );
    setHasChanges(true);
  };

  // Move question up
  const moveUp = (index) => {
    if (index === 0) return;
    const newQuestions = [...questions];
    [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
    
    // Update order_index
    newQuestions.forEach((q, idx) => {
      q.order_index = idx;
    });
    
    setQuestions(newQuestions);
    setHasChanges(true);
  };

  // Move question down
  const moveDown = (index) => {
    if (index === questions.length - 1) return;
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[index + 1]] = [newQuestions[index + 1], newQuestions[index]];
    
    // Update order_index
    newQuestions.forEach((q, idx) => {
      q.order_index = idx;
    });
    
    setQuestions(newQuestions);
    setHasChanges(true);
  };

  // Save all changes
  const saveAll = async () => {
    try {
      setSaving(true);
      setError("");
      
      // Save all questions with updated data
      for (const question of questions) {
        await updateQuestion(question.id, question);
      }
      
      setHasChanges(false);
      alert("All changes saved successfully!");
      await load(); // Reload to get fresh data
    } catch (err) {
      console.error("Error saving questions:", err);
      setError(err.response?.data?.message || "Failed to save questions");
    } finally {
      setSaving(false);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{form.title} — Edit Questions</h2>
          
          {/* Save Button */}
          {hasChanges && (
            <button
              onClick={saveAll}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {hasChanges && (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            You have unsaved changes. Click "Save All Changes" to save.
          </div>
        )}

        {questions.length === 0 && (
          <p className="text-gray-500 text-center my-8">
            No questions yet. Click "Add Question" to get started.
          </p>
        )}

        {questions.map((q, index) => (
          <QuestionEditor
            key={q.id}
            question={q}
            onChange={updateQuestionLocally}
            onDelete={() => remove(q.id)}
            onMoveUp={() => moveUp(index)}
            onMoveDown={() => moveDown(index)}
            canMoveUp={index > 0}
            canMoveDown={index < questions.length - 1}
            questionNumber={index + 1}
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
