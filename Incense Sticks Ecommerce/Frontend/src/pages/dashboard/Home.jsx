import React, { useEffect } from "react";
import DashboardNavbar from "../../components/dashboard/Header";
import { useNavigate, Link } from "react-router";

const DashboardHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/dashboard/login");
    }
  }, [navigate]);

  const dashboardLinks = [
    {
      title: "Dashboard Home",
      description: "Main dashboard overview page.",
      path: "/dashboard",
      icon: "🏠",
      badge: "Home",
    },
    {
      title: "Category Control",
      description: "Add, update and manage product categories.",
      path: "/dashboard/category-control",
      icon: "📂",
      badge: "Categories",
    },
    {
      title: "Add Product",
      description: "Create a new product with images and details.",
      path: "/dashboard/product-control",
      icon: "➕",
      badge: "Create",
    },
    {
      title: "Fetch Products",
      description: "View, search, edit and manage all products.",
      path: "/dashboard/fetch-products",
      icon: "📦",
      badge: "Products",
    },
    {
      title: "Fetch Orders",
      description: "View customer orders and payment details.",
      path: "/dashboard/fetch-orders",
      icon: "🛒",
      badge: "Orders",
    },
    {
      title: "Create Coupon Code",
      description: "Add and manage discount coupon codes.",
      path: "/dashboard/create-coupon-code",
      icon: "🎟️",
      badge: "Coupons",
    },
  ];

  return (
    <>
      <DashboardNavbar />

      <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute bottom-[-180px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/70" />
                  Admin Dashboard
                </div>

                <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                  Dashboard Home
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  Manage categories, products, orders and coupon codes from one
                  clean admin dashboard.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Pages
                  </p>
                  <p className="mt-3 text-4xl font-black text-white">
                    {dashboardLinks.length}
                  </p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>
                  <p className="mt-3 text-lg font-black text-emerald-300">
                    Active
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Admin access
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Links */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {dashboardLinks.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-emerald-400/40 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                <div className="absolute right-[-40px] top-[-40px] h-28 w-28 rounded-full bg-emerald-500/10 blur-2xl transition group-hover:bg-emerald-500/20" />

                <div className="relative">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-3xl shadow-lg">
                      {item.icon}
                    </div>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-300">
                      {item.badge}
                    </span>
                  </div>

                  <h2 className="text-xl font-black tracking-tight text-white">
                    {item.title}
                  </h2>

                  <p className="mt-3 min-h-[48px] text-sm leading-6 text-slate-400">
                    {item.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {item.path}
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-black text-slate-950 transition group-hover:bg-emerald-400 group-hover:text-slate-950">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Note */}
          <div className="mt-7 rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-black text-white">
                  Quick Access
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Click any card above to open that dashboard section.
                </p>
              </div>

              <Link
                to="/dashboard/product-control"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5"
              >
                Add New Product
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardHome;