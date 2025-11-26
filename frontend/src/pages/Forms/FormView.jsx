import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFormById } from "../../api/formApi";
import { submitResponse } from "../../api/responseApi";
import QuestionBox from "../../components/forms/QuestionBox";

export default function FormView() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);

  const visitorId = localStorage.getItem("visitorId");

  useEffect(() => {
    getFormById(id).then((data) => {
      setForm(data);
      setAnswers(
        data.questions.map((q) => ({
          question_id: q.id,
          value: q.q_type === "checkbox" ? [] : ""
        }))
      );
    });
  }, []);

  const changeAnswer = (qid, value) => {
    setAnswers((prev) =>
      prev.map((a) => (a.question_id === qid ? { ...a, value } : a))
    );
  };

  const submit = async () => {
    await submitResponse(id, { visitorId, answers });
    alert("Feedback submitted!");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{form.title}</h2>

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
        className="bg-blue-600 text-white p-2 w-full rounded"
      >
        Submit
      </button>
    </div>
  );
}
