import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  LockClosedIcon,
  SparklesIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router";
import BrandMark from "./BrandMark";
import ThemeToggle from "./ThemeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Our collection", href: "/fetch-products" },
];

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex w-fit items-center gap-3 text-slate-900 no-underline dark:text-slate-100" aria-label="Aura & Ember home">
      <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-md shadow-slate-900/10 dark:border-slate-300 dark:bg-white">
        <BrandMark className="relative z-10 h-7 w-7" />
      </span>
      <span className="grid gap-1">
        <span className="font-serif text-xl font-semibold leading-none tracking-tight">Aura &amp; Ember</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">A little calm, every day</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = useMemo(() => !!sessionStorage.getItem("userToken"), []);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    navigate("/login");
    setOpen(false);
  };
  const closeMenu = () => setOpen(false);

  return (
    <div className="sticky top-0 z-50">
      <div className="flex min-h-[34px] items-center justify-center gap-3 bg-rose-950 px-5 py-1 text-[10px] uppercase tracking-[0.09em] text-rose-50 max-sm:px-2 max-sm:text-[8px] max-sm:tracking-wide">
        <SparklesIcon className="h-4 w-4 shrink-0 text-orange-300 max-sm:hidden" aria-hidden="true" />
        <p className="m-0">Find a slower kind of calm <span className="px-2 text-orange-400" aria-hidden="true">&middot;</span> Crafted for your everyday rituals</p>
        <Link to="/fetch-products" className="inline-flex items-center gap-1 font-bold text-white no-underline hover:text-orange-200 max-sm:hidden">
          Explore the collection <ArrowRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <header className="border-b border-slate-200/80 bg-stone-50/95 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95">
        <nav className="mx-auto grid min-h-[82px] w-[min(calc(100%_-_48px),1320px)] grid-cols-[auto_1fr_auto] items-center min-[901px]:grid-cols-[1fr_auto_1fr] max-sm:min-h-[68px] max-sm:w-[calc(100%_-_28px)]" aria-label="Main navigation">
          <button
            type="button"
            className="grid h-[42px] w-[42px] place-items-center rounded-full border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 min-[901px]:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 max-sm:h-[39px] max-sm:w-[39px]"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Bars3Icon className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="justify-self-center min-[901px]:justify-self-start"><Brand /></div>

          <div className="hidden items-center gap-2 min-[901px]:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) => `rounded-full px-4 py-3 text-[13px] font-semibold no-underline transition-colors ${isActive ? "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300" : "text-slate-600 hover:bg-slate-100 hover:text-rose-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-300"}`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 max-[900px]:gap-0">
            <ThemeToggle />
            <Link
              to="/dashboard/login"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 no-underline transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-800 max-[900px]:hidden dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-800 dark:hover:bg-rose-950 dark:hover:text-rose-300"
              aria-label="Secure admin login"
              title="Admin login"
            >
              <LockClosedIcon className="h-4 w-4" aria-hidden="true" /> Admin Login
            </Link>
            {isLoggedIn ? (
              <button type="button" className="border-0 bg-transparent px-2 text-[13px] font-semibold text-slate-600 hover:text-rose-700 max-[900px]:hidden dark:text-slate-300 dark:hover:text-rose-300" onClick={handleLogout}>Sign out</button>
            ) : (
              <Link to="/login" className="px-2 text-[13px] font-semibold text-slate-600 no-underline hover:text-rose-700 max-[900px]:hidden dark:text-slate-300 dark:hover:text-rose-300">Sign in</Link>
            )}
            <Link to="/cart" className="inline-flex min-h-[43px] items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 text-xs font-bold text-rose-900 no-underline transition hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-100 max-[900px]:w-[43px] max-[900px]:justify-center max-[900px]:px-0 max-sm:min-h-[39px] max-sm:w-[39px] dark:border-rose-900 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900">
              <ShoppingBagIcon className="h-[17px] w-[17px]" aria-hidden="true" />
              <span className="max-[900px]:hidden">Bag</span>
            </Link>
          </div>
        </nav>
      </header>

      <Dialog open={open} onClose={setOpen} className="relative z-[70]">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="flex w-[min(88vw,390px)] flex-col bg-stone-50 shadow-2xl shadow-black/20 dark:bg-slate-900">
            <div className="flex min-h-[86px] items-center justify-between border-b border-slate-200 px-5 dark:border-slate-700">
              <Brand onClick={closeMenu} />
              <button type="button" className="grid h-[42px] w-[42px] place-items-center rounded-full border border-slate-200 bg-white dark:bg-slate-900 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" onClick={closeMenu} aria-label="Close menu">
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-2 p-5">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) => `flex items-center justify-between rounded-2xl p-4 font-serif text-lg no-underline transition ${isActive ? "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200" : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  {item.name}<ArrowRightIcon className="h-5 w-5 text-rose-700 dark:text-rose-300" aria-hidden="true" />
                </NavLink>
              ))}
              <Link to="/cart" onClick={closeMenu} className="flex items-center justify-between rounded-2xl p-4 font-serif text-lg text-slate-800 no-underline hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                Your bag <ShoppingBagIcon className="h-5 w-5 text-rose-700 dark:text-rose-300" aria-hidden="true" />
              </Link>
              <Link to="/dashboard/login" onClick={closeMenu} className="flex items-center justify-between rounded-2xl p-4 text-slate-800 no-underline hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                <span className="inline-flex items-center gap-2 font-semibold"><LockClosedIcon className="h-5 w-5" aria-hidden="true" /> Admin Login</span>
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Secure access</span>
              </Link>
            </div>

            <div className="mt-auto border-t border-slate-200 p-5 dark:border-slate-700">
              {isLoggedIn ? (
                <button type="button" className="block w-full rounded-full bg-rose-600 px-5 py-4 text-center text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition hover:bg-rose-700" onClick={handleLogout}>Sign out</button>
              ) : (
                <Link to="/login" onClick={closeMenu} className="block rounded-full bg-rose-600 px-5 py-4 text-center text-sm font-bold text-white no-underline shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700">Sign in or create account</Link>
              )}
              <p className="mt-4 text-center font-serif text-sm italic text-slate-500 dark:text-slate-400">A little ritual can change the whole day.</p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
