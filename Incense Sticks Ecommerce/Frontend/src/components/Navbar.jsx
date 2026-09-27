import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router";

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Products",
    href: "/fetch-products",
    icon: Squares2X2Icon,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: ShoppingCartIcon,
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = useMemo(() => {
    return !!sessionStorage.getItem("userToken");
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    navigate("/login");
    setOpen(false);
  };

  return (
    <div className={`sticky top-0 z-50`}>
      <header className="relative">
        <nav aria-label="Top" className="shadow-sm">
          {/* top strip */}
          <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400">
            <div className="mx-auto flex h-10 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-bold tracking-wide text-white sm:text-sm">
                Pure fragrance, handcrafted care, and fast delivery across India
              </p>
            </div>
          </div>

          {/* main nav */}
          <div className="border-b border-orange-100 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-24 items-center justify-between">
                {/* mobile left */}
                <div className="flex flex-1 items-center lg:hidden">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="-ml-2 rounded-2xl bg-orange-50 p-2.5 text-orange-700 transition hover:bg-orange-100"
                  >
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>

                {/* left area */}
                <div className="flex items-center gap-8 xl:gap-12">
                  {/* logo */}
                  <Link to="/" className="group flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400 shadow-lg shadow-orange-200 transition duration-300 group-hover:scale-105">
                      <span className="text-lg font-black text-white">R</span>
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-[1.35rem] font-black leading-none tracking-tight text-gray-900">
                        Raghu Rash
                      </p>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.26em] text-orange-600">
                        Organic Store
                      </p>
                    </div>
                  </Link>

                  {/* desktop nav */}
                  <div className="hidden lg:flex lg:items-center">
                    <div className="flex items-center gap-3 xl:gap-4">
                      {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                              `group inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-[15px] font-bold transition-all duration-300 ${
                                isActive
                                  ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-200"
                                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-700"
                              }`
                            }
                          >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            <span>{item.name}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* right side */}
                <div className="flex flex-1 items-center justify-end">
                  <div className="flex items-center gap-3 sm:gap-4 lg:gap-5">
                    <Link
                      to="/cart"
                      className="group relative rounded-full bg-orange-50 p-3 text-orange-700 transition hover:bg-orange-100"
                    >
                      <span className="sr-only">Cart</span>
                      <ShoppingCartIcon className="h-6 w-6" />
                    </Link>

                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="hidden rounded-full bg-gray-900 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800 sm:block"
                      >
                        Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        className="hidden rounded-full bg-gradient-to-r from-orange-600 to-amber-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:from-orange-700 hover:to-amber-600 sm:block"
                      >
                        Login
                      </Link>
                    )}

                    <Link
                      to="/login"
                      className="rounded-full bg-orange-50 p-3 text-orange-700 transition hover:bg-orange-100 sm:hidden"
                    >
                      <span className="sr-only">Account</span>
                      <UserIcon className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* mobile menu */}
        <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-50 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-6 shadow-2xl transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <div className="flex items-center justify-between border-b border-orange-100 px-4 py-4">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 via-amber-500 to-yellow-400">
                    <span className="text-base font-black text-white">R</span>
                  </div>

                  <div>
                    <p className="text-base font-black text-gray-900">
                      Raghu Rash
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                      Organic Store
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-orange-50 p-2.5 text-orange-700 transition hover:bg-orange-100"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-2 px-4 py-5">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                          isActive
                            ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-200"
                            : "bg-orange-50 text-gray-700 hover:bg-orange-100 hover:text-orange-700"
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="mt-auto border-t border-orange-100 px-4 pt-5">
                {isLoggedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 px-4 py-3 text-center text-sm font-bold text-white transition hover:from-orange-700 hover:to-amber-600"
                  >
                    Login
                  </Link>
                )}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </header>
    </div>
  );
}