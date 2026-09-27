import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router";
import toast, { Toaster } from "react-hot-toast";

export default function HomeProductCard({ data = {} }) {


  const add_to_cart=async(product_id)=>{

    
    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/cart/add-to-cart`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "token":sessionStorage.getItem("userToken")
      },body:JSON.stringify({
        product_id:product_id,
        quantity:1
      })
    })


    const json=await response.json()
  
    
    if(json.success){
      toast.success(json.message)
    }
    else{
      toast.error(json.message)
    }

  }
  const categories = Object.keys(data);

  if (categories.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center bg-orange-50 px-4">
        <p className="text-sm font-medium text-gray-500">
          No products available.
        </p>
      </div>
    );
  }

  return (

    <>
   <Toaster/>
    <div className="bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {categories.map((categoryName) => {
        const products = data[categoryName] || [];

        if (products.length === 0) return null;

        return (
          <section
            key={categoryName}
            className="border-b border-orange-100 py-10 sm:py-12"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {/* Category Heading */}
              <div className="mb-7 flex items-end justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700">
                    Featured Collection
                  </span>

                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                    {categoryName}
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600">
                    Explore our premium-quality {categoryName.toLowerCase()}{" "}
                    products.
                  </p>
                </div>

                <Link to={`/fetch-products?category=${categoryName}`} className="hidden shrink-0 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-sm font-bold text-orange-700 shadow-sm transition hover:border-orange-600 hover:bg-orange-600 hover:text-white sm:block">
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
                className="product-swiper !pb-10 sm:!pb-2"
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
                      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-200/40">
                        {/* Product Image */}
                        <div className="relative overflow-hidden bg-orange-50">
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
                                  ? "bg-green-100/95 text-green-700"
                                  : "bg-red-100/95 text-red-700"
                              }`}
                            >
                              {stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="line-clamp-1 rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                              {product.category || categoryName}
                            </span>

                            {product.brand_name && (
                              <span className="line-clamp-1 text-[11px] font-semibold text-gray-400">
                                {product.brand_name}
                              </span>
                            )}
                          </div>

                          <h3 className="line-clamp-1 text-base font-extrabold text-gray-900 transition group-hover:text-orange-600">
                            {product.title}
                          </h3>

                          <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500">
                            {product.short_description ||
                              product.description ||
                              "Premium-quality product made with carefully selected ingredients."}
                          </p>

                          {product.fragnance_type && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-gray-400">
                                Fragrance:
                              </span>

                              <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700">
                                {product.fragnance_type}
                              </span>
                            </div>
                          )}

                          {/* Price */}
                          <div className="mt-auto pt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-black text-gray-900">
                                ₹{actualPrice.toLocaleString("en-IN")}
                              </span>

                              {mrp > actualPrice && (
                                <span className="text-xs font-semibold text-gray-400 line-through">
                                  ₹{mrp.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-[10px] font-medium text-gray-400">
                              Inclusive of all taxes
                            </p>

                            {/* Actions */}
                            <div className="mt-4 grid grid-cols-[1fr_1.15fr] gap-2">
                              <Link
                                
                                to={`/product-page/${product._id}`}
                                className="rounded-xl border border-orange-200 px-3 py-2.5 text-xs font-bold text-orange-700 transition hover:border-orange-600 hover:bg-orange-50"
                              >
                                View Details
                              </Link>

                             {stock>0 ?<button
                                type="button"
                            
                                onClick={()=>add_to_cart(product._id)}
                                className="rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
                              >
                                Add to Cart
                              </button>
:
                              
                              <button
                                type="button"
                                disabled={true}
                                className="rounded-xl bg-orange-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none"
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

              <button className="mt-4 w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 sm:hidden">
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
          color: #ea580c;
          box-shadow: 0 8px 24px rgba(234, 88, 12, 0.18);
        }

        .product-swiper .swiper-button-next::after,
        .product-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 900;
        }

        .product-swiper .swiper-pagination-bullet-active {
          background: #ea580c;
        }
      `}</style>
    </div>
     </>
  );
}