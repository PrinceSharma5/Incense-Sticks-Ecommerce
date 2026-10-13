import { useEffect, useRef } from "react";

export default function InfiniteScroll({
  children,
  hasMore,
  loading = false,
  loadMore,
  loader,
}) {
  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(loadMore);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !hasMore ||
      loading ||
      typeof IntersectionObserver === "undefined"
    ) {
      return undefined;
    }

    let requested = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !requested) {
          requested = true;
          loadMoreRef.current();
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      {children}
      {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px" />}
      {loading && hasMore ? loader : null}
    </>
  );
}
