import React from "react";
import { useNavigate } from "react-router";
import {
  SparklesIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-8 lg:py-20">
        {/* Left Content */}
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm">
            <SparklesIcon className="h-4 w-4" />
            Natural Fragrance • Premium Quality
          </div>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            Premium Incense Sticks
            <span className="block bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Crafted for Peace & Positivity
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Fill your space with soothing aroma, spiritual calm, and long-lasting
            fragrance. Discover handcrafted incense sticks made with care,
            premium ingredients, and traditional essence for your daily rituals
            and relaxation.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/fetch-products")}
              className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 px-7 py-4 text-sm font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:from-orange-700 hover:to-amber-600"
            >
              Shop Incense
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="rounded-2xl border border-orange-200 bg-white px-7 py-4 text-sm font-black text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              View Cart
            </button>
          </div>

          {/* Feature Cards */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<ShieldCheckIcon className="h-6 w-6" />}
              title="Pure Aroma"
              text="Rich and soothing fragrance"
            />
            <FeatureCard
              icon={<TruckIcon className="h-6 w-6" />}
              title="Fast Delivery"
              text="Quick shipping across India"
            />
            <FeatureCard
              icon={<SparklesIcon className="h-6 w-6" />}
              title="Long Lasting"
              text="Made for daily rituals"
            />
          </div>
        </div>

        {/* Right Content */}
        <div className="relative">
          <div className="relative mx-auto max-w-xl">
            <div className="relative overflow-hidden rounded-[2rem] border border-orange-100 bg-white/80 p-4 shadow-2xl shadow-orange-100 backdrop-blur-xl sm:p-5">
              <div className="overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
                <img
                  src="https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop"
                  alt="Incense sticks"
                  className="h-[320px] w-full object-cover sm:h-[460px]"
                />
              </div>

              <div className="absolute left-2 top-2 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:left-5 sm:top-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                  Bestseller
                </p>
                <p className="mt-1 text-sm font-black text-gray-900">
                  Divine Fragrance
                </p>
              </div>

              <div className="absolute bottom-2 right-2 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:bottom-5 sm:right-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-green-600">
                  Starting From
                </p>
                <p className="mt-1 text-lg font-black text-gray-900">₹99</p>
              </div>
            </div>

            <div className="absolute -left-3 bottom-10 hidden rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl shadow-orange-100 md:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Natural
              </p>
              <p className="mt-1 text-sm font-black text-gray-900">
                Handcrafted Essence
              </p>
            </div>

            <div className="absolute -right-3 top-16 hidden rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl shadow-orange-100 md:block">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Trusted
              </p>
              <p className="mt-1 text-sm font-black text-gray-900">
                Premium Quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, text }) => {
  return (
    <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
        {icon}
      </div>

      <h3 className="text-sm font-black text-gray-900">{title}</h3>
      <p className="mt-1 text-xs leading-6 text-gray-500">{text}</p>
    </div>
  );
};

export default HeroSection;