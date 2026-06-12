interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: { message?: string };
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-content-secondary mb-2"
      >
        {label}
      </label>
      {children}
      {error && <p role="alert" className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
}
