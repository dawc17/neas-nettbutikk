import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue } from "firebase/database";
import { useAuth } from "../context/AuthContext";

import AdminProductForm, {
  CATEGORY_NAMES,
} from "../components/AdminProductForm";
import AdminProductList from "../components/AdminProductList";
import AdminSidebar from "../components/AdminSidebar";
import AdminOrdersView from "../components/AdminOrdersView";
import AdminUsersView from "../components/AdminUsersView";
import AdminStatistics from "../components/AdminStatistics"; // Import the new component
import FooterMain from "../components/Footer";
import Navbar from "../components/Navbar";
import { useProducts } from "../data/ProductsData";

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [productToEdit, setProductToEdit] = useState(null);
  const { products, loading } = useProducts();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch pending orders
  useEffect(() => {
    if (activeSection !== "dashboard" && activeSection !== "pendingOrders")
      return;

    setLoadingOrders(true);
    const database = getDatabase();
    const ordersRef = ref(database, "orders");

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          // Filter orders with status "pending"
          const pendingOrdersArray = Object.values(ordersData).filter(
            (order) => order.status === "pending"
          );

          setPendingOrders(pendingOrdersArray);
        } else {
          setPendingOrders([]);
        }
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error fetching pending orders:", error);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, [activeSection]);

  // Function to handle completion of product editing
  const handleEditComplete = () => {
    setProductToEdit(null);
    setActiveSection("editProducts");
  };

  // Function to render the appropriate content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "addProduct":
        return <AdminProductForm />;
      case "editProduct":
        return (
          <AdminProductForm
            productToEdit={productToEdit}
            onEditComplete={handleEditComplete}
          />
        );
      case "editProducts":
        return <AdminProductList onEditFullProduct={handleEditFullProduct} />;
      case "viewOrders":
      case "pendingOrders":
        return (
          <AdminOrdersView
            filterStatus={activeSection === "pendingOrders" ? "pending" : null}
          />
        );
      case "viewUsers":
        return <AdminUsersView />;
      case "analytics":
        return <AdminStatistics />;
      case "dashboard":
      default:
        return (
          <>
            <p className="font-mabrylight text-primary mb-4">
              Velg en funksjon fra sidemenyen for å administrere nettbutikken.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <h3 className="font-mabry text-primary text-lg mb-2">
                  Produkter
                </h3>
                <p className="font-mabrylight text-primary">
                  {loading
                    ? "Laster..."
                    : `${products.length} aktive produkter`}
                </p>
              </div>

              <div className="bg-secondary/20 rounded-lg p-4 text-center">
                <h3 className="font-mabry text-primary text-lg mb-2">Ordrer</h3>
                <p className="font-mabrylight text-primary">
                  {loadingOrders
                    ? "Laster..."
                    : `${pendingOrders.length} ventende ordrer`}
                </p>
              </div>
            </div>
          </>
        );
    }
  };

  // Handle full product editing
  const handleEditFullProduct = (product) => {
    setProductToEdit(product);
    setActiveSection("editProduct");
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex flex-1 p-4 gap-4">
        {/* Sidebar taking 1/4 of the width */}
        <div className="w-full lg:w-1/4">
          <AdminSidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Main content area */}
        <div className="w-full lg:w-3/4 bg-neutral rounded-lg p-6 shadow-md">
          <h1 className="text-2xl font-mabry text-primary mb-6">
            {activeSection === "dashboard"
              ? "Dashboard"
              : activeSection === "addProduct"
                ? "Legg til produkt"
                : activeSection === "editProduct"
                  ? "Rediger produkt"
                  : activeSection === "editProducts"
                    ? "Rediger produkter"
                    : activeSection === "viewOrders"
                      ? "Vis ordrer"
                      : activeSection === "pendingOrders"
                        ? "Ventende ordrer"
                        : activeSection === "viewUsers"
                          ? "Vis brukere"
                          : activeSection === "analytics"
                            ? "Analytics"
                            : "Admin Panel"}
          </h1>

          <div className="bg-base-100 rounded-lg p-6 shadow-sm">
            {renderContent()}
          </div>
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default AdminPanel;
