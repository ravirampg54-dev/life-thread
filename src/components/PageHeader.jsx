/**
 * Shared page header with a consistent title, description, and spacing rhythm
 * across every section view.
 *
 * @param {{ title: string, description?: string, actions?: React.ReactNode }} props
 * @returns {JSX.Element}
 */
export default function PageHeader({ title, description = "", actions }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-3xl text-ink">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-ink/60">{description}</p>}
      </div>
      {actions}
    </header>
  );
}