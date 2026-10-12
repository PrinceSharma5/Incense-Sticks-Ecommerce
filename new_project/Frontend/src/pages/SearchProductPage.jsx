import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import InfiniteScroll from "react-infinite-scroller";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LIMIT = 100;

const SearchProductPage = () => {
  const [params, setParams] = useSearchParams();

  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const category = params.get("category") || "";
  const search = params.get("search") || "";

  const fetchData = useCallback(async ({ searchValue, skipValue, reset = false }) => {
    try {
      if (reset) {
        setIsFirstLoading(true);
      } else {
        setIsMoreLoading(true);
      }

      const query = {
        skip: skipValue,
      };

      if (category.trim() !== "") {
        query.category = category.trim();
      }

      if (searchValue.trim() !== "") {
        query.search = searchValue.trim();
      }

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/fetch-all-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        }
      );

      const json = await response.json();

      if (!json.success) {
        console.log(json.message);
        setHasMore(false);
        return;
      }

      const products = json.data || [];

      if (reset) {
        setData(products);
      } else {
        setData((prev) => [...prev, ...products]);
      }

      const nextSkip = skipValue + products.length;
      setSkip(nextSkip);

      if (products.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      setIsFirstLoading(false);
      setIsMoreLoading(false);
    }
  }, [category]);

  const resetAndFetch = useCallback((searchValue = search) => {
    setData([]);
    setSkip(0);
    setHasMore(true);

    fetchData({
      searchValue,
      skipValue: 0,
      reset: true,
    });
  }, [fetchData, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const nextParams = new URLSearchParams(params);
    if (value.trim()) nextParams.set("search", value);
    else nextParams.delete("search");
    setParams(nextParams, { replace: true });
  };

  const handleClearSearch = () => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("search");
    setParams(nextParams, { replace: true });
  };

  const handleRemoveCategory = () => {
    const nextParams = new URLSearchParams(params);
    nextParams.delete("category");
    setParams(nextParams);
  };

  useEffect(() => {
    void Promise.resolve().then(() => resetAndFetch(search));
  }, [resetAndFetch, search]);

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-stone-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-7xl" data-voice-section="product results">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="rounded-full bg-rose-100 dark:bg-rose-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                Products
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-rose-800 dark:text-rose-300 sm:text-4xl">
                Search Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                Search products by title, brand, fragrance, category, or
                description.
              </p>
            </div>

            {category && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-50 dark:bg-slate-900 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Selected Category
                  </p>
                  <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                    {category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCategory}
                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700 shadow-sm transition hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Search Box */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search product..."
                maxLength={50}
                className="w-full rounded-2xl border border-rose-100 dark:border-slate-700 bg-rose-50 dark:bg-slate-900 px-5 py-4 pr-12 text-sm font-medium text-slate-800 dark:text-slate-100 outline-none transition focus:border-rose-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-rose-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white dark:bg-slate-900 px-2 py-1 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => resetAndFetch(search)}
              className="rounded-2xl bg-rose-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700"
            >
              Search
            </button>
          </div>
        </div>

        {/* First Loading */}
        {isFirstLoading && data.length === 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-3xl border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="h-52 rounded-t-3xl bg-rose-100 dark:bg-rose-950" />
                <div className="space-y-4 p-4">
                  <div className="h-4 w-24 rounded bg-rose-100 dark:bg-rose-950" />
                  <div className="h-5 w-3/4 rounded bg-rose-100 dark:bg-rose-950" />
                  <div className="h-4 w-full rounded bg-rose-100 dark:bg-rose-950" />
                  <div className="h-4 w-2/3 rounded bg-rose-100 dark:bg-rose-950" />
                  <div className="h-8 w-28 rounded bg-rose-100 dark:bg-rose-950" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {data.length > 0 ? (
              <InfiniteScroll
                pageStart={0}
                loadMore={() => {
                  if (!isMoreLoading && hasMore) {
                    fetchData({
                      searchValue: search,
                      skipValue: skip,
                      reset: false,
                    });
                  }
                }}
                hasMore={hasMore && !isMoreLoading}
                loader={
                  <div key="loader" className="py-8 text-center">
                    <p className="text-sm font-bold text-rose-600 dark:text-rose-300">
                      Loading more products...
                    </p>
                  </div>
                }
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {data.map((product) => {
                    const image =
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "https://placehold.co/500x500?text=No+Image";

                    return (
                      <article
                        key={product._id}
                        className="group overflow-hidden rounded-3xl border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose-200/50"
                      >
                        <div className="relative overflow-hidden bg-rose-50 dark:bg-slate-900">
                          <img
                            src={image}
                            alt={product.title}
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          {product.discount > 0 && (
                            <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow">
                              {product.discount}% OFF
                            </span>
                          )}

                          <span
                            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow ${
                              product.stock > 0
                                ? "bg-rose-100 text-rose-700 dark:text-rose-300"
                                : "bg-red-100 text-red-700 dark:text-red-300"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="line-clamp-1 rounded-full bg-rose-100 dark:bg-rose-950 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300">
                              {product.category}
                            </span>

                            <span className="line-clamp-1 text-xs font-semibold text-slate-400 dark:text-slate-500">
                              {product.brand_name}
                            </span>
                          </div>

                          <h2 className="line-clamp-1 text-base font-extrabold text-slate-900 dark:text-slate-100">
                            {product.title}
                          </h2>

                          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {product.description}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                              Fragrance:
                            </span>

                            <span className="rounded-full bg-orange-100 dark:bg-orange-950 px-3 py-1 text-xs font-bold text-orange-700 dark:text-orange-300">
                              {product.fragnance_type}
                            </span>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                                ₹
                                {Number(product.actual_price).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              {product.mrp > product.actual_price && (
                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 line-through">
                                  ₹
                                  {Number(product.mrp).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              Inclusive of all taxes
                            </p>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-2">
                            <button className="rounded-xl border border-rose-200 dark:border-slate-700 px-3 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 transition hover:bg-rose-50 dark:hover:bg-slate-900">
                              View Details
                            </button>

                            <button
                              disabled={product.stock <= 0}
                              className="rounded-xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:bg-slate-400 disabled:shadow-none"
                            >
                              Add Cart
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </InfiniteScroll>
            ) : (
              <div className="rounded-3xl border border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-20 text-center shadow-sm">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try searching with another keyword or remove category filter.
                </p>
              </div>
            )}

            {!hasMore && data.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
                  No more products available.
                </p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
    <Footer/>
    </>

  );
};

export default SearchProductPage;
