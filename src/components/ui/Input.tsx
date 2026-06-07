interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readonly label: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-300 font-medium">{label}</label>
      <input
        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
        {...props}
      />
    </div>
  );
}
