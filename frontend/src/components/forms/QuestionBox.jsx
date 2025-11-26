export default function QuestionBox({ question, answer, setAnswer }) {
  const type = question.q_type;

  return (
    <div className="mb-6">
      <p className="font-semibold mb-2">
        {question.q_text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </p>

      {/* short text */}
      {type === "short" && (
        <input
          className="border p-2 w-full"
          placeholder={question.required ? "Required" : ""}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required={question.required}
        />
      )}

      {/* paragraph */}
      {type === "paragraph" && (
        <textarea
          className="border p-2 w-full"
          rows="3"
          placeholder={question.required ? "Required" : ""}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required={question.required}
        />
      )}

      {/* multiple choice */}
      {type === "radio" &&
        question.extra?.options?.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              name={question.id}
              value={opt}
              checked={answer === opt}
              onChange={(e) => setAnswer(e.target.value)}
              required={question.required}
            />
            {opt}
          </label>
        ))}

      {/* checkbox */}
      {type === "checkbox" &&
        question.extra?.options?.map((opt, idx) => {
          const arr = Array.isArray(answer) ? answer : [];
          return (
            <label key={idx} className="flex items-center gap-2 mb-1">
              <input
                type="checkbox"
                checked={arr.includes(opt)}
                onChange={(e) => {
                  if (e.target.checked) setAnswer([...arr, opt]);
                  else setAnswer(arr.filter((x) => x !== opt));
                }}
              />
              {opt}
            </label>
          );
        })}

      {/* dropdown */}
      {type === "dropdown" && (
        <select
          className="border p-2 w-full"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          required={question.required}
        >
          <option value="">{question.required ? "Select (Required)" : "Select"}</option>
          {question.extra?.options?.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      )}

      {/* rating 1-5 */}
      {type === "rating" && (
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`p-2 rounded ${
                answer >= n ? "bg-yellow-400" : "bg-gray-300"
              }`}
              onClick={() => setAnswer(n)}
            >
              ⭐
            </button>
          ))}
        </div>
      )}
    </div>
  );
}