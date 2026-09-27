import { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";

export default function OrderDetails({
  data,
  search,
  handleSearch,
  skip,
  fetchData,
  hasMore,
  loading,
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] px-4 py-6 text-white sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-140px] top-[-140px] h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-[-180px] left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-lg shadow-emerald-300/70" />
                Order Dashboard
              </div>

              <h1 className="mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                Manage Orders
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                View customer orders, address, payment details and all ordered
                products from one dashboard table.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Loaded Orders
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {data.length}
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Status
                </p>
                <p className="mt-3 text-lg font-black text-emerald-300">
                  {loading ? "Loading..." : "Ready"}
                </p>
                <p className="mt-1 text-xs text-slate-400">Order records</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8">
            <div className="relative mx-auto max-w-3xl">
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 opacity-30 blur-xl" />

              <div className="relative flex items-center overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl shadow-black/20">
                <div className="pl-5 text-slate-400">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>

                <input
                  id="search"
                  name="search"
                  type="search"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name, email, mobile, address, city, payment id..."
                  className="h-16 w-full bg-transparent px-4 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>

              {search && (
                <p className="mt-4 text-center text-sm text-slate-400">
                  Searching for{" "}
                  <span className="font-black text-emerald-300">
                    "{search}"
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <InfiniteScroll
          pageStart={0}
          hasMore={hasMore && !loading}
          loadMore={() => fetchData(search, skip)}
          loader={
            <div key="loader" className="flex justify-center py-10">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-emerald-400" />
                <p className="text-sm font-semibold text-slate-400">
                  Loading orders...
                </p>
              </div>
            </div>
          }
        >
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-[2200px] divide-y divide-white/10">
                <thead className="bg-white/[0.07]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      S.No.
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      User ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Name
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Email
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Mobile No.
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Address
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      City
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      State
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Pincode
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Payment ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Razorpay Order ID
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Signature
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Products
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Total Qty
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Total Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Created At
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-black uppercase tracking-wider text-slate-300">
                      Updated At
                    </th>

                    <th className="sticky right-0 bg-slate-900 px-5 py-4 text-right text-xs font-black uppercase tracking-wider text-slate-300">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {data.map((item, index) => {
                    const totalQuantity =
                      item.order_details?.reduce(
                        (sum, product) =>
                          sum + Number(product.product_quantity || 0),
                        0
                      ) || 0;

                    return (
                      <tr
                        key={item._id || index}
                        className="group transition hover:bg-white/[0.06]"
                      >
                        <td className="whitespace-nowrap px-5 py-5 text-sm font-bold text-slate-300">
                          #{index + 1}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="inline-flex max-w-[180px] truncate rounded-full border border-slate-400/20 bg-slate-400/10 px-3 py-1.5 text-xs font-bold text-slate-300">
                            {item.user_id || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/10 text-sm font-black text-emerald-300">
                              {item.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>

                            <div>
                              <p className="text-sm font-black text-white">
                                {item.name || "N/A"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Customer
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {item.email || "N/A"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {item.mobile_no || "N/A"}
                        </td>

                        <td className="max-w-[300px] px-5 py-5">
                          <p className="line-clamp-2 text-sm leading-6 text-slate-300">
                            {item.address || "N/A"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {item.city || "N/A"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {item.state || "N/A"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {item.pincode || "N/A"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="inline-flex max-w-[200px] truncate rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-300">
                            {item.razorpay_payment_id || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="inline-flex max-w-[200px] truncate rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1.5 text-xs font-bold text-indigo-300">
                            {item.razorpay_order_id || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="inline-flex max-w-[220px] truncate rounded-full border border-fuchsia-400/20 bg-fuchsia-400/10 px-3 py-1.5 text-xs font-bold text-fuchsia-300">
                            {item.razorpay_signature || "N/A"}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-black text-orange-300">
                            {item.order_details?.length || 0} Items
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-black text-cyan-300">
                          {totalQuantity}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5">
                          <p className="text-lg font-black text-emerald-300">
                            ₹{item.total_amount || 0}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-300">
                          {formatDate(item.updatedAt)}
                        </td>

                        <td className="sticky right-0 bg-slate-900 px-5 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(item)}
                            className="rounded-2xl bg-white px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg transition hover:bg-emerald-100"
                          >
                            Show Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </InfiniteScroll>

        {/* Empty State */}
        {!loading && data.length === 0 && (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-16 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-4xl">
              🛒
            </div>

            <h2 className="text-3xl font-black text-white">
              No orders found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              No order matched your search. Try another keyword.
            </p>
          </div>
        )}

        {!hasMore && data.length > 0 && (
          <div className="mt-10 text-center">
            <p className="inline-flex rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-bold text-slate-300 shadow-sm backdrop-blur">
              No more orders available
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-md">
          <div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl shadow-black/40">
            {/* Modal Header */}
            <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 px-5 py-5 sm:px-8">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative flex items-start justify-between gap-5">
                <div>
                  <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
                    Order Details
                  </span>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {selectedOrder.name || "Customer Order"}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                    Full order information, customer details, payment details
                    and ordered products.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl font-bold text-white transition hover:bg-white hover:text-slate-950"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="max-h-[calc(92vh-135px)] overflow-y-auto bg-slate-50 p-5 sm:p-8">
              {/* Customer + Payment Info */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-black text-slate-950">
                    Customer Information
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <InfoRow label="Name" value={selectedOrder.name} />
                    <InfoRow label="Email" value={selectedOrder.email} />
                    <InfoRow
                      label="Mobile No."
                      value={selectedOrder.mobile_no}
                    />
                    <InfoRow label="User ID" value={selectedOrder.user_id} />
                    <InfoRow
                      label="Address"
                      value={`${selectedOrder.address || ""} ${
                        selectedOrder.city || ""
                      } ${selectedOrder.state || ""} ${
                        selectedOrder.pincode || ""
                      }`}
                    />
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-black text-slate-950">
                    Payment Information
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <InfoRow
                      label="Payment ID"
                      value={selectedOrder.razorpay_payment_id}
                    />
                    <InfoRow
                      label="Razorpay Order ID"
                      value={selectedOrder.razorpay_order_id}
                    />
                    <InfoRow
                      label="Signature"
                      value={selectedOrder.razorpay_signature}
                    />
                    <InfoRow
                      label="Total Amount"
                      value={`₹${selectedOrder.total_amount || 0}`}
                    />
                    <InfoRow
                      label="Created At"
                      value={formatDate(selectedOrder.createdAt)}
                    />
                    <InfoRow
                      label="Updated At"
                      value={formatDate(selectedOrder.updatedAt)}
                    />
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      Ordered Products
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      All products included in this order.
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-black text-emerald-700">
                    {selectedOrder.order_details?.length || 0} Products
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-[900px] divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Image
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Product ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Product Title
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">
                          Subtotal
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {selectedOrder.order_details?.map((product, index) => (
                        <tr key={product._id || index}>
                          <td className="px-4 py-4">
                            <img
                              src={product.product_image}
                              alt={product.product_title}
                              className="h-16 w-16 rounded-2xl object-cover"
                            />
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-flex max-w-[180px] truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                              {product.product_id || "N/A"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm font-black text-slate-900">
                            {product.product_title || "N/A"}
                          </td>

                          <td className="px-4 py-4 text-sm font-bold text-slate-700">
                            ₹{product.product_price || 0}
                          </td>

                          <td className="px-4 py-4 text-sm font-bold text-slate-700">
                            {product.product_quantity || 0}
                          </td>

                          <td className="px-4 py-4 text-sm font-black text-emerald-600">
                            ₹
                            {Number(product.product_price || 0) *
                              Number(product.product_quantity || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(!selectedOrder.order_details ||
                  selectedOrder.order_details.length === 0) && (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                    <p className="text-sm font-bold text-slate-600">
                      No product details found.
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 mt-6 flex justify-end border-t border-slate-200 bg-slate-50 pt-5">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="h-12 rounded-2xl bg-slate-950 px-8 text-sm font-black text-white transition hover:bg-slate-800"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold text-slate-800">
        {value || "N/A"}
      </p>
    </div>
  );
}