import { useState, useEffect } from "react";
import { getDatabase, ref, remove, update, get } from "firebase/database";
import { FaEdit, FaTrash, FaSearch, FaSave, FaTimes } from "react-icons/fa";
import { useProducts } from "../data/ProductsData";
import { CATEGORY_NAMES } from "../components/AdminProductForm";
import { formatPrice } from "../utils/priceFormatter";

function AdminProductList({ onEditFullProduct }) {
  const { products, loading, refreshProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Initialize the database
  const database = getDatabase();

  // Filter products when search term or products change
  useEffect(() => {
    if (!loading && products) {
      const filtered = products.filter(
        (product) =>
          product.productName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.productDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products, loading]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product.id);
    setEditFormData({
      productName: product.productName,
      productDescription: product.productDescription,
      price: product.price,
      stock: product.stock || 0,
      category: product.category,
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "price" || name === "stock") {
      // Parse as number and ensure it's not negative
      const numValue = Math.max(0, parseInt(value) || 0);
      setEditFormData((prev) => ({ ...prev, [name]: numValue }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditFormData({});
  };

  const handleSaveEdit = async (productId) => {
    try {
      const productRef = ref(database, `products/${productId}`);

      // Get current product data first
      const snapshot = await get(productRef);
      if (!snapshot.exists()) {
        throw new Error("Product not found");
      }

      const currentProduct = snapshot.val();

      // Update only the fields in editFormData
      const updatedProduct = {
        ...currentProduct,
        ...editFormData,
      };

      await update(productRef, updatedProduct);

      setFeedback({
        type: "success",
        message: `Produktet "${editFormData.productName}" ble oppdatert!`,
      });

      setEditingProduct(null);
      setEditFormData({});

      // Refresh products list to show updated data
      refreshProducts();

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      setFeedback({
        type: "error",
        message: `Feil ved oppdatering av produkt: ${error.message}`,
      });
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const productRef = ref(database, `products/${productToDelete.id}`);
      await remove(productRef);

      setFeedback({
        type: "success",
        message: `Produktet "${productToDelete.productName}" ble slettet!`,
      });

      // Refresh products list to show updated data
      refreshProducts();

      // Clear feedback after 3 seconds
      setTimeout(() => {
        setFeedback({ type: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Error deleting product:", error);
      setFeedback({
        type: "error",
        message: `Feil ved sletting av produkt: ${error.message}`,
      });
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setProductToDelete(null);
  };

  if (loading) {
    return <div className="text-center py-6">Laster produkter...</div>;
  }

  return (
    <div className="w-full">
      <h2 className="font-mabry text-xl text-pinegreen mb-4">
        Administrer produkter
      </h2>

      {feedback.message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Search bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Søk etter produkter..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mossgreen"
        />
        <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Delete confirmation modal */}
      {isDeleting && productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="font-mabry text-lg text-pinegreen mb-4">
              Bekreft sletting
            </h3>
            <p className="mb-6">
              Er du sikker på at du vil slette produktet "
              {productToDelete.productName}"? Dette kan ikke angres.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Avbryt
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Slett
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product list */}
      {filteredProducts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-mabry text-pinegreen uppercase">
                  Produkt
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-mabry text-pinegreen uppercase">
                  Kategori
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-mabry text-pinegreen uppercase">
                  Pris
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-mabry text-pinegreen uppercase">
                  Lager
                </th>
                <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-mabry text-pinegreen uppercase">
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  {editingProduct === product.id ? (
                    // Editing mode
                    <>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <input
                          type="text"
                          name="productName"
                          value={editFormData.productName}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <select
                          name="category"
                          value={editFormData.category}
                          onChange={handleEditFormChange}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                        >
                          {Object.entries(CATEGORY_NAMES).map(
                            ([value, name]) => (
                              <option key={value} value={value}>
                                {name}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <input
                          type="number"
                          name="price"
                          value={editFormData.price}
                          onChange={handleEditFormChange}
                          min="0"
                          className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <input
                          type="number"
                          name="stock"
                          value={editFormData.stock}
                          onChange={handleEditFormChange}
                          min="0"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="py-2 px-4 border-b border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSaveEdit(product.id)}
                            className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                            title="Lagre"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            title="Avbryt"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.productName}
                              className="h-10 w-10 object-contain"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-mabry text-sm text-pinegreen">
                              {product.productName}
                            </div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {product.productDescription.substring(0, 60)}
                              {product.productDescription.length > 60
                                ? "..."
                                : ""}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm">
                        {CATEGORY_NAMES[product.category] || product.category}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm">
                        {product.stock || 0}
                      </td>
                      <td className="py-3 px-4 border-b border-gray-200">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            title="Hurtigredigering"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => onEditFullProduct(product)}
                            className="p-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                            title="Full redigering"
                          >
                            <FaEdit className="transform scale-125" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            title="Slett"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 font-mabrylight text-gray-500">
          {searchTerm
            ? "Ingen produkter funnet for dette søket"
            : "Ingen produkter å vise"}
        </div>
      )}
    </div>
  );
}

export default AdminProductList;
