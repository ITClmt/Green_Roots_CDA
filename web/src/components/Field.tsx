interface FieldProps {
  label: string;
  error?: { message?: string };
  children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-content-secondary mb-2">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
