export default function QuestionBox({ question, answer, setAnswer }) {
  const type = question.q_type;
  const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;

  // For questions with sub-questions, answer should be an object like:
  // { subQ_id_1: value1, subQ_id_2: value2, ... }
  const subAnswers = hasSubQuestions && typeof answer === 'object' && !Array.isArray(answer) ? answer : {};

  const setSubAnswer = (subQuestionId, value) => {
    setAnswer({
      ...subAnswers,
      [subQuestionId]: value
    });
  };

  // SVG Star Icon Component
  const StarIcon = ({ filled }) => (
    <svg 
      className="w-5 h-5" 
      fill={filled ? "currentColor" : "none"} 
      stroke="currentColor" 
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
      />
    </svg>
  );

  // Helper to render star rating
  const renderStarRating = (currentValue, onSelect) => (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`p-2 rounded ${
            currentValue >= n 
              ? "bg-yellow-400 text-yellow-600" 
              : "bg-gray-300 text-gray-400"
          }`}
          onClick={() => onSelect(n)}
        >
          <StarIcon filled={currentValue >= n} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="mb-6">
      <p className="font-semibold mb-2">
        {question.q_text}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </p>

      {/* If question has sub-questions, display them */}
      {hasSubQuestions ? (
        <div className="ml-4 space-y-4 border-l-2 border-gray-300 pl-4">
          {question.subQuestions.map((subQ) => (
            <div key={subQ.id} className="p-3 rounded">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {subQ.sub_question_label}
                {subQ.required && <span className="text-red-500 ml-1">*</span>}
              </p>

              {/* Sub-question input based on type */}
              {subQ.q_type === "short" && (
                <input
                  className="border p-2 w-full text-sm"
                  placeholder={subQ.required ? "Required" : ""}
                  value={subAnswers[subQ.id] || ""}
                  onChange={(e) => setSubAnswer(subQ.id, e.target.value)}
                  required={subQ.required}
                />
              )}

              {subQ.q_type === "paragraph" && (
                <textarea
                  className="border p-2 w-full text-sm"
                  rows="2"
                  placeholder={subQ.required ? "Required" : ""}
                  value={subAnswers[subQ.id] || ""}
                  onChange={(e) => setSubAnswer(subQ.id, e.target.value)}
                  required={subQ.required}
                />
              )}

              {subQ.q_type === "rating" && renderStarRating(
                subAnswers[subQ.id] || 0,
                (value) => setSubAnswer(subQ.id, value)
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Regular question without sub-questions */
        <>
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
          {type === "rating" && renderStarRating(answer || 0, setAnswer)}
        </>
      )}
    </div>
  );
}