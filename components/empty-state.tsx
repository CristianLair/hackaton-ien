import Link from "next/link";

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
          <path
            d="M3 8h13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"
            stroke="currentColor"
            className="text-teal-600"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M16 11h3.5a1.5 1.5 0 0 1 1.5 1.5V19a1 1 0 0 1-1 1h-3"
            stroke="currentColor"
            className="text-teal-600"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 11.5h4v4h-4z"
            fill="currentColor"
            className="text-teal-600"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-500">{description}</p>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}