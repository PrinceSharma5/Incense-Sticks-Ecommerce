import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const fetchSpecificProduct = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/fetch-specific-product`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _id: id,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Product not found");
        navigate("/search-product");
        return;
      }

      setProduct(json.data);

      if (json.data.images && json.data.images.length > 0) {
        setSelectedImage(json.data.images[0]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = () => {
    if (!product) return;

    if (quantity >= product.stock) {
      toast.error(`Only ${product.stock} item available in stock`);
      return;
    }

    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) return;

    setQuantity((prev) => prev - 1);
  };

  const handleAddCart =async () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }


    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/cart/add-to-cart`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "token":sessionStorage.getItem("userToken")
        },body:JSON.stringify({
            product_id:product._id,
            quantity:quantity
        })
    })

    const json=await response.json()

    if(!json.success){
        toast.error(json.message)
        return
    }

    

    const cartData = {
      product_id: product._id,
      product_title: product.title,
      product_price: product.actual_price,
      product_mrp: product.mrp,
      product_discount: product.discount,
      product_image: product.images?.[0] || "",
      quantity,
    };

    console.log(cartData);

    toast.success(`${quantity} item added to cart`);
  };

  const handleBuyNow = () => {
    if (!product) return;

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    const buyNowData = {
      product_id: product._id,
      product_title: product.title,
      product_price: product.actual_price,
      product_mrp: product.mrp,
      product_discount: product.discount,
      product_image: product.images?.[0] || "",
      quantity,
    };

    console.log(buyNowData);

    toast.success("Redirecting to checkout...");
  };

  useEffect(() => {
    if (id) {
      fetchSpecificProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-[420px] animate-pulse rounded-[2rem] bg-rose-100 sm:h-[500px]" />

            <div className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="h-5 w-36 animate-pulse rounded-full bg-rose-100" />
              <div className="h-10 w-4/5 animate-pulse rounded bg-rose-100" />
              <div className="h-4 w-full animate-pulse rounded bg-rose-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-rose-100" />
              <div className="h-20 w-full animate-pulse rounded-2xl bg-rose-100" />
              <div className="h-14 w-full animate-pulse rounded-2xl bg-rose-100" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
        <div className="rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-xl shadow-rose-100">
          <h1 className="text-xl font-black text-slate-900">
            Product not found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            This product may have been removed or is unavailable.
          </p>

          <button
            onClick={() => navigate("/search-product")}
            className="mt-6 rounded-2xl bg-rose-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const mrp = Number(product.mrp || 0);
  const actualPrice = Number(product.actual_price || 0);
  const discount = Number(product.discount || 0);
  const stock = Number(product.stock || 0);

  const totalAmount = actualPrice * quantity;
  const totalMrp = mrp * quantity;
  const saveAmount = totalMrp - totalAmount;

  return (

    <>
    <Navbar/>
    <Toaster/>
    <main className="min-h-screen bg-stone-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-2.5 text-xs font-bold text-rose-700 shadow-sm transition hover:bg-rose-50"
          >
            <span>ÃƒÂ¢Ã¢â‚¬Â Ã‚Â</span>
            Back
          </button>

          <span className="hidden rounded-full bg-white px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-rose-600 shadow-sm sm:inline-flex">
            Product Details
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* Image Gallery */}
          <div className="rounded-[2rem] border border-rose-100 bg-white/90 p-4 shadow-2xl shadow-rose-100/70 backdrop-blur">
            <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-rose-100 to-orange-100">
              <img
                src={
                  selectedImage ||
                  "https://placehold.co/800x800?text=No+Image"
                }
                alt={product.title}
                className="h-[330px] w-full object-cover transition duration-500 hover:scale-105 sm:h-[480px]"
              />

              {discount > 0 && (
                <div className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1.5 text-[11px] font-black text-white shadow-lg">
                  {discount}% OFF
                </div>
              )}

              <div
                className={`absolute right-4 top-4 rounded-full px-3 py-1.5 text-[11px] font-black shadow-lg ${
                  stock > 0
                    ? "bg-rose-100 text-rose-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stock > 0 ? "In Stock" : "Out of Stock"}
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`overflow-hidden rounded-2xl border-2 bg-rose-50 p-1 transition ${
                      selectedImage === image
                        ? "border-rose-600 ring-4 ring-rose-100"
                        : "border-transparent hover:border-rose-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="h-16 w-full rounded-xl object-cover sm:h-20"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="rounded-[2rem] border border-rose-100 bg-white/95 p-5 shadow-2xl shadow-rose-100/70 backdrop-blur sm:p-7">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-rose-100 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-rose-700">
                {product.category}
              </span>

              <span className="rounded-full bg-orange-100 px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-orange-700">
                {product.brand_name}
              </span>

              {discount > 0 && (
                <span className="rounded-full bg-red-500 px-3.5 py-1.5 text-[11px] font-black text-white">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-5 text-2xl font-black leading-tight text-slate-950 sm:text-3xl lg:text-4xl">
              {product.title}
            </h1>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              {product.description}
            </p>

            {/* Price */}
            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-rose-100 bg-gradient-to-br from-rose-50 to-orange-50 p-5">
              <p className="text-[11px] font-black uppercase tracking-wider text-rose-600">
                Price
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-3">
                <span className="text-3xl font-black text-slate-950">
                  ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹{actualPrice.toLocaleString("en-IN")}
                </span>

                {mrp > actualPrice && (
                  <span className="pb-1 text-base font-bold text-slate-400 line-through">
                    ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹{mrp.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {saveAmount > 0 && (
                <p className="mt-2 text-xs font-bold text-rose-700">
                  You save ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹{saveAmount.toLocaleString("en-IN")} on selected
                  quantity
                </p>
              )}

              <p className="mt-1 text-[11px] font-medium text-slate-500">
                Inclusive of all taxes
              </p>
            </div>

            {/* Quantity */}
            <div className="mt-5 rounded-[1.5rem] border border-rose-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-slate-900">Quantity</p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {stock > 0
                      ? `${stock} units available`
                      : "Currently unavailable"}
                  </p>
                </div>

                <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-rose-200 bg-rose-50">
                  <button
                    type="button"
                    onClick={handleDecreaseQuantity}
                    disabled={quantity <= 1}
                    className="h-11 w-11 text-lg font-black text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ÃƒÂ¢Ã‹â€ Ã¢â‚¬â„¢
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={stock}
                    value={quantity}
                    onChange={(e) => {
                      const value = Number(e.target.value);

                      if (!value || value < 1) {
                        setQuantity(1);
                        return;
                      }

                      if (value > stock) {
                        toast.error(`Only ${stock} item available in stock`);
                        setQuantity(stock);
                        return;
                      }

                      setQuantity(value);
                    }}
                    className="h-11 w-16 border-x border-rose-200 bg-white text-center text-sm font-black text-slate-900 outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleIncreaseQuantity}
                    disabled={quantity >= stock || stock <= 0}
                    className="h-11 w-11 text-lg font-black text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/20">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Total Amount
                  </p>

                  <p className="mt-1 text-2xl font-black">
                    ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹{totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-3 text-right">
                  <p className="text-[11px] font-bold text-slate-300">Items</p>
                  <p className="text-lg font-black">{quantity}</p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <InfoCard label="Fragrance" value={product.fragnance_type} />
              <InfoCard label="Burning Time" value={product.burning_time} />
              <InfoCard label="Weight" value={product.weight} />
              <InfoCard label="Material" value={product.material} />
            </div>

            {/* Buttons */}
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {stock > 0 ?<button
                type="button"
                onClick={handleAddCart}
                
                className="rounded-2xl bg-rose-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                Add to Cart
              </button>
:
                 <button
                type="button"
                
                disabled={true}
                className="rounded-2xl bg-rose-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-rose-600/25 transition hover:-translate-y-0.5 hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                Out of Stock
              </button>}

              <Link
                to={"/cart"}
                className="rounded-2xl bg-slate-950 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                Buy Now
              </Link>
            </div>

            {/* Trust Points */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <MiniTrustCard title="Secure" text="Safe checkout" />
              <MiniTrustCard title="Fresh" text="Quality checked" />
              <MiniTrustCard title="Support" text="Easy help" />
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer/>
    </>
  );
};

const InfoCard = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
      <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-black text-slate-900">{value || "N/A"}</p>
    </div>
  );
};

const MiniTrustCard = ({ title, text }) => {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-center">
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{text}</p>
    </div>
  );
};

export default ProductDetailsPage;