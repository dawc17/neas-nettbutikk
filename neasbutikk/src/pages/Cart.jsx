import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useProducts } from "../data/ProductsData";
import { formatPrice } from "../utils/priceFormatter";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [total, setTotal] = useState(0);
  const { loading } = useProducts();
  const { currentUser } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

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

  const handleCheckout = () => {
    if (!currentUser) {
      // User is not logged in, show login modal
      setShowLoginModal(true);
    } else {
      // User is logged in, proceed with checkout
      alert("Takk for din bestilling!");
      clearCart();
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
        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl text-pinegreen font-mabry mb-3">
                Logg inn for å fortsette
              </h2>
              <p className="font-mabrylight text-pinegreen mb-6">
                Du må være logget inn for å kunne gå til betaling. Produktene i
                handlekurven din vil bli bevart.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleLoginRedirect}
                  className="bg-mossgreen text-pinegreen font-mabry rounded-lg py-2 px-4 flex-1 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-200"
                >
                  Logg inn
                </button>
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="border border-pinegreen text-pinegreen font-mabrylight rounded-lg py-2 px-4 flex-1 hover:bg-pinegreen/10 transition-all duration-200"
                >
                  Avbryt
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-2xl text-pinegreen font-mabry mb-6">
          Din handlekurv
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* scrollable cart items */}
          <div className="flex-1 bg-lightgray rounded-xl p-4 shadow-md">
            <div className="max-h-[60vh] overflow-y-auto hide-scrollbar">
              {loading ? (
                <div className="text-center py-12 font-mabrylight text-pinegreen">
                  Laster handlekurv...
                </div>
              ) : cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center border-b border-pinegreen/20 py-4"
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
                      <h3 className="font-mabry text-pinegreen text-lg mb-1">
                        {item.productName}
                      </h3>
                      <p className="font-mabrylight text-pinegreen text-sm line-clamp-2 mb-2">
                        {item.productDescription}
                      </p>
                      <p className="font-mabry text-pinegreen">
                        {formatPrice(item.price)} per stk
                      </p>
                    </div>

                    {/* quantity control */}
                    <div className="w-full sm:w-1/4 flex flex-col items-center mt-3 sm:mt-0">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center border border-pinegreen/30 rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              handleQuantityDecrease(item.id, item.quantity)
                            }
                            disabled={item.quantity === 1}
                            className="bg-gray-100 px-2 py-1 text-pinegreen hover:bg-gray-200 transition-colors disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 font-mabry text-pinegreen min-w-[30px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityIncrease(item.id, item.quantity)
                            }
                            className="bg-gray-100 px-2 py-1 text-pinegreen hover:bg-gray-200 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <p className="font-mabry text-pinegreen mb-2">
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
                <div className="text-center py-12 font-mabrylight text-pinegreen">
                  Handlekurven er tom.
                  <br />
                  <a
                    href="/"
                    className="text-mossgreen hover:underline mt-2 inline-block"
                  >
                    Gå til butikken
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* order summary */}
          <div className="lg:w-1/3 bg-lightgray rounded-xl p-6 shadow-md h-fit">
            <h2 className="text-xl text-pinegreen font-mabry mb-4 border-b border-pinegreen/20 pb-2">
              Ordresammendrag
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-mabrylight text-pinegreen">
                  Antall produkter:
                </span>
                <span className="font-mabry text-pinegreen">
                  {cartItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mabrylight text-pinegreen">
                  Subtotal:
                </span>
                <span className="font-mabry text-pinegreen">
                  {formatPrice(total)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-mabrylight text-pinegreen">Frakt:</span>
                <span className="font-mabry text-mossgreen">Gratis</span>
              </div>

              <div className="border-t border-pinegreen/20 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-mabry text-pinegreen text-lg">
                    Totalt:
                  </span>
                  <span className="font-mabry text-pinegreen text-lg">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className={`bg-mossgreen text-pinegreen font-mabry rounded-lg w-full py-3 cursor-pointer hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-200 ${
                cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={cartItems.length === 0}
            >
              Gå til betaling
            </button>

            <button
              onClick={() => clearCart()}
              className={`mt-4 border border-pinegreen text-pinegreen font-mabrylight rounded-lg w-full py-2 cursor-pointer hover:bg-pinegreen/10 transition-all duration-200 ${
                cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={cartItems.length === 0}
            >
              Tøm handlekurv
            </button>
          </div>
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default Cart;
