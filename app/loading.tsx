import LoadingSkeleton from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <main className="page-main" aria-busy="true" aria-live="polite">
      <span className="visually-hidden">Loading community events…</span>

      <div className="page-title-row">
        <div className="loading-stack" aria-hidden="true">
          <div className="loading-line short" />
          <div className="loading-line title" />
          <div className="loading-line" />
        </div>
      </div>

      <LoadingSkeleton count={6} />
    </main>
  );
}
