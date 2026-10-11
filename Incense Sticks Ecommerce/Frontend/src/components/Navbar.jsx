import { useMemo, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import {
  ArrowRightIcon,
  Bars3Icon,
  LockClosedIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useNavigate } from "react-router";
import ClockBuddy from "./ClockBuddy";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Our collection", href: "/fetch-products" },
];

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
    <div className="rr-nav-wrap">
      <div className="rr-announcement">
        <span className="rr-announcement-star" aria-hidden="true">✳</span>
        <p>Find a slower kind of calm <span>·</span> Crafted for your everyday rituals</p>
        <Link to="/fetch-products">Explore the collection <ArrowRightIcon aria-hidden="true" /></Link>
      </div>

      <header className="rr-navbar">
        <nav className="rr-nav-inner" aria-label="Main navigation">
          <button
            type="button"
            className="rr-mobile-menu-button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Bars3Icon aria-hidden="true" />
          </button>

          <Link to="/" className="rr-brand" aria-label="Aura & Ember home">
            <span className="rr-brand-mark" aria-hidden="true"><span>A</span><i /></span>
            <span className="rr-brand-copy">
              <span className="rr-brand-name">Aura &amp; Ember</span>
              <span className="rr-brand-tagline">A little calm, every day</span>
            </span>
          </Link>

          <div className="rr-desktop-nav">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) => `rr-nav-link ${isActive ? "is-active" : ""}`}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="rr-nav-actions">
            <ClockBuddy />
            <Link
              to="/dashboard/login"
              className="rr-admin-link"
              aria-label="Secure admin login"
              title="Admin login"
            >
              <LockClosedIcon aria-hidden="true" />
              <span>Admin Login</span>
            </Link>
            {isLoggedIn ? (
              <button type="button" className="rr-nav-text-button" onClick={handleLogout}>
                Sign out
              </button>
            ) : (
              <Link to="/login" className="rr-nav-text-button">Sign in</Link>
            )}
            <Link to="/cart" className="rr-cart-link">
              <ShoppingBagIcon aria-hidden="true" />
              <span>Bag</span>
            </Link>
          </div>
        </nav>
      </header>

      <Dialog open={open} onClose={setOpen} className="rr-mobile-dialog">
        <DialogBackdrop className="rr-mobile-backdrop" />
        <div className="rr-mobile-dialog-frame">
          <DialogPanel className="rr-mobile-panel">
            <div className="rr-mobile-panel-top">
              <Link to="/" className="rr-brand" onClick={closeMenu}>
                <span className="rr-brand-mark" aria-hidden="true"><span>A</span><i /></span>
                <span className="rr-brand-copy">
                  <span className="rr-brand-name">Aura &amp; Ember</span>
                  <span className="rr-brand-tagline">A little calm, every day</span>
                </span>
              </Link>
              <button type="button" className="rr-mobile-close" onClick={closeMenu} aria-label="Close menu">
                <XMarkIcon aria-hidden="true" />
              </button>
            </div>

            <div className="rr-mobile-links">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) => `rr-mobile-link ${isActive ? "is-active" : ""}`}
                >
                  {item.name}<ArrowRightIcon aria-hidden="true" />
                </NavLink>
              ))}
              <Link to="/cart" onClick={closeMenu} className="rr-mobile-link">
                Your bag<ShoppingBagIcon aria-hidden="true" />
              </Link>
              <Link
                to="/dashboard/login"
                onClick={closeMenu}
                className="rr-mobile-link rr-mobile-admin-link"
              >
                <span className="rr-mobile-admin-copy">
                  <LockClosedIcon aria-hidden="true" />
                  <span>Admin Login</span>
                </span>
                <span className="rr-admin-label">Secure access</span>
              </Link>
            </div>

            <div className="rr-mobile-account">
              {isLoggedIn ? (
                <button type="button" className="rr-mobile-account-button" onClick={handleLogout}>Sign out</button>
              ) : (
                <Link to="/login" onClick={closeMenu} className="rr-mobile-account-button">Sign in or create account</Link>
              )}
              <p>A little ritual can change the whole day.</p>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
