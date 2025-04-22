import "./index.css";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

// Lazy load all pages to reduce initial bundle size
const App = lazy(() => import("./pages/App"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Cart = lazy(() => import("./pages/Cart"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const AdminLogin = lazy(() => import("./components/AdminLogin"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const UserLogin = lazy(() => import("./components/UserLogin"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));

// Loading component for Suspense fallback
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div
        className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2 text-primary">Laster inn...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<UserLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/adminpanel"
                  element={
                    <ProtectedRoute>
                      <AdminPanel />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedUserRoute>
                      <Profile />
                    </ProtectedUserRoute>
                  }
                />
                <Route path="/product/:productId" element={<ProductPage />} />
                <Route
                  path="/category/:categoryId"
                  element={<CategoryPage />}
                />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
