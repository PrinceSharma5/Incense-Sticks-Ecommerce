import React, { useEffect, useRef, useState } from "react";
import DashboardNavbar from "../../components/dashboard/Header";
import { useNavigate } from "react-router";
import InfiniteScroll from "react-infinite-scroller";
import ProductCard from "../../components/dashboard/Product_card";
import toast, { Toaster } from "react-hot-toast";

const LIMIT = 100;

const FetchProduct = () => {
  const navigate = useNavigate();

  const [skip, setSkip] = useState(0);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [openModal, setopenModal] = useState(false);
  const [value, setValue] = useState("");

  const searchTimer = useRef(null);

  const [selectdProduct, setselectdProduct] = useState({
    _id: "",
    title: "",
    brand_name: "",
    category: "",
    fragnance_type: "",
    mrp: "",
    discount: "",
    actual_price: "",
    stock: "",
    description: "",
    burning_time: "",
    weight: "",
    material: "",
    images: [],
  });

  const handleChange = (e) => {
    setselectdProduct({
      ...selectdProduct,
      [e.target.name]: e.target.value,
    });
  };

  const resetSelectedProduct = () => {
    setselectdProduct({
      _id: "",
      title: "",
      brand_name: "",
      category: "",
      fragnance_type: "",
      mrp: "",
      discount: "",
      actual_price: "",
      stock: "",
      description: "",
      burning_time: "",
      weight: "",
      material: "",
      images: [],
    });
  };

  const resetAndFetch = (searchText = "") => {
    setSkip(0);
    setData([]);
    setHasMore(true);
    fetchData(searchText, 0, true);
  };

  const fetchData = async (
    searchValue = value,
    skipValue = skip,
    isReset = false
  ) => {
    if (loading) return;
    if (!hasMore && !isReset) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/fetch-all-products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            search: searchValue,
            skip: skipValue,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        if (skipValue === 0) {
          setData(json.data);
        } else {
          setData((prev) => [...prev, ...json.data]);
        }

        const newSkip = skipValue + LIMIT;
        setSkip(newSkip);

        if (newSkip >= json.total || json.data.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      setHasMore(false);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setValue(searchValue);

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    searchTimer.current = setTimeout(() => {
      resetAndFetch(searchValue);
    }, 400);
  };

  const clearSearch = () => {
    setValue("");

    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    resetAndFetch("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/update-my-product-details`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            _id: selectdProduct._id,
            title: selectdProduct.title,
            brand_name: selectdProduct.brand_name,
            category: selectdProduct.category,
            fragnance_type: selectdProduct.fragnance_type,
            mrp: selectdProduct.mrp,
            discount: selectdProduct.discount,
            actual_price: selectdProduct.actual_price,
            stock: selectdProduct.stock,
            description: selectdProduct.description,
            burning_time: selectdProduct.burning_time,
            weight: selectdProduct.weight,
            material: selectdProduct.material,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        setopenModal(false);
        resetSelectedProduct();
        resetAndFetch(value);
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleImageChange = async (e, index) => {
    if (!e.target.files[0]) return;

    try {
      const formdata = new FormData();
      formdata.append("my-file", e.target.files[0]);
      formdata.append("_id", selectdProduct._id);
      formdata.append("index", index);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/update-my-product-images`,
        {
          method: "PUT",
          headers: {
            token: sessionStorage.getItem("adminToken"),
          },
          body: formdata,
        }
      );

      const json = await response.json();

      if (json.success) {
        setopenModal(false);
        resetSelectedProduct();
        resetAndFetch(value);
        toast.success(json.message);
      } else {
        toast.error(json.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
      return;
    }

    fetchData("", 0, true);
  }, [navigate]);

  return (
    <>
      <Toaster position="top-right" />
      <DashboardNavbar />

      {/* Update Modal */}
      {openModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/40">
            {/* Modal Header */}
            <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-5 sm:px-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                    Product Editor
                  </span>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    Update Product
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Edit product details, price, stock, description and product
                    images from one clean editor.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setopenModal(false)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl font-bold text-white transition hover:bg-white hover:text-slate-950"
                >
                  ×
                </button>
              </div>
            </div>

            <form
              onSubmit={handleUpdate}
              className="max-h-[calc(92vh-135px)] overflow-y-auto bg-slate-50 p-5 sm:p-8"
            >
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
                {/* Product Title */}
                <div className="lg:col-span-12">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Product Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    onChange={handleChange}
                    value={selectdProduct.title}
                    placeholder="Enter product title"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-6">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brand_name"
                    onChange={handleChange}
                    value={selectdProduct.brand_name}
                    placeholder="Enter brand name"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-6">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    onChange={handleChange}
                    value={selectdProduct.category}
                    placeholder="Enter category"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-6">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Fragrance Type
                  </label>
                  <input
                    type="text"
                    name="fragnance_type"
                    value={selectdProduct.fragnance_type}
                    onChange={handleChange}
                    placeholder="Enter fragrance type"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-6">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    onChange={handleChange}
                    value={selectdProduct.stock}
                    placeholder="Enter stock"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    MRP
                  </label>
                  <input
                    type="number"
                    name="mrp"
                    onChange={handleChange}
                    value={selectdProduct.mrp}
                    placeholder="Enter MRP"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Discount %
                  </label>
                  <input
                    type="number"
                    name="discount"
                    onChange={handleChange}
                    value={selectdProduct.discount}
                    placeholder="Enter discount"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Actual Price
                  </label>
                  <input
                    type="number"
                    name="actual_price"
                    onChange={handleChange}
                    value={selectdProduct.actual_price}
                    placeholder="Enter actual price"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-12">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    onChange={handleChange}
                    value={selectdProduct.description}
                    placeholder="Enter product description"
                    rows="4"
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  ></textarea>
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Burning Time
                  </label>
                  <input
                    type="text"
                    name="burning_time"
                    onChange={handleChange}
                    value={selectdProduct.burning_time}
                    placeholder="Example: 30 hours"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Weight
                  </label>
                  <input
                    type="text"
                    name="weight"
                    onChange={handleChange}
                    value={selectdProduct.weight}
                    placeholder="Example: 250g"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-4">
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    onChange={handleChange}
                    value={selectdProduct.material}
                    placeholder="Example: Soy wax"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="lg:col-span-12">
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <label className="block text-sm font-bold text-slate-700">
                        Product Images
                      </label>
                      <p className="mt-1 text-xs text-slate-500">
                        Click edit icon on image to replace it.
                      </p>
                    </div>

                    <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700">
                      {selectdProduct.images?.length || 0} Images
                    </span>
                  </div>

                  {selectdProduct.images?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                      {selectdProduct.images.map((img, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                        >
                          <input
                            type="file"
                            name={`image-${index}`}
                            id={`image-${index}`}
                            className="hidden"
                            onChange={(e) => handleImageChange(e, index)}
                            accept="image/*"
                          />

                          <img
                            src={img}
                            alt={`Product ${index + 1}`}
                            className="h-40 w-full object-cover transition duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/45"></div>

                          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow">
                            #{index + 1}
                          </div>

                          <label
                            htmlFor={`image-${index}`}
                            className="absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-emerald-600 hover:text-white"
                          >
                            ✎
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
                        🖼️
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        No images available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setopenModal(false)}
                  className="h-12 rounded-2xl border border-slate-300 bg-white px-6 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 text-sm font-black text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-[-180px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Hero Header */}
          <div className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="relative">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/70" />
                    Product Dashboard
                  </div>

                  <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Manage Products
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                    Search, edit, update product images, manage pricing and
                    control inventory from one premium admin dashboard.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Loaded Products
                    </p>
                    <p className="mt-3 text-4xl font-black text-white">
                      {data.length}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>
                    <p className="mt-3 text-lg font-black text-emerald-300">
                      {loading ? "Loading..." : "Ready"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Inventory control
                    </p>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="mt-8">
                <div className="relative mx-auto max-w-3xl">
                  <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 opacity-30 blur-xl"></div>

                  <div className="relative flex items-center overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-black/20">
                    <div className="pl-5 text-slate-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                        />
                      </svg>
                    </div>

                    <input
                      type="text"
                      value={value}
                      onChange={handleSearch}
                      placeholder="Search by product title, category, brand..."
                      className="h-16 w-full bg-transparent px-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                    />

                    {value && (
                      <button
                        type="button"
                        onClick={clearSearch}
                        className="mr-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-red-100 hover:text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {value && (
                    <p className="mt-4 text-center text-sm text-slate-400">
                      Searching for{" "}
                      <span className="font-black text-emerald-300">
                        "{value}"
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <InfiniteScroll
            pageStart={0}
            hasMore={hasMore}
            loadMore={() => fetchData(value, skip)}
            loader={
              <div
                key="loader"
                className="col-span-full flex justify-center py-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400"></div>
                  <p className="text-sm font-semibold text-slate-400">
                    Loading products...
                  </p>
                </div>
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {data.length > 0 &&
                data.map((ele, index) => (
                  <div
                    key={ele._id || index}
                    className="group rounded-[1.7rem] border border-white/10 bg-white p-3 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/20"
                  >
                    <ProductCard
                      product={ele}
                      setselectdProduct={setselectdProduct}
                      setData={setData}
                      setSkip={setSkip}
                      setHasMore={setHasMore}
                      fetchData={fetchData}
                      setopenModal={setopenModal}
                    />
                  </div>
                ))}
            </div>
          </InfiniteScroll>

          {/* End Message */}
          {!hasMore && data.length > 0 && (
            <div className="mt-10 text-center">
              <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-slate-300 shadow-sm backdrop-blur">
                No more products available
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && data.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-4xl">
                📦
              </div>

              <h2 className="text-3xl font-black text-white">
                No products found
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                No product matched your search. Try another keyword or clear the
                search field.
              </p>

              {value && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-900 transition hover:bg-emerald-100"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default FetchProduct;