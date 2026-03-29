export function TestimonialCard({ item }: { item: { quote: string; name: string; role: string } }) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-base leading-8 text-slate-700">“{item.quote}”</p>
      <div className="mt-5">
        <p className="font-semibold text-brand-navy">{item.name}</p>
        <p className="text-sm text-slate-600">{item.role}</p>
      </div>
    </article>
  );
}
