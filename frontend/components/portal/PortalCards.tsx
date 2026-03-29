import type { ChangeEvent, ReactNode } from 'react';

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-brand-navy">{value}</p>
    </div>
  );
}

export function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-brand-navy">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-7 text-slate-600">{description}</p> : null}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  placeholder,
  textarea = false,
  defaultValue,
  value,
  onChange,
  disabled = false,
  type = 'text'
}: {
  label: string;
  placeholder?: string;
  textarea?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500"
        />
      ) : (
        <input
          type={type}
          value={value}
          defaultValue={value === undefined ? defaultValue : undefined}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500"
        />
      )}
    </label>
  );
}
