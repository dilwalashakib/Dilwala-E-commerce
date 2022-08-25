import {BrowserRouter, Routes, Route} from "react-router-dom";
import Cart from "./pages/Cart";
import Error from "./pages/Error";
import Home from "./pages/Home";
import 'react-toastify/dist/ReactToastify.css';
import Product from "./pages/Product";
import Shipping from "./pages/Shipping";
import Payment from "./pages/Payment";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import PlaceOrder from "./pages/PlaceOrder";
import Order from "./pages/Order";
import OrderHistory from "./pages/OrderHistory";
import UserProfile from "./pages/UserProfile";
import Search from "./pages/Search";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/search" element={<Search />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/placeorder" element={<PlaceOrder />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="orderhistory" element={<OrderHistory />} />
        <Route path="/products/:slug" element={<Product />} />
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
