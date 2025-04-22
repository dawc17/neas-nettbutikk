import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaHeart,
  FaUser,
  FaUserShield,
  FaSignOutAlt, // Add this for logout icon
} from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Add this import
import { getDatabase, ref, get } from "firebase/database"; // Add this import to fetch user data
import CartOverlay from "./CartOverlay";
import FavoritesOverlay from "./FavoritesOverlay";
import SearchBar from "./SearchBar";
import NavbarButton from "./NavbarButton";
import BarIcon from "./BarIcon";
import AdminButton from "./AdminButton";
import ThemeToggle from "./ThemeToggle"; // Add this import

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCartOverlay, setShowCartOverlay] = useState(false);
  const [showFavoritesOverlay, setShowFavoritesOverlay] = useState(false);
  const { getCartCount, showNotification } = useCart();
  const { currentUser, isAdmin, logout } = useAuth(); // Get auth state and logout function
  const { theme } = useTheme(); // Get current theme
  const cartCount = getCartCount();
  const navigate = useNavigate();

  // Add state for logout notification
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);

  // Add state for user data
  const [userData, setUserData] = useState(null);

  // Rest of your existing states and refs
  const cartTimeoutRef = useRef(null);
  const favoritesTimeoutRef = useRef(null);
  const logoutNotificationTimeoutRef = useRef(null);
  const [isMouseOverCart, setIsMouseOverCart] = useState(false);
  const [isMouseOverCartOverlay, setIsMouseOverCartOverlay] = useState(false);
  const [isMouseOverFavorites, setIsMouseOverFavorites] = useState(false);
  const [isMouseOverFavoritesOverlay, setIsMouseOverFavoritesOverlay] =
    useState(false);

  // Clear all timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
      if (favoritesTimeoutRef.current)
        clearTimeout(favoritesTimeoutRef.current);
      if (logoutNotificationTimeoutRef.current)
        clearTimeout(logoutNotificationTimeoutRef.current);
    };
  }, []);

  // Fetch user data when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setUserData(null);
      return;
    }

    const fetchUserData = async () => {
      try {
        const database = getDatabase();
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // cart overlay
  useEffect(() => {
    if (isMouseOverCart || isMouseOverCartOverlay) {
      setShowCartOverlay(true);
      setShowFavoritesOverlay(false);
      if (cartTimeoutRef.current) clearTimeout(cartTimeoutRef.current);
    } else {
      cartTimeoutRef.current = setTimeout(() => {
        setShowCartOverlay(false);
      }, 300);
    }
  }, [isMouseOverCart, isMouseOverCartOverlay]);

  // favorites overlay
  useEffect(() => {
    if (isMouseOverFavorites || isMouseOverFavoritesOverlay) {
      setShowFavoritesOverlay(true);
      setShowCartOverlay(false);
      if (favoritesTimeoutRef.current)
        clearTimeout(favoritesTimeoutRef.current);
    } else {
      favoritesTimeoutRef.current = setTimeout(() => {
        setShowFavoritesOverlay(false);
      }, 300);
    }
  }, [isMouseOverFavorites, isMouseOverFavoritesOverlay]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutNotification(true);

      // Clear notification after 3 seconds
      logoutNotificationTimeoutRef.current = setTimeout(() => {
        setShowLogoutNotification(false);
      }, 3000);

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Logout Notification */}
      {showLogoutNotification && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2 z-50 animate-fade-in-out">
          Logget ut.
        </div>
      )}

      <div className="bg-navbargray text-black flex flex-wrap items-center justify-between rounded-2xl w-full shadow-lg px-4 md:px-6 py-3 md:py-4 mb-1 relative">
        <a href="/" className="z-10">
          <img
            src={theme === "dark" ? "/neas2.svg" : "/neas.svg"}
            alt="Logo"
            className="h-auto w-16 sm:w-20 md:w-25 hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer"
          />
        </a>

        <div className="lg:hidden z-20 flex items-center">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="text-primary hover:text-primary-content transition-all duration-200 ml-2"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* desktop search bar */}
        <div className="hidden md:block md:w-full lg:w-[40rem] lg:mx-auto lg:px-4 order-3 lg:order-2 mt-3 lg:mt-0">
          <SearchBar />
        </div>

        {/* dektop navigation */}
        <div className="hidden lg:flex items-center order-2 lg:order-3">
          {/* User/Admin Indicators */}
          {currentUser && (
            <>
              {isAdmin ? (
                <Link to="/adminpanel">
                  <div className="mr-4 bg-secondary text-secondary-content text-xs font-bold px-3 py-1 rounded-full flex items-center transition-all duration-200 hover:bg-secondary/80 hover:shadow-sm cursor-pointer">
                    <FaUserShield className="mr-1" />
                    <span>Admin</span>
                  </div>
                </Link>
              ) : (
                <div className="mr-4 bg-secondary text-secondary-content text-xs font-bold px-3 py-1 rounded-full flex items-center">
                  <FaUser className="mr-1" />
                  <span>Innlogget</span>
                </div>
              )}
            </>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div
              className="mr-3 relative"
              onMouseEnter={() => setIsMouseOverFavorites(true)}
              onMouseLeave={() => setIsMouseOverFavorites(false)}
            >
              <Link to="/favorites">
                <BarIcon
                  icon={<FaHeart size={28} className="text-primary" />}
                />
              </Link>
              <div
                className="absolute z-50"
                onMouseEnter={() => setIsMouseOverFavoritesOverlay(true)}
                onMouseLeave={() => setIsMouseOverFavoritesOverlay(false)}
              >
                <FavoritesOverlay
                  isVisible={showFavoritesOverlay}
                  onClose={() => {
                    setIsMouseOverFavoritesOverlay(false);
                    setShowFavoritesOverlay(false);
                  }}
                />
              </div>
            </div>
            <div
              className="mr-3 relative"
              onMouseEnter={() => setIsMouseOverCart(true)}
              onMouseLeave={() => setIsMouseOverCart(false)}
            >
              <Link to="/cart">
                <BarIcon
                  icon={<FaShoppingCart size={28} className="text-primary" />}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                {showNotification && cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 animate-bounce-violent animate-color-change rounded-full w-5 h-5 opacity-75"></span>
                )}
              </Link>
              <div
                className="absolute z-50"
                onMouseEnter={() => setIsMouseOverCartOverlay(true)}
                onMouseLeave={() => setIsMouseOverCartOverlay(false)}
              >
                <CartOverlay
                  isVisible={showCartOverlay}
                  onClose={() => {
                    setIsMouseOverCartOverlay(false);
                    setShowCartOverlay(false);
                  }}
                />
              </div>
            </div>

            {/* Profile icon - always use the icon, no profile pictures */}
            {currentUser && (
              <div className="mr-3 relative">
                <Link to="/profile">
                  <BarIcon
                    icon={<FaUser size={28} className="text-primary" />}
                  />
                </Link>
              </div>
            )}

            <div className="mr-1">
              <a href="https://minside.neas.no/register">
                <NavbarButton
                  text={"Bli kunde ->"}
                  bg={"bg-secondary"}
                  textcolor={"text-secondary-content"}
                  bghover={"hover:bg-secondary/85"}
                />
              </a>
            </div>
            {!currentUser && (
              <div className="ml-1">
                <Link to="/login">
                  <NavbarButton
                    text={"Logg inn ->"}
                    bg={"bg-primary"}
                    textcolor={"text-white"}
                    texthover={"hover:text-accent"}
                    bghover={"hover:bg-primary/85"}
                  />
                </Link>
              </div>
            )}

            {/* Only show these buttons if user is logged in */}
            {currentUser && (
              <div className="ml-3 relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-all duration-200"
                >
                  <FaSignOutAlt size={18} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* mobile search bar */}
        <div className="w-full order-4 mt-3 md:hidden">
          <SearchBar />
        </div>

        {/* mobile navigation */}
        <div
          className={`lg:hidden w-full order-5 transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-screen opacity-100 pt-4 pb-3" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="flex flex-col space-y-3 items-center">
            {/* User/Admin indicator for mobile */}
            {currentUser && (
              <div className="w-full flex items-center justify-center mb-2">
                {isAdmin ? (
                  <Link to="/adminpanel" className="w-full flex justify-center">
                    <div className="bg-secondary text-secondary-content text-xs font-bold px-3 py-1.5 rounded-full flex items-center justify-center w-full transition-all duration-200 hover:bg-secondary/80 cursor-pointer">
                      <FaUserShield className="mr-1" />
                      <span>Logget inn som administrator</span>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-secondary text-secondary-content text-xs font-bold px-3 py-1.5 rounded-full flex items-center justify-center">
                    <FaUser className="mr-1" />
                    <span>Logget inn som bruker</span>
                  </div>
                )}
              </div>
            )}

            {/* Cart link with hover overlay */}
            <div
              className="w-full relative"
              onMouseEnter={() => setIsMouseOverCart(true)}
              onMouseLeave={() => setIsMouseOverCart(false)}
            >
              <Link
                to="/cart"
                className="flex items-center justify-center relative w-full"
              >
                <div className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-base-300 w-full">
                  <FaShoppingCart size={20} className="text-primary" />
                  <span className="ml-2 text-primary">Handlekurv</span>
                  {cartCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <div
                className="absolute left-0 right-0 z-50 mt-1"
                onMouseEnter={() => setIsMouseOverCartOverlay(true)}
                onMouseLeave={() => setIsMouseOverCartOverlay(false)}
              >
                <CartOverlay
                  isVisible={showCartOverlay && mobileMenuOpen}
                  onClose={() => {
                    setIsMouseOverCartOverlay(false);
                    setShowCartOverlay(false);
                  }}
                />
              </div>
            </div>

            {/* Favorites link with hover overlay */}
            <div
              className="w-full relative"
              onMouseEnter={() => setIsMouseOverFavorites(true)}
              onMouseLeave={() => setIsMouseOverFavorites(false)}
            >
              <Link
                to="/favorites"
                className="flex items-center justify-center relative w-full"
              >
                <div className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-base-300 w-full">
                  <FaHeart size={20} className="text-primary" />
                  <span className="ml-2 text-primary">Favoritter</span>
                </div>
              </Link>
              <div
                className="absolute left-0 right-0 z-50 mt-1"
                onMouseEnter={() => setIsMouseOverFavoritesOverlay(true)}
                onMouseLeave={() => setIsMouseOverFavoritesOverlay(false)}
              >
                <FavoritesOverlay
                  isVisible={showFavoritesOverlay && mobileMenuOpen}
                  onClose={() => {
                    setIsMouseOverFavoritesOverlay(false);
                    setShowFavoritesOverlay(false);
                  }}
                />
              </div>
            </div>

            {/* Profile link for mobile - always using icon, no profile pictures */}
            {currentUser && (
              <Link
                to="/profile"
                className="flex items-center justify-center relative w-full"
              >
                <div className="flex items-center justify-center py-2 px-4 rounded-lg hover:bg-base-300 w-full">
                  <FaUser size={20} className="text-primary mr-2" />
                  <span className="text-primary">Min profil</span>
                </div>
              </Link>
            )}

            <a href="https://minside.neas.no/register" className="w-full">
              <NavbarButton
                text={"Bli kunde ->"}
                bg={"bg-secondary"}
                textcolor={"text-secondary-content"}
                bghover={"hover:bg-secondary/85"}
              />
            </a>
            {!currentUser && (
              <Link to="/login" className="w-full">
                <NavbarButton
                  text={"Logg inn ->"}
                  bg={"bg-primary"}
                  textcolor={"text-white"}
                  texthover={"hover:text-accent"}
                  bghover={"hover:bg-primary/85"}
                />
              </Link>
            )}

            {/* Only show logout button if user is logged in */}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center justify-center relative w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                <FaSignOutAlt size={20} className="mr-2" />
                <span>Logg ut</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
