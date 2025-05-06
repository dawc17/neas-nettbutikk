import "./index.css";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";

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
const EasterEgg = lazy(() => import("./pages/EasterEgg")); // Lazy load the Easter Egg page

// Remove the old inline Loading component

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/easteregg" element={<EasterEgg />} />{" "}
                {/* Easter Egg route */}
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
