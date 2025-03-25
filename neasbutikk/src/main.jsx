import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./pages/App";
import SearchResults from "./pages/SearchResults";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import UserLogin from "./components/UserLogin";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/adminpanel" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedUserRoute> {/* We'll create this component next */}
                <Profile />
              </ProtectedUserRoute>
            } />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
