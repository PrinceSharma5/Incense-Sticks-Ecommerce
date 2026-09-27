import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router";

const user = {
  name: "Admin",
  email: "admin@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Categories",
    href: "/dashboard/category-control",
  },
  {
    name: "Add Product",
    href: "/dashboard/product-control",
  },
  {
    name: "Products",
    href: "/dashboard/fetch-products",
  },
  {
    name: "Orders",
    href: "/dashboard/fetch-orders",
  },
  {
    name: "Coupons",
    href: "/dashboard/create-coupon-code",
  },
];

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DashboardNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/dashboard/login");
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <Disclosure
      as="header"
      className="sticky top-0 z-[999] border-b border-white/10 bg-[#020617]/90 shadow-2xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="relative flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/20">
                A
              </div>

              <div className="hidden sm:block">
                <h1 className="text-lg font-black tracking-tight text-white">
                  Admin Panel
                </h1>
                <p className="text-xs font-medium text-slate-400">
                  Dashboard Control
                </p>
              </div>
            </Link>
          </div>

          {/* Search */}
          <div className="hidden flex-1 justify-center px-4 md:flex">
            <div className="relative w-full max-w-md">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />

              <input
                name="search"
                placeholder="Search dashboard..."
                aria-label="Search"
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-12 pr-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-400/50 focus:bg-white/[0.09] focus:ring-4 focus:ring-emerald-400/10"
              />
            </div>
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
            >
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#020617] bg-emerald-400" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 transition hover:bg-white/[0.1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
                <img
                  alt="Admin"
                  src={user.imageUrl}
                  className="h-9 w-9 rounded-xl object-cover outline outline-1 -outline-offset-1 outline-white/10"
                />

                <div className="hidden text-left xl:block">
                  <p className="text-sm font-bold text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-10 mt-3 w-56 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-slate-950 py-2 shadow-2xl shadow-black/30 outline-none transition data-[closed]:scale-95 data-[closed]:opacity-0"
              >
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <a
                      href={item.href}
                      className="block px-4 py-3 text-sm font-semibold text-slate-300 transition data-[focus]:bg-white/[0.06] data-[focus]:text-white"
                    >
                      {item.name}
                    </a>
                  </MenuItem>
                ))}

                <div className="my-2 border-t border-white/10" />

                <MenuItem>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 text-left text-sm font-bold text-red-300 transition data-[focus]:bg-red-500/10 data-[focus]:text-red-200"
                  >
                    Sign Out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <DisclosureButton className="group inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/[0.1] hover:text-white focus:outline-none">
              <span className="sr-only">Open menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Global"
          className="hidden border-t border-white/10 py-3 lg:flex lg:flex-wrap lg:gap-2"
        >
          {navigation.map((item) => {
            const active = isActivePath(item.href);

            return (
              <Link
                key={item.name}
                to={item.href}
                aria-current={active ? "page" : undefined}
                className={classNames(
                  active
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                    : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
                  "inline-flex items-center rounded-2xl px-4 py-2.5 text-sm font-bold transition"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Panel */}
      <DisclosurePanel as="nav" aria-label="Global" className="lg:hidden">
        <div className="border-t border-white/10 px-4 pb-4 pt-4">
          {/* Mobile Search */}
          <div className="relative mb-4 md:hidden">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />

            <input
              name="search"
              placeholder="Search dashboard..."
              aria-label="Search"
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.06] pl-12 pr-4 text-sm font-medium text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
            />
          </div>

          {/* Mobile Links */}
          <div className="grid gap-2">
            {navigation.map((item) => {
              const active = isActivePath(item.href);

              return (
                <DisclosureButton
                  key={item.name}
                  as={Link}
                  to={item.href}
                  aria-current={active ? "page" : undefined}
                  className={classNames(
                    active
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
                    "block rounded-2xl px-4 py-3 text-base font-bold transition"
                  )}
                >
                  {item.name}
                </DisclosureButton>
              );
            })}
          </div>
        </div>

        {/* Mobile Profile */}
        <div className="border-t border-white/10 px-4 pb-5 pt-4">
          <div className="flex items-center rounded-3xl border border-white/10 bg-white/[0.05] p-4">
            <img
              alt="Admin"
              src={user.imageUrl}
              className="h-12 w-12 rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-white/10"
            />

            <div className="ml-3 min-w-0">
              <div className="truncate text-base font-black text-white">
                {user.name}
              </div>
              <div className="truncate text-sm font-medium text-slate-400">
                {user.email}
              </div>
            </div>

            <button
              type="button"
              className="relative ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-slate-300 hover:text-white"
            >
              <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-[#020617] bg-emerald-400" />
              <BellIcon aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 grid gap-2">
            {userNavigation.map((item) => (
              <DisclosureButton
                key={item.name}
                as="a"
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-base font-bold text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
              >
                {item.name}
              </DisclosureButton>
            ))}

            <DisclosureButton
              as="button"
              type="button"
              onClick={handleLogout}
              className="block w-full rounded-2xl px-4 py-3 text-left text-base font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
            >
              Sign Out
            </DisclosureButton>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}