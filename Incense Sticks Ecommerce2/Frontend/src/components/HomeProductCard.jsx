
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

export default function HomeProductCard({ data = {} }) {
  const add_to_cart = async (product_id) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/cart/add-to-cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: sessionStorage.getItem("userToken"),
      },
      body: JSON.stringify({ product_id, quantity: 1 }),
    });

    const json = await response.json();
    if (json.success) toast.success(json.message);
    else toast.error(json.message);
  };
  const categories = Object.keys(data);

  if (categories.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center bg-rose-50 px-4 dark:bg-slate-900">
        <p className="max-w-xl text-center text-sm font-medium text-slate-600 dark:text-slate-300">
          No products available.
        </p>
      </div>
    );
  }

  return (

    <>
   <Toaster/>
    <div className="bg-stone-50 dark:bg-slate-950">
      {categories.map((categoryName) => {
        const products = data[categoryName] || [];

        if (products.length === 0) return null;

        return (
          <section
            key={categoryName}
            className="border-b border-slate-200 py-12 sm:py-16 dark:border-slate-800 even:bg-white/40 dark:even:bg-slate-900/40 dark:even:bg-slate-900/40"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-sm:px-5">
              {/* Category Heading */}
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-900 dark:bg-rose-950 dark:text-rose-200">
                    Featured Collection
                  </span>

                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                    {categoryName}
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Explore our premium-quality {categoryName.toLowerCase()}{" "}
                    products.
                  </p>
                </div>

                <Link to={`/fetch-products?category=${categoryName}`} className="hidden shrink-0 rounded-full border border-rose-200 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-bold text-rose-800 shadow-sm transition hover:border-rose-700 hover:bg-rose-700 hover:text-white sm:block dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-800">
                  View All
                </Link>
              </div>

              <Swiper
                slidesPerView={1.15}
                spaceBetween={14}
         
            
                breakpoints={{
                  480: {
                    slidesPerView: 1.7,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2.2,
                    spaceBetween: 18,
                 
                  },
                  1024: {
                    slidesPerView: 3.2,
                    spaceBetween: 20,
                  },
                  1280: {
                    slidesPerView: 4,
                    spaceBetween: 22,
                  },
                }}
                modules={[Pagination, Navigation]}
                className="product-swiper !pb-10 sm:!pb-2 [&_.swiper-button-next]:text-rose-700 [&_.swiper-button-prev]:text-rose-700 [&_.swiper-pagination-bullet-active]:bg-rose-500"
              >
                {products.map((product) => {
                  const image =
                    product.images?.[0] ||
                    product.thumbnail ||
                    "https://placehold.co/500x500?text=No+Image";

                  const discount = Number(product.discount || 0);
                  const stock = Number(product.stock || 0);
                  const actualPrice = Number(product.actual_price || 0);
                  const mrp = Number(product.mrp || 0);

                  return (
                    <SwiperSlide key={product._id} className="h-auto">
                      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white dark:bg-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-900/10 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-rose-800">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-rose-50 dark:bg-slate-800">
                          <img
                            src={image}
                            alt={product.title}
                            loading="lazy"
                            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                          />

                          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                            {discount > 0 ? (
                              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                                {discount}% OFF
                              </span>
                            ) : (
                              <span />
                            )}

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md backdrop-blur ${
                                stock > 0
                                  ? "bg-rose-100/95 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                                  : "bg-red-100/95 text-red-700 dark:bg-red-950 dark:text-red-300"
                              }`}
                            >
                              {stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="line-clamp-1 rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-bold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              {product.category || categoryName}
                            </span>

                            {product.brand_name && (
                              <span className="line-clamp-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                {product.brand_name}
                              </span>
                            )}
                          </div>

                          <h3 className="line-clamp-1 text-base font-extrabold text-slate-900 transition group-hover:text-rose-700 dark:text-slate-100 dark:group-hover:text-rose-300">
                            {product.title}
                          </h3>

                          <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500 dark:text-slate-400">
                            {product.short_description ||
                              product.description ||
                              "Premium-quality product made with carefully selected ingredients."}
                          </p>

                          {product.fragnance_type && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                                Fragrance:
                              </span>

                              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-800 dark:bg-orange-950 dark:text-orange-300">
                                {product.fragnance_type}
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="mt-auto pt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                                ₹{actualPrice.toLocaleString("en-IN")}
                              </span>

                              {mrp > actualPrice && (
                                <span className="text-xs font-semibold text-slate-400 line-through dark:text-slate-500">
                                  ₹{mrp.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500">
                              Inclusive of all taxes
                            </p>

                            {/* Actions */}
                            <div className="mt-4 grid grid-cols-[1fr_1.15fr] gap-2">
                              <Link
                                
                                to={`/product-page/${product._id}`}
                                className="rounded-xl border border-rose-200 dark:border-slate-700 px-3 py-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 transition hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-slate-900"
                              >
                                View Details
                              </Link>

                             {stock>0 ?<button
                                type="button"
                                onClick={()=>add_to_cart(product._id)}
                                className="rounded-xl bg-rose-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:bg-slate-400 disabled:shadow-none"
                              >
                                Add to Cart
                              </button>
:
                              
                              <button
                                type="button"
                                disabled={true}
                                className="rounded-xl bg-slate-400 px-3 py-2.5 text-xs font-bold text-white shadow-none"
                              >
                                 "Unavailable"
                              </button>}
                            </div>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>

              <button type="button" className="mt-4 block w-full rounded-full bg-rose-600 px-5 py-3 text-center text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700 sm:hidden">
                View All {categoryName}
              </button>
            </div>
          </section>
        );
      })}

      <style>{`
        .product-swiper .swiper-button-next,
        .product-swiper .swiper-button-prev {
          width: 38px;
          height: 38px;
          border-radius: 9999px;
          background: white;
          color: #e11d48;
          box-shadow: 0 8px 24px rgba(225, 29, 72, 0.18);
        }

        .product-swiper .swiper-button-next::after,
        .product-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 900;
        }

        .product-swiper .swiper-pagination-bullet-active {
          background: #e11d48;
        }
      `}</style>
    </div>
     </>
  );
}
