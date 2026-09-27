import React from "react";
import { Link } from "react-router";

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "Products", href: "/fetch-products" },
    { name: "Cart", href: "/cart" },
    { name: "Login", href: "/login" },
  ],
  social: [
    {
      name: "Facebook",
      href: "#",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
};

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-neutral-900 to-black text-white">
      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 shadow-lg shadow-orange-500/20">
                <span className="text-xl font-black text-white">R</span>
              </div>

              <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Raghu Rash
                </h2>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-orange-300">
                  Organic Store
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-300">
              Premium organic products crafted with care, purity, and trust.
              Bring wellness, freshness, and natural goodness into your daily
              life with products made for modern living.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-200">
                100% Pure
              </span>
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-200">
                Fast Delivery
              </span>
              <span className="rounded-full border border-orange-400/20 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-200">
                Trusted Quality
              </span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                Quick Links
              </h3>

              <nav aria-label="Footer" className="mt-5 flex flex-col gap-3">
                {navigation.main.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-sm font-medium text-gray-300 transition hover:translate-x-1 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-orange-300">
                Contact
              </h3>

              <div className="mt-5 space-y-3 text-sm text-gray-300">
                <p>Ahmedabad, Gujarat, India</p>
                <p>support@raghurash.com</p>
                <p>+91 98765 43210</p>
              </div>

              <div className="mt-6 flex gap-4">
                {navigation.social.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="rounded-full border border-white/10 bg-white/5 p-3 text-gray-300 transition hover:-translate-y-0.5 hover:border-orange-400/30 hover:bg-orange-500/10 hover:text-white"
                  >
                    <span className="sr-only">{item.name}</span>
                    <item.icon aria-hidden="true" className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-sm text-gray-400">
            &copy; 2026 Raghu Rash Organic Store. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-400 sm:justify-end">
            <Link to="/" className="transition hover:text-white">
              Privacy Policy
            </Link>
            <span className="h-1 w-1 rounded-full bg-gray-600" />
            <Link to="/" className="transition hover:text-white">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;