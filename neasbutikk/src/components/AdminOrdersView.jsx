import { useState, useEffect, useMemo } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { formatPrice } from "../utils/priceFormatter";
import { FaChevronDown, FaChevronRight, FaSpinner } from "react-icons/fa";

function AdminOrdersView({ filterStatus = null }) {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusUpdating, setOrderStatusUpdating] = useState(false);

  // Fetch all orders
  useEffect(() => {
    const database = getDatabase();
    const ordersRef = ref(database, "orders");

    const unsubscribe = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          const ordersArray = Object.values(ordersData);

          // Sort by newest first
          ordersArray.sort((a, b) => b.createdAt - a.createdAt);

          setOrders(ordersArray);
        } else {
          setOrders([]);
        }
        setLoadingOrders(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setError("Kunne ikke hente bestillinger: " + error.message);
        setLoadingOrders(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch all users
  useEffect(() => {
    const database = getDatabase();
    const usersRef = ref(database, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.entries(usersData).map(
            ([id, userData]) => ({
              id,
              ...userData,
            })
          );

          // Sort alphabetically by name
          usersArray.sort((a, b) => {
            const nameA = (a.name || a.nickname || a.email || "").toLowerCase();
            const nameB = (b.name || b.nickname || b.email || "").toLowerCase();
            return nameA.localeCompare(nameB);
          });

          setUsers(usersArray);
        } else {
          setUsers([]);
        }
        setLoadingUsers(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setError("Kunne ikke hente brukerdata: " + error.message);
        setLoadingUsers(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Group orders by user ID
  const ordersByUser = useMemo(() => {
    if (!orders.length) return {};

    const filteredOrders = filterStatus
      ? orders.filter((order) => order.status === filterStatus)
      : orders;

    return filteredOrders.reduce((acc, order) => {
      const userId = order.customer?.id;
      if (!userId) return acc;

      if (!acc[userId]) {
        acc[userId] = [];
      }

      acc[userId].push(order);
      return acc;
    }, {});
  }, [orders, filterStatus]);

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || orderStatusUpdating) return;

    setOrderStatusUpdating(true);
    try {
      const database = getDatabase();
      const orderRef = ref(database, `orders/${orderId}`);

      await update(orderRef, {
        status: newStatus,
        updatedAt: Date.now(),
      });

      // Also update in the user's orders
      const order = orders.find((o) => o.id === orderId);
      if (order && order.customer && order.customer.id) {
        const userOrderRef = ref(
          database,
          `users/${order.customer.id}/orders/${orderId}`
        );
        await update(userOrderRef, {
          status: newStatus,
        });
      }

      // Update the selected order status in the local state
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
          updatedAt: Date.now(),
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Feil ved oppdatering av ordrestatus: " + error.message);
    } finally {
      setOrderStatusUpdating(false);
    }
  };

  // Status display information
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

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get user display name
  const getUserDisplayName = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return "Ukjent bruker";

    return user.name || user.nickname || user.email || "Ukjent navn";
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
    setSelectedOrder(null);
  };

  const handleOrderClick = (order) => {
    setSelectedOrder((prevOrder) =>
      prevOrder && prevOrder.id === order.id ? null : order
    );
  };

  const loading = loadingOrders || loadingUsers;

  return (
    <div className="w-full">
      <h2 className="font-mabry text-xl text-primary mb-4">
        Alle bestillinger
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <FaSpinner className="animate-spin text-3xl text-primary" />
          <span className="ml-2 font-mabrylight text-primary">
            Laster data...
          </span>
        </div>
      ) : (
        <div>
          {selectedOrder ? (
            // Detailed Order View
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-mabry text-lg text-primary">
                  Ordre: {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-3 py-1 bg-base-300 rounded-md hover:bg-base-100 text-sm font-mabrylight"
                >
                  Tilbake til liste
                </button>
              </div>

              <div className="bg-neutral rounded-xl p-6 shadow-md">
                {/* Order header */}
                <div className="mb-6 border-b border-gray-200 pb-4">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="font-mabry text-lg text-primary">
                        {selectedOrder.id}
                      </h3>
                      <p className="font-mabrylight text-sm text-gray-500">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="font-mabrylight text-primary mt-1">
                        Kunde:{" "}
                        <span className="font-mabry">
                          {selectedOrder.customer?.name || "Ukjent"}
                        </span>
                        {selectedOrder.customer?.email && (
                          <span className="block text-gray-500 text-sm">
                            {selectedOrder.customer.email}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div
                        className={`px-3 py-1 rounded-full ${getOrderStatusInfo(selectedOrder.status).bgColor}`}
                      >
                        <span
                          className={`text-sm font-mabry ${getOrderStatusInfo(selectedOrder.status).color}`}
                        >
                          {getOrderStatusInfo(selectedOrder.status).text}
                        </span>
                      </div>

                      {/* Status update dropdown */}
                      <select
                        value={selectedOrder.status}
                        onChange={(e) =>
                          updateOrderStatus(selectedOrder.id, e.target.value)
                        }
                        disabled={orderStatusUpdating}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="pending">Venter på behandling</option>
                        <option value="processing">Under behandling</option>
                        <option value="shipped">Sendt</option>
                        <option value="delivered">Levert</option>
                        <option value="cancelled">Kansellert</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="font-mabry text-primary mb-3">Produkter</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-base-100">
                          <th className="px-3 py-2 text-left text-xs font-mabry text-gray-500 uppercase">
                            Produkt
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-mabry text-gray-500 uppercase">
                            Pris
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-mabry text-gray-500 uppercase">
                            Antall
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-mabry text-gray-500 uppercase">
                            Sum
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index} className="hover:bg-base-300">
                            <td className="px-3 py-3 font-mabrylight text-primary">
                              {item.productName}
                            </td>
                            <td className="px-3 py-3 text-right font-mabrylight text-primary">
                              {formatPrice(item.price)}
                            </td>
                            <td className="px-3 py-3 text-right font-mabrylight text-primary">
                              {item.quantity}
                            </td>
                            <td className="px-3 py-3 text-right font-mabry text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                    <p className="font-mabry text-primary text-lg">Totalt:</p>
                    <p className="font-mabry text-primary text-xl">
                      {formatPrice(selectedOrder.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // User and Orders List View
            <div className="bg-neutral rounded-xl shadow-md divide-y divide-gray-200">
              {users.length > 0 ? (
                users
                  .map((user) => {
                    const userOrders = ordersByUser[user.id] || [];
                    if (userOrders.length === 0) return null;

                    return (
                      <div key={user.id} className="overflow-hidden">
                        {/* User header - click to expand */}
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer hover:bg-base-300 rounded-t-xl"
                          onClick={() => toggleUserExpansion(user.id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="font-mabry text-primary">
                                {user.name ||
                                  user.nickname ||
                                  user.email ||
                                  "Anonym bruker"}
                              </span>
                              {user.readableId && (
                                <span className="font-mabrylight text-sm text-gray-500 ml-2">
                                  ({user.readableId})
                                </span>
                              )}
                            </div>
                            <div className="font-mabrylight text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-3 font-mabrylight text-primary">
                              {userOrders.length}{" "}
                              {userOrders.length === 1 ? "ordre" : "ordrer"}
                            </span>
                            {expandedUserId === user.id ? (
                              <FaChevronDown className="text-gray-500" />
                            ) : (
                              <FaChevronRight className="text-gray-500" />
                            )}
                          </div>
                        </div>

                        {/* User's orders - shown when expanded */}
                        {expandedUserId === user.id && (
                          <div className="bg-base-200 divide-y divide-gray-100">
                            {userOrders.map((order) => (
                              <div
                                key={order.id}
                                className="px-6 py-4 hover:bg-base-300 cursor-pointer transition-colors"
                                onClick={() => handleOrderClick(order)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-mabry text-primary">
                                      {order.id}
                                    </p>
                                    <p className="font-mabrylight text-sm text-gray-500">
                                      {formatDate(order.createdAt)}
                                    </p>
                                    <p className="font-mabrylight text-sm text-gray-600 mt-1">
                                      {order.items.length}{" "}
                                      {order.items.length === 1
                                        ? "produkt"
                                        : "produkter"}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <div
                                      className={`inline-block px-3 py-1 rounded-full mb-2 ${getOrderStatusInfo(order.status).bgColor}`}
                                    >
                                      <span
                                        className={`text-xs font-mabry ${getOrderStatusInfo(order.status).color}`}
                                      >
                                        {getOrderStatusInfo(order.status).text}
                                      </span>
                                    </div>
                                    <p className="font-mabry text-primary">
                                      {formatPrice(order.totalAmount)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                  .filter(Boolean)
              ) : (
                <div className="p-8 text-center font-mabrylight text-gray-500">
                  Ingen brukere med bestillinger funnet
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminOrdersView;
