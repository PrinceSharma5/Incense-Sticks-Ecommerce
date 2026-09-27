import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CartPage = () => {
  const navigate = useNavigate();

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const [checkoutData, setCheckoutData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const token = sessionStorage.getItem("userToken");

  const handleCheckoutChange = (e) => {
    const { name, value } = e.target;

    setCheckoutData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchCartProducts = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/cart/fetch-cart-products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Failed to fetch cart");
        return;
      }

      setCartData(json.data || []);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleIncreaseQuantity = async (item) => {
    try {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      setActionLoadingId(item._id);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/cart/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: 1,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Failed to update quantity");
        return;
      }

      toast.success("Quantity increased");
      fetchCartProducts();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleDecreaseQuantity = async (item) => {
    try {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      if (item.quantity <= 1) {
        toast.error("Minimum quantity is 1. Use remove button to delete.");
        return;
      }

      setActionLoadingId(item._id);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/cart/reduce-from-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            product_id: item.product_id,
            quantity: 1,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Failed to reduce quantity");
        return;
      }

      toast.success("Quantity decreased");
      fetchCartProducts();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleRemoveProduct = async (item) => {
    try {
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const confirmRemove = window.confirm(
        "Are you sure you want to remove this product from cart?"
      );

      if (!confirmRemove) return;

      setActionLoadingId(item._id);

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/cart/remove-from-cart`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            product_id: item.product_id,
          }),
        }
      );

      const json = await response.json();

      if (!json.success) {
        toast.error(json.message || "Failed to remove product");
        return;
      }

      toast.success("Product removed from cart");
      fetchCartProducts();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setActionLoadingId("");
    }
  };

  const cartSummary = useMemo(() => {
    const subtotal = cartData.reduce((total, item) => {
      return total + Number(item.product_price || 0) * Number(item.quantity || 0);
    }, 0);

    const gst = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + gst;

    const totalItems = cartData.reduce((total, item) => {
      return total + Number(item.quantity || 0);
    }, 0);

    return {
      subtotal,
      gst,
      grandTotal,
      totalItems,
    };
  }, [cartData]);

  const handleProceedCheckout =async () => {
    if (cartData.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!checkoutData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!checkoutData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!checkoutData.mobile_no.trim()) {
      toast.error("Please enter your mobile number");
      return;
    }

    if (!checkoutData.address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    if (!checkoutData.city.trim()) {
      toast.error("Please enter your city");
      return;
    }

    if (!checkoutData.state.trim()) {
      toast.error("Please enter your state");
      return;
    }

    if (!checkoutData.pincode.trim()) {
      toast.error("Please enter your pincode");
      return;
    }

    if (checkoutData.mobile_no.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return;
    }

    if (checkoutData.pincode.length !== 6) {
      toast.error("Pincode must be 6 digits");
      return;
    }


    const response=await fetch(`${import.meta.env.VITE_BASE_URL}/api/order/create-user-order`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "token":sessionStorage.getItem("userToken")
      }
    })

    const json=await response.json()
    console.log(json);

    if(json.success){
      const options = {
    "key": import.meta.env.VITE_RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
    "amount": json.order.amount, // Amount is in currency subunits. 
    "currency": "INR",
    "name": "Raghu Rash Insence Sticks",
  
    "image": "https://example.com/your_logo",
    "order_id": json.order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": async function (response){

      const verifyresponse=await fetch(`${import.meta.env.VITE_BASE_URL}/api/order/verify-user-order`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":sessionStorage.getItem("userToken")
        },body:JSON.stringify({
          name:checkoutData.name,
          email:checkoutData.email,
          mobile_no:checkoutData.mobile_no,
          address:checkoutData.address,
          pincode:checkoutData.pincode,
          state:checkoutData.state,
          city:checkoutData.city,
          total_amount:cartSummary.grandTotal,
          razorpay_order_id:response.razorpay_order_id,
          razorpay_payment_id:response.razorpay_payment_id,
          razorpay_signature:response.razorpay_signature
        })
      })

      const json=await verifyresponse.json()

      if(json.success){
        navigate("/payment-success")
      }
      else{
        toast.error(json.message)
      }
      
      
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
    },
    "prefill": {
        "name": checkoutData.name,
        "email": checkoutData.email,
        "contact": "+91"+ checkoutData.mobile_no
    },
    "notes": {
        "address": checkoutData.address + " " + checkoutData.city + " " + checkoutData.state + " " + checkoutData.pincode
    },
    "theme": {
        "color": "#3399cc"
    }


};


var rzp1 = new Razorpay(options);
rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});
rzp1.open();
    }
    

    const orderPayload = {
      total_amount: cartSummary.grandTotal,
      name: checkoutData.name,
      email: checkoutData.email,
      mobile_no: checkoutData.mobile_no,
      address: checkoutData.address,
      city: checkoutData.city,
      state: checkoutData.state,
      pincode: checkoutData.pincode,
      cart_items: cartData,
    };

    console.log("Order Payload:", orderPayload);

    toast.success("Checkout data ready");

    // Later call your order/payment API here
    // navigate("/checkout", { state: orderPayload });
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 h-10 w-48 animate-pulse rounded-xl bg-orange-100" />

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-[1.7rem] bg-orange-100"
                />
              ))}
            </div>

            <div className="h-[600px] animate-pulse rounded-[1.7rem] bg-orange-100" />
          </div>
        </section>
      </main>
    );
  }

  return (

    <>

    <Navbar/>
   <Toaster/>
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 rounded-full border border-orange-200 bg-white px-5 py-2.5 text-xs font-bold text-orange-700 shadow-sm transition hover:bg-orange-50"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-black text-gray-950 sm:text-4xl">
              My Cart
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review your selected products and fill delivery details.
            </p>
          </div>

          <div className="rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-wider text-orange-600 shadow-sm">
            {cartSummary.totalItems} Items
          </div>
        </div>

        {cartData.length === 0 ? (
          <div className="rounded-[2rem] border border-orange-100 bg-white px-6 py-20 text-center shadow-xl shadow-orange-100/70">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-3xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-black text-gray-950">
              Your cart is empty
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart and come back here.
            </p>

            <button
              onClick={() => navigate("/search-product")}
              className="mt-7 rounded-2xl bg-orange-600 px-7 py-3.5 text-xs font-black text-white shadow-lg shadow-orange-600/25 transition hover:bg-orange-700"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <div className="space-y-4">
              {cartData.map((item) => {
                const itemPrice = Number(item.product_price || 0);
                const itemQuantity = Number(item.quantity || 0);
                const itemTotal = itemPrice * itemQuantity;
                const isActionLoading = actionLoadingId === item._id;

                return (
                  <article
                    key={item._id}
                    className="overflow-hidden rounded-[1.7rem] border border-orange-100 bg-white shadow-lg shadow-orange-100/60 transition hover:shadow-xl hover:shadow-orange-100"
                  >
                    <div className="grid gap-4 p-4 sm:grid-cols-[130px_1fr] sm:p-5">
                      <div className="overflow-hidden rounded-2xl bg-orange-50">
                        <img
                          src={
                            item.product_image ||
                            "https://placehold.co/300x300?text=No+Image"
                          }
                          alt={item.product_title}
                          className="h-36 w-full object-cover transition duration-500 hover:scale-105 sm:h-full"
                        />
                      </div>

                      <div className="flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h2 className="line-clamp-2 text-lg font-black text-gray-950">
                                {item.product_title}
                              </h2>

                              <p className="mt-1 text-xs font-semibold text-gray-400">
                                Product ID: {String(item.product_id).slice(-8)}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveProduct(item)}
                              disabled={isActionLoading}
                              className="w-fit rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isActionLoading ? "Wait..." : "Remove"}
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
                              ₹{itemPrice.toLocaleString("en-IN")}
                            </span>

                            <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">
                              Total: ₹{itemTotal.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex w-fit items-center overflow-hidden rounded-2xl border border-orange-200 bg-orange-50">
                            <button
                              type="button"
                              onClick={() => handleDecreaseQuantity(item)}
                              disabled={isActionLoading || itemQuantity <= 1}
                              className="h-11 w-11 text-lg font-black text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              −
                            </button>

                            <div className="flex h-11 w-16 items-center justify-center border-x border-orange-200 bg-white text-sm font-black text-gray-950">
                              {itemQuantity}
                            </div>

                            <button
                              type="button"
                              onClick={() => handleIncreaseQuantity(item)}
                              disabled={isActionLoading}
                              className="h-11 w-11 text-lg font-black text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/product/${item.product_id}`)
                            }
                            className="w-fit rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-xs font-black text-orange-700 transition hover:bg-orange-100"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="h-fit rounded-[1.7rem] border border-orange-100 bg-white p-5 shadow-2xl shadow-orange-100/70 lg:sticky lg:top-6">
              <h2 className="text-xl font-black text-gray-950">
                Checkout Details
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Fill delivery details before checkout.
              </p>

              <div className="mt-5 space-y-3">
                <InputField
                  label="Name"
                  name="name"
                  value={checkoutData.name}
                  onChange={handleCheckoutChange}
                  placeholder="Enter full name"
                />

                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={checkoutData.email}
                  onChange={handleCheckoutChange}
                  placeholder="Enter email address"
                />

                <InputField
                  label="Mobile Number"
                  name="mobile_no"
                  value={checkoutData.mobile_no}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCheckoutData((prev) => ({
                      ...prev,
                      mobile_no: value.slice(0, 10),
                    }));
                  }}
                  placeholder="Enter mobile number"
                />

                <div>
                  <label className="mb-1.5 block text-xs font-black text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={checkoutData.address}
                    onChange={handleCheckoutChange}
                    placeholder="Enter complete address"
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <InputField
                    label="City"
                    name="city"
                    value={checkoutData.city}
                    onChange={handleCheckoutChange}
                    placeholder="City"
                  />

                  <InputField
                    label="State"
                    name="state"
                    value={checkoutData.state}
                    onChange={handleCheckoutChange}
                    placeholder="State"
                  />
                </div>

                <InputField
                  label="Pincode"
                  name="pincode"
                  value={checkoutData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCheckoutData((prev) => ({
                      ...prev,
                      pincode: value.slice(0, 6),
                    }));
                  }}
                  placeholder="Enter pincode"
                />
              </div>

              <div className="mt-6 rounded-2xl bg-orange-50 p-4">
                <h3 className="text-sm font-black text-gray-950">
                  Order Summary
                </h3>

                <div className="mt-4 space-y-3">
                  <SummaryRow
                    label="Total Items"
                    value={cartSummary.totalItems}
                  />

                  <SummaryRow
                    label="Subtotal"
                    value={`₹${cartSummary.subtotal.toLocaleString("en-IN")}`}
                  />

                  <SummaryRow
                    label="GST 5%"
                    value={`₹${cartSummary.gst.toLocaleString("en-IN")}`}
                  />

                  <div className="border-t border-orange-200 pt-3">
                    <SummaryRow
                      label="Total Amount"
                      value={`₹${cartSummary.grandTotal.toLocaleString(
                        "en-IN"
                      )}`}
                      highlight
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="mt-6 w-full rounded-2xl bg-orange-600 px-6 py-4 text-xs font-black text-white shadow-lg shadow-orange-600/25 transition hover:-translate-y-0.5 hover:bg-orange-700"
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                onClick={() => navigate("/search-product")}
                className="mt-3 w-full rounded-2xl border border-orange-200 bg-orange-50 px-6 py-4 text-xs font-black text-orange-700 transition hover:bg-orange-100"
              >
                Continue Shopping
              </button>
            </aside>
          </div>
        )}
      </section>
    </main>
<Footer/>
     </>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-black text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
      />
    </div>
  );
};

const SummaryRow = ({ label, value, highlight }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={`text-sm ${
          highlight ? "font-black text-gray-950" : "font-semibold text-gray-500"
        }`}
      >
        {label}
      </span>

      <span
        className={`${
          highlight
            ? "text-lg font-black text-gray-950"
            : "text-sm font-black text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default CartPage;