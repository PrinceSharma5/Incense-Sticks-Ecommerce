import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DashboardNavbar from "../../components/dashboard/Header";
import toast from "react-hot-toast";

const CouponCode = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    maxDiscount: "",
  });

  const [couponCodes, setCouponCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    } else {
      fetchCouponCodes();
    }
  }, [navigate]);

  const fetchCouponCodes = async () => {
    try {
      setFetchLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/coupon-code/fetch-coupon-codes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
        }
      );

      const json = await response.json();

      if (json.success) {
        setCouponCodes(json.data || []);
      } else {
        toast.error(json.message || "Failed to fetch coupon codes");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching coupons");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const discount = Number(formData.discount);
    const maxDiscount = Number(formData.maxDiscount);

    if (!name) {
      toast.error("Coupon code name is required");
      return;
    }

    if (!discount || discount <= 0) {
      toast.error("Discount must be greater than 0");
      return;
    }

    if (!maxDiscount || maxDiscount <= 0) {
      toast.error("Max discount must be greater than 0");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/coupon-code/create-new-coupon-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: sessionStorage.getItem("adminToken"),
          },
          body: JSON.stringify({
            name,
            discount,
            maxDiscount,
          }),
        }
      );

      const json = await response.json();

      if (json.success) {
        toast.success(json.message || "Coupon code created successfully");

        setFormData({
          name: "",
          discount: "",
          maxDiscount: "",
        });

        fetchCouponCodes();
      } else {
        toast.error(json.message || "Failed to create coupon code");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating coupon");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <section className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-3 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1 text-sm font-semibold text-emerald-300">
                  Dashboard Control
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  Coupon Code Management
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Create, track and manage discount coupon codes for your
                  ecommerce orders from one clean dashboard screen.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:min-w-[340px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur">
                  <p className="text-sm text-slate-400">Total Coupons</p>
                  <h2 className="mt-1 text-4xl font-bold text-emerald-300">
                    {couponCodes.length}
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center backdrop-blur">
                  <p className="text-sm text-slate-400">Status</p>
                  <h2 className="mt-2 text-lg font-bold text-white">
                    Active
                  </h2>
                  <p className="mt-1 text-xs text-emerald-300">
                    Ready to use
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
            {/* Add Coupon Form */}
            <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900 shadow-xl shadow-black/20">
              <div className="mb-6">
                <p className="mb-2 inline-flex rounded-full bg-emerald-50 px-4 py-1 text-sm font-semibold text-emerald-600">
                  Add New
                </p>

                <h2 className="text-2xl font-bold text-slate-950">
                  Create Coupon
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Add a coupon code with discount percentage and maximum
                  discount limit.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Coupon Code Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: SAVE20"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 outline-none transition placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="discount"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Discount %
                    </label>

                    <div className="relative">
                      <input
                        type="number"
                        id="discount"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="20"
                        min="1"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      />

                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        %
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="maxDiscount"
                      className="text-sm font-semibold text-slate-700"
                    >
                      Max Discount
                    </label>

                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        ₹
                      </span>

                      <input
                        type="number"
                        id="maxDiscount"
                        name="maxDiscount"
                        value={formData.maxDiscount}
                        onChange={handleChange}
                        placeholder="500"
                        min="1"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-8 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    Example Preview
                  </p>

                  <p className="mt-1 text-sm text-emerald-700/80">
                    Customer gets{" "}
                    <span className="font-bold">
                      {formData.discount || 0}%
                    </span>{" "}
                    discount up to{" "}
                    <span className="font-bold">
                      ₹{formData.maxDiscount || 0}
                    </span>
                    .
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Creating Coupon..." : "Create Coupon Code"}
                </button>
              </form>
            </div>

            {/* Coupon Table */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20 backdrop-blur">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="mb-2 inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1 text-sm font-semibold text-indigo-300">
                    Coupon List
                  </p>

                  <h2 className="text-2xl font-bold text-white">
                    Existing Coupon Codes
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    View all created coupon codes with discount details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={fetchCouponCodes}
                  disabled={fetchLoading}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {fetchLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>

              <div className="overflow-hidden rounded-3xl border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          #
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Coupon Code
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Discount
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Max Discount
                        </th>

                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                          Created Date
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {fetchLoading ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-5 py-12 text-center text-sm text-slate-400"
                          >
                            Loading coupon codes...
                          </td>
                        </tr>
                      ) : couponCodes.length > 0 ? (
                        couponCodes.map((item, index) => (
                          <tr
                            key={item._id || index}
                            className="border-t border-white/10 transition hover:bg-white/5"
                          >
                            <td className="px-5 py-5 text-sm font-semibold text-slate-400">
                              #{index + 1}
                            </td>

                            <td className="px-5 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-sm font-bold text-emerald-300">
                                  {item.name?.charAt(0)?.toUpperCase() || "C"}
                                </div>

                                <div>
                                  <p className="font-bold uppercase tracking-wide text-white">
                                    {item.name}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    ID: {item._id || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-5">
                              <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-300">
                                {item.discount}%
                              </span>
                            </td>

                            <td className="px-5 py-5">
                              <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-300">
                                ₹{item.maxDiscount}
                              </span>
                            </td>

                            <td className="px-5 py-5 text-sm text-slate-400">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    }
                                  )
                                : "N/A"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-5 py-12">
                            <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
                              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-2xl font-bold text-emerald-300">
                                0
                              </div>

                              <h3 className="text-xl font-bold text-white">
                                No Coupon Codes Found
                              </h3>

                              <p className="mt-2 text-sm text-slate-400">
                                Create your first coupon code using the form.
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="mt-6 grid grid-cols-1 gap-4 lg:hidden">
                {couponCodes.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="rounded-3xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">
                          Coupon #{index + 1}
                        </p>

                        <h3 className="mt-1 text-lg font-bold uppercase tracking-wide text-white">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg font-bold text-emerald-300">
                        {item.name?.charAt(0)?.toUpperCase() || "C"}
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-emerald-500/10 p-4">
                        <p className="text-xs text-slate-400">Discount</p>
                        <p className="mt-1 text-lg font-bold text-emerald-300">
                          {item.discount}%
                        </p>
                      </div>

                      <div className="rounded-2xl bg-amber-500/10 p-4">
                        <p className="text-xs text-slate-400">Max Discount</p>
                        <p className="mt-1 text-lg font-bold text-amber-300">
                          ₹{item.maxDiscount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CouponCode;