import React, { useEffect, useState, useActionState } from "react";
import DashboardNavbar from "../../components/dashboard/Header";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const CategoryControl = () => {
  const navigate = useNavigate();

  const [categoryData, setcategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  const fetchAllCategories = async () => {
    try {
      setIsFetching(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/category/fetch-all-categories`,
        {
          method: "GET",
        }
      );

      const json = await response.json();

      if (json.success) {
        setcategoryData(json.data || []);
      } else {
        toast.error(json.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleSubmit = async (oldData, newData) => {
    const name = newData.get("name");

    if (!name || name.trim() === "") {
      toast.error("Category name is required");

      return {
        name: "",
        error: "Category name is required",
      };
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/category/add-new-cartegory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Category added successfully");
        fetchAllCategories();

        return {
          name: "",
          error: "",
        };
      } else {
        toast.error(json.message || "Failed to add category");

        return {
          name,
          error: json.message,
        };
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");

      return {
        name,
        error: "Something went wrong",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    name: "",
    error: "",
  });

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setUpdateName(category.name);
  };

  const handleCancelUpdate = () => {
    setSelectedCategory(null);
    setUpdateName("");
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.error("Please select category first");
      return;
    }

    if (!updateName || updateName.trim() === "") {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsUpdating(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/category/update-specific-category`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            name: updateName.trim(),
            _id: selectedCategory._id,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Category updated successfully");
        setSelectedCategory(null);
        setUpdateName("");
        fetchAllCategories();
      } else {
        toast.error(json.message || "Failed to update category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.name}" category?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(category._id);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/category/delete-specific-category`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            _id: category._id,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Category deleted successfully");

        if (selectedCategory?._id === category._id) {
          setSelectedCategory(null);
          setUpdateName("");
        }

        fetchAllCategories();
      } else {
        toast.error(json.message || "Failed to delete category");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <section className="min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute right-[-120px] top-40 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute bottom-[-120px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-7">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/60" />
                  Dashboard Control
                </div>

                <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Category Management
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Create, update, delete and manage all product or website
                  categories from one modern admin screen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Total Categories
                  </p>
                  <h2 className="mt-3 text-4xl font-black text-white">
                    {categoryData.length}
                  </h2>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/10 p-5 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <h2 className="mt-3 text-lg font-black text-emerald-300">
                    Active
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Ready to manage
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Forms */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Add Category */}
            <div className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/20 sm:p-7">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Add New
                  </span>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    Create Category
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add a fresh category to organize your products properly.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-black text-white shadow-xl shadow-indigo-500/30">
                  +
                </div>
              </div>

              <form action={formAction} className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Category Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    defaultValue={state.name}
                    placeholder="Example: Organic Products"
                    className="h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />

                  {state.error && (
                    <p className="mt-2 text-sm font-semibold text-red-500">
                      {state.error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-6 text-sm font-black text-white shadow-xl shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isPending ? "Adding Category..." : "Add Category"}
                  {!isPending && (
                    <span className="transition group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Update Category */}
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
              <div className="mb-7 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                    Update
                  </span>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                    Update Category
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Select any category below and change its name here.
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-xl font-black text-amber-300">
                  ✎
                </div>
              </div>

              <form onSubmit={handleUpdateCategory} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-300">
                    Selected Category
                  </label>

                  <input
                    type="text"
                    value={selectedCategory ? selectedCategory.name : ""}
                    readOnly
                    placeholder="No category selected"
                    className="h-14 w-full cursor-not-allowed rounded-2xl border border-white/10 bg-slate-950/60 px-5 text-sm font-medium text-slate-300 outline-none placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="updateName"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    New Category Name
                  </label>

                  <input
                    type="text"
                    id="updateName"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                    placeholder="Enter updated category name"
                    disabled={!selectedCategory}
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-5 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="submit"
                    disabled={!selectedCategory || isUpdating}
                    className="h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 text-sm font-black text-white shadow-xl shadow-amber-500/20 transition hover:-translate-y-0.5 hover:shadow-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isUpdating ? "Updating..." : "Update Category"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancelUpdate}
                    disabled={!selectedCategory}
                    className="h-14 rounded-2xl border border-white/10 bg-white/10 px-6 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Category List */}
          <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7">
            <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <span className="inline-flex rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
                  Category List
                </span>

                <h2 className="mt-4 text-2xl font-black tracking-tight text-white">
                  All Categories
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                  View, edit or delete your existing categories.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchAllCategories}
                disabled={isFetching}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isFetching ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {categoryData.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {categoryData.map((category, index) => {
                  const isSelected = selectedCategory?._id === category._id;

                  return (
                    <div
                      key={category._id || index}
                      className={`group relative overflow-hidden rounded-[1.7rem] border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                        isSelected
                          ? "border-amber-400/50 bg-amber-400/10 shadow-amber-500/10"
                          : "border-white/10 bg-white/[0.05] shadow-black/10 hover:border-indigo-400/30"
                      }`}
                    >
                      <div className="absolute right-[-35px] top-[-35px] h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl transition group-hover:bg-indigo-500/20" />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span
                            className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              isSelected
                                ? "bg-amber-400/15 text-amber-300"
                                : "bg-indigo-400/10 text-indigo-300"
                            }`}
                          >
                            Category #{index + 1}
                          </span>

                          <h3 className="truncate text-xl font-black text-white">
                            {category.name}
                          </h3>

                          <p className="mt-2 max-w-[220px] truncate text-xs font-medium text-slate-500">
                            ID: {category._id}
                          </p>
                        </div>

                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${
                            isSelected
                              ? "bg-amber-400 text-slate-950"
                              : "bg-white/10 text-indigo-300"
                          }`}
                        >
                          {category.name?.charAt(0)?.toUpperCase()}
                        </div>
                      </div>

                      <div className="relative mt-6 grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditClick(category)}
                          className="h-11 rounded-2xl bg-amber-500 px-4 text-sm font-black text-white transition hover:bg-amber-600"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={deletingId === category._id}
                          className="h-11 rounded-2xl bg-red-500 px-4 text-sm font-black text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {deletingId === category._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.7rem] border border-dashed border-white/10 bg-white/[0.04] p-10 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-indigo-400/20 bg-indigo-400/10 text-3xl font-black text-indigo-300">
                  0
                </div>

                <h3 className="text-2xl font-black text-white">
                  No Categories Found
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                  You have not added any category yet. Create your first
                  category using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryControl;