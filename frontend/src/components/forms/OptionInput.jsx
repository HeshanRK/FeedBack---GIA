export default function OptionInput({ value, onChange, onDelete }) {
  return (
    <div className="flex gap-2 mb-2">
      <input
        className="border p-2 flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button onClick={onDelete} className="text-red-500">
        ✕
      </button>
    </div>
  );
}
