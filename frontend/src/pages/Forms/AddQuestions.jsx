import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import { addQuestion, deleteQuestion, updateQuestion } from "../../api/questionApi";
import QuestionEditor from "../../components/forms/QuestionEditor";

export default function AddQuestions() {
  const { id } = useParams();
  const [form, setForm] = useState(null);

  const load = async () => {
    const data = await getFormById(id);
    setForm(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const q = {
      q_text: "New question",
      q_type: "short",
      required: false,
      extra: { options: [] },
    };

    await addQuestion(id, q);
    load();
  };

  const save = async (question) => {
    await updateQuestion(question.id, question);
    load();
  };

  const remove = async (qid) => {
    await deleteQuestion(qid);
    load();
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-4 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{form.title} — Edit Questions</h2>

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
        className="bg-blue-600 text-white p-2 px-4 rounded mt-4"
      >
        + Add Question
      </button>
    </div>
  );
}
