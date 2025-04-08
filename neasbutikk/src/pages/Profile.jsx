import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, get, update, onValue, off } from "firebase/database";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaUserEdit,
  FaShoppingBag,
  FaCircle,
} from "react-icons/fa";
import { formatPrice } from "../utils/priceFormatter";

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add these new state variables
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      setSaveError("Kallenavn kan ikke være tomt.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${currentUser.uid}`);

      // Update the nickname in the user profile
      await update(userRef, {
        nickname: nickname.trim(),
      });

      // Update local user data
      setUserData({
        ...userData,
        nickname: nickname.trim(),
      });

      // Update all reviews by this user
      await updateUserDisplayNameInContent(nickname.trim());

      setIsEditingNickname(false);
    } catch (err) {
      setSaveError("Kunne ikke lagre kallenavnet: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // New function to update user display name in reviews and replies
  const updateUserDisplayNameInContent = async (newNickname) => {
    try {
      const database = getDatabase();

      // First, get all reviews
      const reviewsRef = ref(database, "reviews");
      const reviewsSnapshot = await get(reviewsRef);

      if (!reviewsSnapshot.exists()) return;

      const updates = {};
      const allProducts = reviewsSnapshot.val();

      // Loop through all products
      Object.entries(allProducts).forEach(([productId, productReviews]) => {
        // Loop through all reviews for this product
        Object.entries(productReviews).forEach(([reviewId, review]) => {
          // If this review belongs to the current user, update the userDisplayName
          if (review.userId === currentUser.uid) {
            updates[`reviews/${productId}/${reviewId}/userDisplayName`] =
              newNickname;
          }

          // Check if there are replies and if any belong to this user
          if (review.replies) {
            Object.entries(review.replies).forEach(([replyId, reply]) => {
              if (reply.userId === currentUser.uid) {
                updates[
                  `reviews/${productId}/${reviewId}/replies/${replyId}/userDisplayName`
                ] = newNickname;
              }
            });
          }
        });
      });

      // Apply all updates in one batch
      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
      }
    } catch (error) {
      console.error("Error updating display name in content:", error);
      // Don't throw - we don't want to prevent nickname update if this fails
    }
  };

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const database = getDatabase();
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          setError("Kunne ikke finne brukerdata.");
        }
      } catch (err) {
        setError("Feil ved henting av brukerdata: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || "");
    }
  }, [userData]);

  // Add orders fetching function inside the Profile component
  useEffect(() => {
    // Only fetch orders if user is authenticated
    if (!currentUser) return;

    setLoadingOrders(true);
    setOrderError(null);

    const database = getDatabase();
    const ordersRef = ref(database, "orders");

    // Set up real-time listener for all orders
    // We'll filter them on the client side for the current user
    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();

          // Filter orders that belong to the current user
          const userOrders = Object.values(ordersData)
            .filter(
              (order) => order.customer && order.customer.id === currentUser.uid
            )
            .sort((a, b) => b.createdAt - a.createdAt); // Sort by newest first

          setOrders(userOrders);
        } else {
          setOrders([]);
        }
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setOrderError("Kunne ikke hente bestillingene: " + error.message);
        setLoadingOrders(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      off(ordersRef);
    };
  }, [currentUser]);

  // Function to get status display info
  const getOrderStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          text: "Venter på behandling",
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
        };
      case "processing":
        return {
          text: "Under behandling",
          color: "text-blue-500",
          bgColor: "bg-blue-100",
        };
      case "shipped":
        return {
          text: "Sendt",
          color: "text-green-500",
          bgColor: "bg-green-100",
        };
      case "delivered":
        return {
          text: "Levert",
          color: "text-green-700",
          bgColor: "bg-green-100",
        };
      case "cancelled":
        return {
          text: "Kansellert",
          color: "text-red-500",
          bgColor: "bg-red-100",
        };
      default:
        return {
          text: "Ukjent",
          color: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-mabry text-primary mb-6">Min profil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-5">
            <h2 className="text-xl font-mabry text-primary mb-4">
              Personlig informasjon
            </h2>
            {loading ? (
              <div className="bg-neutral rounded-xl p-6 shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 font-mabrylight text-primary">
                  Laster brukerdata...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                {error}
              </div>
            ) : userData ? (
              <div className="bg-neutral rounded-xl p-6 shadow-md">
                <div className="space-y-6">
                  {/* Nickname section - moved to the top */}
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-full p-3 mr-4">
                      <FaUserEdit className="text-primary text-xl" />
                    </div>
                    <div className="flex-grow">
                      <h2 className="text-sm font-mabrylight text-gray-500">
                        Kallenavn
                      </h2>
                      {isEditingNickname ? (
                        <div className="flex flex-col sm:flex-row sm:items-center">
                          <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="border rounded-md p-1 mb-2 sm:mb-0 sm:mr-2 font-mabry text-primary"
                            placeholder="Ditt kallenavn"
                          />
                          <div className="flex">
                            <button
                              onClick={handleUpdateNickname}
                              disabled={isSaving}
                              className="bg-secondary text-primary px-3 py-1 rounded-md hover:bg-secondary/80 transition-all mr-2"
                            >
                              {isSaving ? "Lagrer..." : "Lagre"}
                            </button>
                            <button
                              onClick={() => {
                                setIsEditingNickname(false);
                                setNickname(userData.nickname || "");
                                setSaveError(null);
                              }}
                              className="bg-gray-200 text-primary px-3 py-1 rounded-md hover:bg-gray-300 transition-all"
                            >
                              Avbryt
                            </button>
                          </div>
                          {saveError && (
                            <p className="text-red-500 text-sm mt-1">
                              {saveError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <p className="font-mabry text-primary text-lg">
                            {userData.nickname || "Ikke satt"}
                          </p>
                          <button
                            onClick={() => setIsEditingNickname(true)}
                            className="ml-2 text-primary hover:scale-97 transition-all bg-secondary rounded-xl pl-2 pr-2"
                          >
                            {userData.nickname ? "Endre" : "Legg til"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name section - now below nickname */}
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-full p-3 mr-4">
                      <FaUser className="text-primary text-xl" />
                    </div>
                    <div>
                      <h2 className="text-sm font-mabrylight text-gray-500">
                        Navn
                      </h2>
                      <p className="font-mabry text-primary text-lg">
                        {userData.name}
                      </p>
                    </div>
                  </div>

                  {/* Email section */}
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-full p-3 mr-4">
                      <FaEnvelope className="text-primary text-xl" />
                    </div>
                    <div>
                      <h2 className="text-sm font-mabrylight text-gray-500">
                        E-post
                      </h2>
                      <p className="font-mabry text-primary text-lg">
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  {/* User-ID section */}
                  <div className="flex items-center">
                    <div className="bg-secondary rounded-full p-3 mr-4">
                      <FaIdCard className="text-primary text-xl" />
                    </div>
                    <div>
                      <h2 className="text-sm font-mabrylight text-gray-500">
                        Bruker-ID
                      </h2>
                      <p className="font-mabry text-primary text-lg">
                        {userData.readableId || "Ikke tilgjengelig"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral rounded-xl p-6 shadow-md text-center">
                <p className="font-mabrylight text-primary">
                  Ingen brukerdata funnet.
                </p>
              </div>
            )}
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-7">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-mabry text-primary">
                Mine bestillinger
              </h2>
              {selectedOrder && (
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-sm bg-base-300 px-3 py-1 rounded-md hover:scale-97 transition-all"
                >
                  Tilbake til alle bestillinger
                </button>
              )}
            </div>

            {loadingOrders ? (
              <div className="bg-neutral rounded-xl p-6 shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 font-mabrylight text-primary">
                  Laster bestillinger...
                </p>
              </div>
            ) : orderError ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {orderError}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-neutral rounded-xl p-6 shadow-md text-center">
                <div className="bg-gray-100 rounded-full p-5 inline-block mb-4">
                  <FaShoppingBag className="text-gray-400 text-3xl" />
                </div>
                <p className="font-mabry text-primary mb-2">
                  Ingen bestillinger ennå
                </p>
                <p className="font-mabrylight text-gray-500 mb-4">
                  Du har ikke lagt inn noen bestillinger ennå
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="bg-secondary text-primary font-mabry rounded-lg px-5 py-2 hover:bg-primary hover:text-secondary-content transition-all duration-200"
                >
                  Til butikken
                </button>
              </div>
            ) : selectedOrder ? (
              // Detailed Order View
              <div className="bg-neutral rounded-xl p-6 shadow-md">
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <div className="flex flex-wrap justify-between items-start">
                    <div>
                      <h3 className="font-mabry text-lg text-primary">
                        Bestilling {selectedOrder.id}
                      </h3>
                      <p className="font-mabrylight text-gray-500">
                        {new Date(selectedOrder.createdAt).toLocaleDateString(
                          "no-NO",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full ${getOrderStatusInfo(selectedOrder.status).bgColor}`}
                    >
                      <span
                        className={`text-sm font-mabry ${getOrderStatusInfo(selectedOrder.status).color}`}
                      >
                        {getOrderStatusInfo(selectedOrder.status).text}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <h4 className="font-mabry text-primary mb-2">Produkter</h4>
                  <div className="max-h-[300px] overflow-y-auto">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-mabry text-primary">
                            {item.productName}
                          </p>
                          <p className="font-mabrylight text-gray-500 text-sm">
                            {formatPrice(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <div className="font-mabry text-primary">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-1">
                    <p className="font-mabrylight text-primary">Subtotal:</p>
                    <p className="font-mabry text-primary">
                      {formatPrice(selectedOrder.totalAmount)}
                    </p>
                  </div>
                  <div className="flex justify-between mb-3">
                    <p className="font-mabrylight text-primary">Frakt:</p>
                    <p className="font-mabry text-secondary">Gratis</p>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <p className="font-mabry text-primary">Totalt:</p>
                    <p className="font-mabry text-primary text-lg">
                      {formatPrice(selectedOrder.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Order List View
              <div className="bg-neutral rounded-xl shadow-md">
                <div
                  className={`divide-y divide-gray-100 ${orders.length > 4 ? "max-h-[400px] overflow-y-auto" : ""}`}
                >
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="p-4 hover:bg-base-300 transition-colors cursor-pointer rounded-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mabry text-primary">{order.id}</p>
                          <p className="font-mabrylight text-gray-500 text-sm">
                            {new Date(order.createdAt).toLocaleDateString(
                              "no-NO",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="font-mabrylight text-gray-500 text-sm">
                            {order.items.length}{" "}
                            {order.items.length === 1 ? "produkt" : "produkter"}
                          </p>
                        </div>
                        <div>
                          <div
                            className={`px-3 py-1 rounded-full ${getOrderStatusInfo(order.status).bgColor}`}
                          >
                            <span
                              className={`text-sm font-mabry ${getOrderStatusInfo(order.status).color}`}
                            >
                              {getOrderStatusInfo(order.status).text}
                            </span>
                          </div>
                          <p className="font-mabry text-primary text-right mt-2">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default Profile;
