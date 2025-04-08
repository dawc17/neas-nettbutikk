import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useProducts } from "../data/ProductsData";
import { formatPrice } from "../utils/priceFormatter";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { generateOrderId } from "../utils/orderUtils";
import { getDatabase, ref, set, get } from "firebase/database";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [total, setTotal] = useState(0);
  const { loading } = useProducts();
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cartItems, getCartTotal]);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleQuantityDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(id, currentQuantity - 1);
    }
  };

  const handleQuantityIncrease = (id, currentQuantity) => {
    updateQuantity(id, currentQuantity + 1);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      // User is not logged in, show login modal
      setShowLoginModal(true);
      return;
    }

    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // Get user information
      const database = getDatabase();
      const userRef = ref(database, `users/${currentUser.uid}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.exists() ? userSnapshot.val() : {};

      // Generate a unique order ID
      const newOrderId = generateOrderId();

      // Create the order object
      const orderData = {
        id: newOrderId,
        items: cartItems.map((item) => ({
          id: item.id,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
        })),
        totalAmount: total,
        customer: {
          id: currentUser.uid,
          name: userData.name || userData.nickname || currentUser.email,
          email: currentUser.email,
          phone: userData.phone || "",
          address: userData.address || {},
        },
        status: "pending",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      // Save the order to Firebase
      const orderRef = ref(database, `orders/${newOrderId}`);
      await set(orderRef, orderData);

      // Also save a reference to this order in the user's orders
      const userOrderRef = ref(
        database,
        `users/${currentUser.uid}/orders/${newOrderId}`
      );
      await set(userOrderRef, {
        id: newOrderId,
        totalAmount: total,
        status: "pending",
        createdAt: Date.now(),
      });

      // Order complete
      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        "Det oppstod en feil ved behandling av din ordre. Vennligst prøv igjen."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginRedirect = () => {
    // Navigate to login page with return URL to cart
    navigate("/login", { state: { returnPath: "/cart" } });
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-6 md:p-10">
        {/* Order Confirmation */}
        {orderComplete ? (
          <div className="max-w-3xl mx-auto bg-neutral rounded-xl p-8 shadow-md">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-mabry text-primary mb-2">
                Ordre mottatt!
              </h1>
              <p className="font-mabrylight text-primary mb-4">
                Takk for din bestilling. Din ordre er nå registrert og vil bli
                behandlet så snart som mulig.
              </p>
              <div className="bg-base-100 rounded-lg p-4 inline-block mb-6">
                <p className="font-mabry text-primary">
                  Ordre ID: <span className="font-mabrylight">{orderId}</span>
                </p>
              </div>
              <div className="space-y-4">
                <p className="font-mabrylight text-primary">
                  En ordrebekreftelse har blitt sendt til din e-post.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="bg-secondary text-primary font-mabry rounded-lg py-3 px-6 hover:bg-primary hover:text-secondary-content transition-all duration-200"
                  >
                    Fortsett å handle
                  </button>
                  <button
                    onClick={() => navigate("/profile")}
                    className="border border-primary text-primary font-mabry rounded-lg py-3 px-6 hover:bg-primary/10 transition-all duration-200"
                  >
                    Se mine ordrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Login Modal */}
            {showLoginModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                  <h2 className="text-xl text-primary font-mabry mb-3">
                    Logg inn for å fortsette
                  </h2>
                  <p className="font-mabrylight text-primary mb-6">
                    Du må være logget inn for å kunne gå til betaling.
                    Produktene i handlekurven din vil bli bevart.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleLoginRedirect}
                      className="bg-secondary text-primary font-mabry rounded-lg py-2 px-4 flex-1 hover:bg-primary hover:text-secondary-content transition-all duration-200"
                    >
                      Logg inn
                    </button>
                    <button
                      onClick={() => setShowLoginModal(false)}
                      className="border border-primary text-primary font-mabrylight rounded-lg py-2 px-4 flex-1 hover:bg-primary/10 transition-all duration-200"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              </div>
            )}

            <h1 className="text-2xl text-primary font-mabry mb-6">
              Din handlekurv
            </h1>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* scrollable cart items */}
              <div className="flex-1 bg-neutral rounded-xl p-4 shadow-md">
                <div className="max-h-[60vh] overflow-y-auto hide-scrollbar">
                  {loading ? (
                    <div className="text-center py-12 font-mabrylight text-primary">
                      Laster handlekurv...
                    </div>
                  ) : cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-center border-b border-primary/20 py-4"
                      >
                        {/* product image */}
                        <div className="w-full sm:w-1/4 mb-3 sm:mb-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="h-24 object-contain mx-auto"
                          />
                        </div>

                        {/* product details */}
                        <div className="w-full sm:w-2/4 px-4 text-center sm:text-left">
                          <h3 className="font-mabry text-primary text-lg mb-1">
                            {item.productName}
                          </h3>
                          <p className="font-mabrylight text-primary text-sm line-clamp-2 mb-2">
                            {item.productDescription}
                          </p>
                          <p className="font-mabry text-primary">
                            {formatPrice(item.price)} per stk
                          </p>
                        </div>

                        {/* quantity control */}
                        <div className="w-full sm:w-1/4 flex flex-col items-center mt-3 sm:mt-0">
                          <div className="flex items-center mb-2">
                            <div className="flex items-center border border-primary/30 rounded-lg overflow-hidden">
                              <button
                                onClick={() =>
                                  handleQuantityDecrease(item.id, item.quantity)
                                }
                                disabled={item.quantity === 1}
                                className="bg-gray-100 px-2 py-1 text-primary hover:bg-gray-200 transition-colors disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 font-mabry text-primary min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityIncrease(item.id, item.quantity)
                                }
                                className="bg-gray-100 px-2 py-1 text-primary hover:bg-gray-200 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <p className="font-mabry text-primary mb-2">
                            {formatPrice(item.price * item.quantity)}
                          </p>

                          <button
                            className="flex items-center justify-center text-red-500 hover:text-red-700 transition-all text-sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <FaTrash className="mr-1" size={12} /> Fjern
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 font-mabrylight text-primary">
                      Handlekurven er tom.
                      <br />
                      <a
                        href="/"
                        className="text-secondary hover:underline mt-2 inline-block"
                      >
                        Gå til butikken
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* order summary */}
              <div className="lg:w-1/3 bg-neutral rounded-xl p-6 shadow-md h-fit">
                <h2 className="text-xl text-primary font-mabry mb-4 border-b border-primary/20 pb-2">
                  Ordresammendrag
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-mabrylight text-primary">
                      Antall produkter:
                    </span>
                    <span className="font-mabry text-primary">
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-mabrylight text-primary">
                      Subtotal:
                    </span>
                    <span className="font-mabry text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-mabrylight text-primary">Frakt:</span>
                    <span className="font-mabry text-secondary">Gratis</span>
                  </div>

                  <div className="border-t border-primary/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-mabry text-primary text-lg">
                        Totalt:
                      </span>
                      <span className="font-mabry text-primary text-lg">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0 || isSubmitting}
                  className={`bg-secondary text-primary font-mabry rounded-lg w-full py-3 cursor-pointer hover:bg-primary hover:text-secondary-content transition-all duration-200 ${
                    cartItems.length === 0 || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isSubmitting ? "Behandler..." : "Gå til betaling"}
                </button>

                <button
                  onClick={() => clearCart()}
                  className={`mt-4 border border-primary text-primary font-mabrylight rounded-lg w-full py-2 cursor-pointer hover:bg-primary/10 transition-all duration-200 ${
                    cartItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={cartItems.length === 0}
                >
                  Tøm handlekurv
                </button>
              </div>
            </div>
          </>
        )}
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default Cart;
