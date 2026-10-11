import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import Home from "./pages/Home";
import DashboardHome from "./pages/dashboard/Home";
import LoginAdmin from "./components/dashboard/LoginAdmin";
import CategoryControl from "./pages/dashboard/CategoryControl";
import ProductControl from "./pages/dashboard/ProductControl";
import FetchProduct from "./pages/dashboard/FetchProduct";
import Order from "./pages/dashboard/Order";
import CouponCode from "./pages/dashboard/CouponCode";
import SearchProductPage from "./pages/SearchProductPage";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Product_Page from "./pages/Product_Page";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ChatAssistant from "./components/ChatAssistant";

const StorefrontAssistant = () => {
  const { pathname } = useLocation();

  if (pathname.startsWith("/dashboard")) return null;

  return <ChatAssistant />;
};

const App = () => (
  <BrowserRouter>
    <div className="rr-site">
      <Routes>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/login" element={<LoginAdmin />} />
        <Route path="/dashboard/category-control" element={<CategoryControl />} />
        <Route path="/dashboard/product-control" element={<ProductControl />} />
        <Route path="/dashboard/fetch-products" element={<FetchProduct />} />
        <Route path="/dashboard/fetch-orders" element={<Order />} />
        <Route path="/dashboard/create-coupon-code" element={<CouponCode />} />
        <Route path="/" element={<Home />} />
        <Route path="/fetch-products" element={<SearchProductPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product-page/:id" element={<Product_Page />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
      <StorefrontAssistant />
    </div>
  </BrowserRouter>
);

export default App;
