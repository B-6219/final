export default function PagePlaceholder({ title, note }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-20">
      <p className="spec-strip text-racing-red text-xs uppercase tracking-[0.3em] mb-3">Coming in a later phase</p>
      <h1 className="font-display text-bone text-4xl lg:text-5xl uppercase mb-3">{title}</h1>
      {note && <p className="text-silver max-w-md text-sm">{note}</p>}
    </div>
  )
}
