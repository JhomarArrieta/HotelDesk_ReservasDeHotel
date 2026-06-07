interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  readonly label: string;
  readonly options: { value: string; label: string }[];
}

export default function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-300 font-medium">{label}</label>
      <select
        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
