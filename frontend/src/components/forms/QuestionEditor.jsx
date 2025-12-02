import { useState } from "react";
import OptionInput from "./OptionInput";

export default function QuestionEditor({ 
  question, 
  onChange, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown,
  questionNumber 
}) {
  const [local, setLocal] = useState(question);

  const update = (field, value) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    onChange(updated);
  };

  const addOption = () => {
    const newOptions = [...(local.extra?.options || []), ""];
    update("extra", { ...local.extra, options: newOptions });
  };

  const updateOption = (index, value) => {
    const newOptions = [...local.extra.options];
    newOptions[index] = value;
    update("extra", { ...local.extra, options: newOptions });
  };

  const deleteOption = (index) => {
    const newOptions = local.extra.options.filter((_, i) => i !== index);
    update("extra", { ...local.extra, options: newOptions });
  };

  return (
    <div className="border p-4 rounded bg-gray-50 mb-4 shadow-sm">
      {/* Question Number and Move Buttons */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
            {questionNumber}
          </span>
          <span className="text-gray-600 font-semibold">Question {questionNumber}</span>
        </div>
        
        {/* Move Up/Down Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="p-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
            title="Move Up"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="p-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
            title="Move Down"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Question text"
        value={local.q_text}
        onChange={(e) => update("q_text", e.target.value)}
      />

      <select
        className="border p-2 w-full mb-3"
        value={local.q_type}
        onChange={(e) => update("q_type", e.target.value)}
      >
        <option value="short">Short Text</option>
        <option value="paragraph">Paragraph</option>
        <option value="radio">Multiple Choice</option>
        <option value="checkbox">Checkbox</option>
        <option value="dropdown">Dropdown</option>
        <option value="rating">Rating (1-5)</option>
      </select>

      {(local.q_type === "radio" ||
        local.q_type === "checkbox" ||
        local.q_type === "dropdown") && (
        <>
          <p className="font-semibold mb-2">Options</p>

          {local.extra?.options?.map((opt, index) => (
            <OptionInput
              key={index}
              value={opt}
              onChange={(v) => updateOption(index, v)}
              onDelete={() => deleteOption(index)}
            />
          ))}

          <button
            type="button"
            onClick={addOption}
            className="text-blue-600 mt-2 hover:text-blue-700"
          >
            + Add Option
          </button>
        </>
      )}

      <div className="mt-3 flex justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={local.required}
            onChange={(e) => update("required", e.target.checked)}
          />
          Required
        </label>

        <button
          type="button"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}