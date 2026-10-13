import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    const fetchOrders = async () => {
      const token = sessionStorage.getItem("userToken");
      if (!token) {
        navigate("/login", { state: { message: "Please sign in to view your orders." } });
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/order/fetch-my-orders`, {
          headers: { token },
        });
        const result = await response.json();

        if (response.status === 401) {
          sessionStorage.removeItem("userToken");
          navigate("/login", { state: { message: result.message || "Please sign in again." } });
          return;
        }
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load your orders.");
        }
        if (isCurrent) setOrders(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        if (isCurrent) toast.error(error.message || "Could not load your orders.");
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    void fetchOrders();
    return () => { isCurrent = false; };
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Toaster position="top-right" />
      <main className="min-h-screen bg-stone-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-5xl" data-voice-section="your recent orders">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700 dark:text-rose-300">Account</p>
              <h1 className="mt-2 text-3xl font-black sm:text-4xl">My Orders</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your five most recent paid orders.</p>
            </div>
            <button type="button" onClick={() => navigate("/fetch-products")} className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700">
              Continue Shopping
            </button>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">Loading your orders...</div>
          ) : orders.length ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <article key={order._id} className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-7">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Order {order._id}</p>
                      <h2 className="mt-1 text-lg font-black">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Recent order"}</h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Paid</p>
                      <p className="mt-1 text-xl font-black text-rose-700 dark:text-rose-300">₹{Number(order.total_amount || 0).toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <p className="text-sm font-bold">Items</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                      {(order.order_details || []).map((item, index) => (
                        <li key={`${order._id}-${index}`}>{item.product_title} × {item.product_quantity}</li>
                      ))}
                    </ul>
                    {order.razorpay_payment_id && (
                      <p className="mt-4 break-all text-xs text-slate-400">Payment ID: {order.razorpay_payment_id}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-rose-100 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-black">No orders yet</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Paid orders will appear here after checkout.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default MyOrders;
