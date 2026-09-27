import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import DashboardHome from './pages/dashboard/Home'
import LoginAdmin from './components/dashboard/LoginAdmin'
import CategoryControl from './pages/dashboard/CategoryControl'
import ProductControl from './pages/dashboard/ProductControl'
import FetchProduct from './pages/dashboard/fetchProduct'
import Order from './pages/dashboard/Order'
import CouponCode from './pages/dashboard/CouponCode'

import SearchProductPage from './pages/SearchProductPage'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Product_Page from './pages/Product_Page'
import PaymentSuccessPage from './pages/PaymentSuccessPage'




const App = () => {

  

  return (
<>

<BrowserRouter>

<Routes>

  <Route exact path="/dashboard" element={<DashboardHome/>}></Route>
  <Route exact path='/dashboard/login' element={<LoginAdmin/>}></Route>
  <Route exact path='/dashboard/category-control' element={<CategoryControl/>}></Route>
  <Route exact path="/dashboard/product-control" element={<ProductControl/>}></Route>
  <Route exact path="/dashboard/fetch-products" element={<FetchProduct/>}></Route>
  <Route exact path="/dashboard/fetch-orders" element={<Order/>}></Route>
  <Route exact path="/dashboard/create-coupon-code" element={<CouponCode/>}></Route>


  <Route exact path="/" element={<Home/>} ></Route>
  <Route exact path="/fetch-products" element={<SearchProductPage/>}></Route>
  <Route exact path='/login' element={<Login/>}></Route>
  <Route exact path="/cart" element={<Cart/>}></Route>

  <Route exact path='/product-page/:id' element={<Product_Page/>}></Route>
  <Route exact path="/payment-success" element={<PaymentSuccessPage/>}></Route>
</Routes>

</BrowserRouter>
</>
  )
}

export default App