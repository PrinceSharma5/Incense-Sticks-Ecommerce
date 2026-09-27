import React, { useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [isFirstLoading, setIsFirstLoading] = useState(false);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const category = params.get("category") || "";

  const fetchData = async ({
    searchValue = search,
    skipValue = skip,
    reset = false,
  } = {}) => {
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
  };

  const resetAndFetch = (searchValue = search) => {
    setData([]);
    setSkip(0);
    setHasMore(true);

    fetchData({
      searchValue,
      skipValue: 0,
      reset: true,
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    resetAndFetch(value);
  };

  const handleClearSearch = () => {
    setSearch("");
    resetAndFetch("");
  };

  const handleRemoveCategory = () => {
    params.delete("category");
    setParams(params);
  };

  useEffect(() => {
    resetAndFetch(search);
  }, [category]);

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl border border-orange-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700">
                Products
              </span>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Search Products
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Search products by title, brand, fragrance, category, or
                description.
              </p>
            </div>

            {category && (
              <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500">
                    Selected Category
                  </p>
                  <p className="text-sm font-bold text-orange-700">
                    {category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveCategory}
                  className="rounded-full bg-white px-3 py-1 text-xs font-bold text-red-500 shadow-sm hover:bg-red-50"
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
                className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-5 py-4 pr-12 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white px-2 py-1 text-xs font-bold text-gray-500 shadow-sm hover:text-red-500"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => resetAndFetch(search)}
              className="rounded-2xl bg-orange-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700"
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
                className="h-[430px] animate-pulse rounded-3xl border border-orange-100 bg-white shadow-sm"
              >
                <div className="h-52 rounded-t-3xl bg-orange-100" />
                <div className="space-y-4 p-4">
                  <div className="h-4 w-24 rounded bg-orange-100" />
                  <div className="h-5 w-3/4 rounded bg-orange-100" />
                  <div className="h-4 w-full rounded bg-orange-100" />
                  <div className="h-4 w-2/3 rounded bg-orange-100" />
                  <div className="h-8 w-28 rounded bg-orange-100" />
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
                    <p className="text-sm font-bold text-orange-600">
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
                        className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-orange-200/50"
                      >
                        <div className="relative overflow-hidden bg-orange-50">
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
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>

                        <div className="p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="line-clamp-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              {product.category}
                            </span>

                            <span className="line-clamp-1 text-xs font-semibold text-gray-400">
                              {product.brand_name}
                            </span>
                          </div>

                          <h2 className="line-clamp-1 text-base font-extrabold text-gray-900">
                            {product.title}
                          </h2>

                          <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500">
                            {product.description}
                          </p>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-400">
                              Fragrance:
                            </span>

                            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                              {product.fragnance_type}
                            </span>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-gray-900">
                                ₹
                                {Number(product.actual_price).toLocaleString(
                                  "en-IN"
                                )}
                              </span>

                              {product.mrp > product.actual_price && (
                                <span className="text-xs font-semibold text-gray-400 line-through">
                                  ₹
                                  {Number(product.mrp).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-[11px] font-medium text-gray-400">
                              Inclusive of all taxes
                            </p>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-2">
                            <button className="rounded-xl border border-orange-200 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:bg-orange-50">
                              View Details
                            </button>

                            <button
                              disabled={product.stock <= 0}
                              className="rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
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
              <div className="rounded-3xl border border-orange-100 bg-white px-6 py-20 text-center shadow-sm">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching with another keyword or remove category filter.
                </p>
              </div>
            )}

            {!hasMore && data.length > 0 && (
              <div className="py-8 text-center">
                <p className="text-sm font-semibold text-gray-400">
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