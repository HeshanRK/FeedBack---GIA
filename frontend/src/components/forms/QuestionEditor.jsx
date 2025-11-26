import { useState } from "react";
import OptionInput from "./OptionInput";

export default function QuestionEditor({ question, onChange, onDelete }) {
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
            onClick={addOption}
            className="text-blue-600 mt-2"
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
          onClick={onDelete}
          className="text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
