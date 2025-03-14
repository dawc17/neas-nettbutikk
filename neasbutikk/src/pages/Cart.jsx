import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import FooterMain from "../components/Footer";
import { useCart } from "../context/CartContext";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";

function Cart() {
  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(getCartTotal());
  }, [cartItems, getCartTotal]);

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleCheckout = () => {
    alert("Thanks for your purchase!");
    clearCart();
  };

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl text-pinegreen font-mabry mb-6">
          Din handlekurv
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items - Scrollable Section */}
          <div className="flex-1 bg-lightgray rounded-xl p-4 shadow-md">
            <div className="max-h-[60vh] overflow-y-auto hide-scrollbar">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-center border-b border-pinegreen/20 py-4"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-1/4 mb-3 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="h-24 object-contain mx-auto"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="w-full sm:w-2/4 px-4 text-center sm:text-left">
                      <h3 className="font-mabry text-pinegreen text-lg mb-1">
                        {item.productName}
                      </h3>
                      <p className="font-mabrylight text-pinegreen text-sm line-clamp-2 mb-2">
                        {item.productDescription}
                      </p>
                      <p className="font-mabry text-pinegreen">
                        {item.price} NOK per stk
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="w-full sm:w-1/4 flex flex-col items-center mt-3 sm:mt-0">
                      <div className="flex items-center mb-2">
                        <button
                          className="bg-pinegreen/10 text-pinegreen p-2 rounded-l-lg hover:bg-pinegreen/20 transition-all"
                          onClick={() => {
                            /* Implement decrease quantity functionality */
                          }}
                          disabled={item.quantity === 1}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span className="px-4 py-1 bg-white text-pinegreen font-mabry">
                          {item.quantity}
                        </span>
                        <button
                          className="bg-pinegreen/10 text-pinegreen p-2 rounded-r-lg hover:bg-pinegreen/20 transition-all"
                          onClick={() => {
                            /* Implement increase quantity functionality */
                          }}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>

                      <p className="font-mabry text-pinegreen mb-2">
                        {item.price * item.quantity} NOK
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

          {/* Order Summary */}
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
                <span className="font-mabry text-pinegreen">{total} NOK</span>
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
                    {total} NOK
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
