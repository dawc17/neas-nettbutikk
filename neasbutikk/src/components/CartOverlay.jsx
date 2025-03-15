import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/priceFormatter";
import { FaShoppingCart } from "react-icons/fa";

function CartOverlay({ isVisible, onClose }) {
  const { cartItems, getCartTotal } = useCart();
  const total = getCartTotal();

  if (!isVisible) return null;

  return (
    <div
      className={`absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 transition-all duration-200 ease-in-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-2 pointer-events-none"
      }`}
      onMouseLeave={onClose}
    >
      {/* Fixed Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-mabry text-pinegreen text-lg">Din handlekurv</h3>
          <span className="font-mabrylight text-pinegreen">
            {cartItems.length}{" "}
            {cartItems.length === 1 ? "produkt" : "produkter"}
          </span>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <>
          {/* Scrollable Items Section */}
          <div className="max-h-64 overflow-y-auto hide-scrollbar">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-3 border-b border-gray-100 flex items-center gap-3"
              >
                <div className="w-14 h-14 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-mabrylight text-pinegreen text-sm line-clamp-1">
                    {item.productName}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-pinegreen">
                      {item.quantity} × {formatPrice(item.price)}
                    </span>
                    <span className="font-mabry text-pinegreen text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fixed Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mabrylight text-pinegreen">
                Sum totalt:
              </span>
              <span className="font-mabry text-pinegreen text-lg">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/cart"
              className="bg-mossgreen text-pinegreen font-mabry rounded-lg w-full py-2 text-center block hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-200"
            >
              Gå til handlekurv
            </Link>
          </div>
        </>
      ) : (
        <div className="p-6 text-center rounded-b-xl">
          <FaShoppingCart size={24} className="text-gray-300 mx-auto mb-2" />
          <p className="font-mabrylight text-pinegreen mb-2">
            Handlekurven er tom
          </p>
          <Link to="/" className="text-mossgreen text-sm hover:underline">
            Fortsett å handle
          </Link>
        </div>
      )}
    </div>
  );
}

export default CartOverlay;
