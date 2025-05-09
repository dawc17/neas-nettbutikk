import { useState } from "react";
import {
  FaBox,
  FaChartLine,
  FaCog,
  FaClipboardList,
  FaEdit,
  FaPlus,
  FaChevronDown,
  FaChevronRight,
  FaSignOutAlt, // Add this import for the logout icon
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook
import { useNavigate } from "react-router-dom"; // Import useNavigate

function AdminSidebar({ activeSection, onSectionChange }) {
  const [expandedMenus, setExpandedMenus] = useState({
    products: true,
    orders: false,
    customers: false,
    settings: false,
  });
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleMenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const handleSectionClick = (section) => {
    onSectionChange(section);
  };

  return (
    <div
      className="h-full bg-primary text-white rounded-lg shadow-xl p-4 overflow-y-auto"
      data-theme="light"
    >
      <div className="mb-8">
        <h2 className="font-mabry text-2xl text-secondary mb-2">Admin Panel</h2>
        <p className="font-mabrylight text-sm text-gray-300">
          Administrer nettbutikken
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {/* Dashboard */}
        <button
          onClick={() => handleSectionClick("dashboard")}
          className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeSection === "dashboard" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
        >
          <FaChartLine className="mr-3 text-secondary" />
          <span className="font-mabry">Dashboard</span>
        </button>

        {/* Products Section */}
        <div>
          <button
            onClick={() => toggleMenu("products")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent-content transition-all duration-200"
          >
            <div className="flex items-center">
              <FaBox className="mr-3 text-secondary" />
              <span className="font-mabry">Produkter</span>
            </div>
            {expandedMenus.products ? (
              <FaChevronDown className="text-secondary" />
            ) : (
              <FaChevronRight className="text-secondary" />
            )}
          </button>

          {expandedMenus.products && (
            <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
              <button
                onClick={() => handleSectionClick("addProduct")}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === "addProduct" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
              >
                <FaPlus className="mr-2 text-sm" />
                <span>Legg til produkt</span>
              </button>
              <button
                onClick={() => handleSectionClick("editProducts")}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === "editProducts" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
              >
                <FaEdit className="mr-2 text-sm" />
                <span>Rediger produkter</span>
              </button>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div>
          <button
            onClick={() => toggleMenu("orders")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent-content transition-all duration-200"
          >
            <div className="flex items-center">
              <FaClipboardList className="mr-3 text-secondary" />
              <span className="font-mabry">Ordrer</span>
            </div>
            {expandedMenus.orders ? (
              <FaChevronDown className="text-secondary" />
            ) : (
              <FaChevronRight className="text-secondary" />
            )}
          </button>

          {expandedMenus.orders && (
            <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
              <button
                onClick={() => handleSectionClick("viewOrders")}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === "viewOrders" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
              >
                <span>Alle ordrer</span>
              </button>
              <button
                onClick={() => handleSectionClick("pendingOrders")}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === "pendingOrders" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
              >
                <span>Ventende ordrer</span>
              </button>
            </div>
          )}
        </div>

        {/* Analytics Section */}
        <button
          onClick={() => handleSectionClick("analytics")}
          className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${activeSection === "analytics" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
        >
          <FaChartLine className="mr-3 text-secondary" />
          <span className="font-mabry">Statistikk</span>
        </button>

        {/* Settings */}
        <div>
          <button
            onClick={() => toggleMenu("settings")}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent-content transition-all duration-200"
          >
            <div className="flex items-center">
              <FaCog className="mr-3 text-secondary" />
              <span className="font-mabry">Innstillinger</span>
            </div>
            {expandedMenus.settings ? (
              <FaChevronDown className="text-secondary" />
            ) : (
              <FaChevronRight className="text-secondary" />
            )}
          </button>

          {expandedMenus.settings && (
            <div className="pl-10 pr-2 py-2 space-y-1 font-mabrylight">
              <button
                onClick={() => handleSectionClick("viewUsers")}
                className={`w-full flex items-center p-2 rounded-md transition-all duration-200 ${activeSection === "viewUsers" ? "bg-secondary text-primary" : "hover:bg-accent-content"}`}
              >
                <span>Administrer brukere</span>
              </button>
            </div>
          )}
        </div>

        {/* Logout Button - Added at the bottom for easy access */}
        <div className="mt-8 pt-4 border-t border-accent-content">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 rounded-lg bg-red-500/20 hover:bg-red-500/40 transition-all duration-200"
          >
            <FaSignOutAlt className="mr-3 text-red-300" />
            <span className="font-mabry">Logg ut</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default AdminSidebar;
