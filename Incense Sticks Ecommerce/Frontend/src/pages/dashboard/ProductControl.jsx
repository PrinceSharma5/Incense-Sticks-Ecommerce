import React, { useActionState, useEffect, useState } from "react";
import DashboardNavbar from "../../components/dashboard/Header";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const ProductControl = () => {
  const [imageField, setimageField] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoryLoading(true);

        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/category/fetch-all-categories`
        );

        const json = await response.json();

        if (json.success) {
          setCategories(json.data || []);
        } else {
          toast.error(json.message || "Failed to fetch categories");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong while fetching categories");
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const add_one_more_image = () => {
    if (imageField.length > 2) {
      toast.error("Maximum 4 images allowed");
      return;
    }

    const nextImageNumber = imageField.length + 2;

    setimageField([
      ...imageField,
      {
        id: `img-${nextImageNumber}`,
        name: `img-${nextImageNumber}`,
      },
    ]);
  };

  const removeImageField = (id) => {
    setimageField((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmit = async (oldData, newData) => {
    const img_1 = newData.get("img-1");
    const img_2 = newData.get("img-2");
    const img_3 = newData.get("img-3");
    const img_4 = newData.get("img-4");

    const title = newData.get("title");
    const brand_name = newData.get("brand_name");
    const category = newData.get("category");
    const fragnance_type = newData.get("fragnance_type");
    const mrp = newData.get("mrp");
    const discount = newData.get("discount");
    const actual_price = newData.get("actual_price");
    const stock = newData.get("stock");
    const burning_time = newData.get("burning_time");
    const weight = newData.get("weight");
    const material = newData.get("material");
    const description = newData.get("description");

    if (!img_1 || img_1.size === 0) {
      toast.error("At least one image is required");

      return {
        title,
        brand_name,
        category,
        fragnance_type,
        mrp,
        discount,
        actual_price,
        stock,
        burning_time,
        weight,
        material,
        description,
      };
    }

    if (!category) {
      toast.error("Please select category");

      return {
        title,
        brand_name,
        category,
        fragnance_type,
        mrp,
        discount,
        actual_price,
        stock,
        burning_time,
        weight,
        material,
        description,
      };
    }

    const formdata = new FormData();

    formdata.append("my-files", img_1);

    if (img_2 && img_2.size > 0) {
      formdata.append("my-files", img_2);
    }

    if (img_3 && img_3.size > 0) {
      formdata.append("my-files", img_3);
    }

    if (img_4 && img_4.size > 0) {
      formdata.append("my-files", img_4);
    }

    formdata.append("title", title);
    formdata.append("brand_name", brand_name);
    formdata.append("category", category);
    formdata.append("fragnance_type", fragnance_type);
    formdata.append("mrp", mrp);
    formdata.append("discount", discount);
    formdata.append("actual_price", actual_price);
    formdata.append("stock", stock);
    formdata.append("burning_time", burning_time);
    formdata.append("material", material);
    formdata.append("weight", weight);
    formdata.append("description", description);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/product/add-new-product`,
        {
          method: "POST",
          headers: {
            token: sessionStorage.getItem("adminToken"),
          },
          body: formdata,
        }
      );

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Product added successfully");
        setimageField([]);

        return {
          title: "",
          brand_name: "",
          category: "",
          fragnance_type: "",
          mrp: "",
          discount: "",
          actual_price: "",
          stock: "",
          burning_time: "",
          weight: "",
          material: "",
          description: "",
        };
      } else {
        toast.error(json.message || "Failed to add product");

        return {
          title,
          brand_name,
          category,
          fragnance_type,
          mrp,
          discount,
          actual_price,
          stock,
          burning_time,
          weight,
          material,
          description,
        };
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");

      return {
        title,
        brand_name,
        category,
        fragnance_type,
        mrp,
        discount,
        actual_price,
        stock,
        burning_time,
        weight,
        material,
        description,
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    title: "",
    brand_name: "",
    category: "",
    fragnance_type: "",
    mrp: "",
    discount: "",
    actual_price: "",
    stock: "",
    burning_time: "",
    weight: "",
    material: "",
    description: "",
  });

  return (
    <>
      <DashboardNavbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute bottom-[-180px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="relative">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-orange-300">
                    <span className="h-2 w-2 rounded-full bg-orange-300 shadow-lg shadow-orange-300/70" />
                    Product Control
                  </div>

                  <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                    Add New Product
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                    Add product details, pricing, inventory, material,
                    fragrance and multiple images from one premium dashboard
                    form.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Image Limit
                    </p>
                    <p className="mt-3 text-4xl font-black text-white">4</p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-orange-500/20 to-amber-500/10 p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status
                    </p>
                    <p className="mt-3 text-lg font-black text-orange-300">
                      {isPending ? "Saving..." : "Ready"}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Product creation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            action={formAction}
            className="overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/30"
          >
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 px-5 py-5 sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">
                    Product Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Fill all important product details carefully.
                  </p>
                </div>

                <span className="inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-orange-300">
                  Admin Form
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 bg-slate-50 p-5 sm:p-8 lg:grid-cols-12">
              <div className="lg:col-span-12">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Product Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={state.title}
                  placeholder="Premium Scented Candle"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brand_name"
                  defaultValue={state.brand_name}
                  placeholder="Royal Rays"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  defaultValue={state.category}
                  disabled={isCategoryLoading}
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 shadow-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {isCategoryLoading ? "Loading categories..." : "Select Category"}
                  </option>

                  {categories.map((item) => (
                    <option key={item._id || item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Fragrance Type
                </label>
                <input
                  type="text"
                  name="fragnance_type"
                  defaultValue={state.fragnance_type}
                  placeholder="Lavender / Rose / Vanilla"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-6">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  defaultValue={state.stock}
                  placeholder="50"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  MRP
                </label>
                <input
                  type="number"
                  name="mrp"
                  defaultValue={state.mrp}
                  placeholder="999"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Discount %
                </label>
                <input
                  type="number"
                  name="discount"
                  defaultValue={state.discount}
                  placeholder="20"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Actual Price
                </label>
                <input
                  type="number"
                  name="actual_price"
                  defaultValue={state.actual_price}
                  placeholder="799"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Burning Time
                </label>
                <input
                  type="text"
                  name="burning_time"
                  defaultValue={state.burning_time}
                  placeholder="30 - 40 Hours"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Weight
                </label>
                <input
                  type="text"
                  name="weight"
                  defaultValue={state.weight}
                  placeholder="250g"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Material
                </label>
                <input
                  type="text"
                  name="material"
                  defaultValue={state.material}
                  placeholder="Soy Wax, Cotton Wick, Glass Jar"
                  className="h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div className="lg:col-span-12">
                <div className="mb-4 flex flex-col gap-3 rounded-3xl border border-orange-100 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <label className="block text-sm font-black text-slate-800">
                      Product Images
                    </label>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      Upload minimum 1 image and maximum 4 images.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={add_one_more_image}
                    disabled={imageField.length > 2}
                    className="inline-flex h-11 items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    + Add Image
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-black text-slate-700">
                        Image 1
                      </p>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        Required
                      </span>
                    </div>

                    <input
                      type="file"
                      name="img-1"
                      accept="image/*"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-black file:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                    />
                  </div>

                  {imageField.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-black text-slate-700">
                          Image {index + 2}
                        </p>

                        <button
                          type="button"
                          onClick={() => removeImageField(item.id)}
                          className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 transition hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        type="file"
                        name={item.name}
                        accept="image/*"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-black file:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-12">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="5"
                  defaultValue={state.description}
                  placeholder="Write product description..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-sm font-medium text-slate-500">
                Please check product price, stock and images before saving.
              </p>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-13 min-h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Saving Product..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ProductControl;