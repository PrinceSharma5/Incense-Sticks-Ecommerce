import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <>
    <Navbar/>
    <main className="min-h-screen bg-stone-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh_-_64px)] max-w-5xl items-center justify-center">
        <div className="w-full overflow-hidden rounded-[2rem] border border-rose-100 bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-rose-100/70 backdrop-blur">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative overflow-hidden bg-rose-900 p-8 text-white sm:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 dark:bg-slate-900/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 dark:bg-slate-900/10 blur-2xl" />

              <div className="relative z-10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 dark:bg-slate-900/20 shadow-lg backdrop-blur">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-rose-100">
                  Payment Successful
                </p>

                <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                  Thank you for your order!
                </h1>

                <p className="mt-4 max-w-lg text-sm leading-7 text-rose-50 sm:text-base">
                  Your payment has been received successfully. Your order is now
                  confirmed and will be processed soon.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <TrustCard title="Secure" text="Payment received" />
                  <TrustCard title="Confirmed" text="Order placed" />
                  <TrustCard title="Fast" text="Quick updates" />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="rounded-[1.7rem] border border-rose-100 bg-rose-50/60 p-5">
                <h2 className="text-lg font-black text-slate-950 dark:text-slate-100">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-4">
                  <SummaryRow label="Order ID" value="ORD-20260607-001" />
                  <SummaryRow label="Payment ID" value="PAY-4F8K9L2M" />
                  <SummaryRow label="Customer Name" value="Lokesh Kumar" />
                  <SummaryRow label="Email" value="lokesh@example.com" />
                  <SummaryRow label="Mobile" value="9876543210" />
                  <SummaryRow
                    label="Address"
                    value="F-113, Palm Green, Ahmedabad, Gujarat - 380051"
                  />

                  <div className="border-t border-rose-200 dark:border-rose-900 pt-4">
                    <SummaryRow
                      label="Total Amount"
                      value="₹1,499"
                      highlight
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[1.7rem] border border-slate-100 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-950 dark:text-slate-100">
                  What happens next?
                </h3>

                <div className="mt-4 space-y-3">
                  <Step text="Your order has been confirmed." />
                  <Step text="Our team will start processing it." />
                  <Step text="You will receive updates for your order status." />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="rounded-2xl bg-rose-600 px-6 py-4 text-xs font-black text-white shadow-lg shadow-rose-900/20 transition hover:-translate-y-0.5 hover:bg-rose-700"
                >
                  Continue Shopping
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/my-orders")}
                  className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 px-6 py-4 text-xs font-black text-rose-700 dark:text-rose-300 transition hover:bg-rose-100"
                >
                  View My Orders
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-6 py-4 text-xs font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
<Footer/>
    </>

  );
};

const SummaryRow = ({ label, value, highlight = false }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <span
        className={`text-sm ${
          highlight ? "font-black text-slate-950 dark:text-slate-100" : "font-semibold text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`max-w-[60%] text-right ${
          highlight
            ? "text-lg font-black text-rose-700 dark:text-rose-300"
            : "text-sm font-bold text-slate-900 dark:text-slate-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

const Step = ({ text }) => {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900 px-4 py-3">
      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-black text-rose-700 dark:text-rose-300">
        ✓
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{text}</p>
    </div>
  );
};

const TrustCard = ({ title, text }) => {
  return (
    <div className="rounded-2xl bg-white/15 dark:bg-slate-900/15 p-4 backdrop-blur">
      <p className="text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs font-medium text-rose-50">{text}</p>
    </div>
  );
};

export default PaymentSuccessPage;
