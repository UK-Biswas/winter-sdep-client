interface LoadingSkeletonProps {
  count?: number;
}

export default function LoadingSkeleton({
  count = 3,
}: LoadingSkeletonProps) {
  return (
    <div className="loading-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div className="event-card" key={index} aria-hidden="true">
          <div className="loading-image" />

          <div className="event-content">
            <div className="loading-line title" />
            <div className="loading-line" />
            <div className="loading-line short" />
          </div>
        </div>
      ))}
    </div>
  );
}
