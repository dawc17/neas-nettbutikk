import { useState, useEffect } from "react";
import { getDatabase, ref, push, set, update, get } from "firebase/database";
import { initializeApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyDvyh73cj0xDmkVSMrfy8wD1V2C0nL9bzg",
  authDomain: "neas-nettbutikk-cb665.firebaseapp.com",
  projectId: "neas-nettbutikk-cb665",
  storageBucket: "neas-nettbutikk-cb665.firebasestorage.app",
  messagingSenderId: "401615206029",
  appId: "1:401615206029:web:9fbb8df70c18f999f394c4",
  measurementId: "G-404KWWNX03",
  databaseURL:
    "https://neas-nettbutikk-cb665-default-rtdb.europe-west1.firebasedatabase.app/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const PRODUCT_CATEGORIES = {
  MOBIL: "mobile",
  PCTILBEHOR: "pctilbehor",
  TV: "tv",
  GAMING: "gaming",
  KITCHEN: "kitchen",
};

export const CATEGORY_NAMES = {
  [PRODUCT_CATEGORIES.MOBIL]: "Mobil og nettbrett",
  [PRODUCT_CATEGORIES.PCTILBEHOR]: "PC og tilbehør",
  [PRODUCT_CATEGORIES.TV]: "TV, lyd og smarthus",
  [PRODUCT_CATEGORIES.GAMING]: "Gaming",
  [PRODUCT_CATEGORIES.KITCHEN]: "Kjøkken",
};

// Add this function near the top of your file, outside the component
const generateProductId = (productName) => {
  if (!productName) return "";

  // Convert to lowercase, replace spaces with hyphens, remove special characters
  return productName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single one
    .substring(0, 50); // Limit length
};

function AdminProductForm({ productToEdit, onEditComplete }) {
  const isEditMode = !!productToEdit;
  const [product, setProduct] = useState({
    productName: "",
    productDescription: "",
    extendedDescription: "",
    price: "",
    category: "",
    image: "",
    images: [], // Additional images
    stock: 0,
  });

  const [additionalImageUrl, setAdditionalImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [uploadType, setUploadType] = useState("url"); // "url" or "file"
  const [additionalUploadType, setAdditionalUploadType] = useState("url");

  // Load product data when editing
  useEffect(() => {
    if (productToEdit) {
      // Transform the product data to match the form structure
      const images = productToEdit.images || [];

      console.log();

      setProduct({
        productName: productToEdit.productName || "",
        productDescription: productToEdit.productDescription || "",
        extendedDescription: productToEdit.extendedDescription || "",
        price: productToEdit.price || 0,
        category: productToEdit.category || "",
        image: productToEdit.image || "",
        images: Array.isArray(images) ? images : [],
        stock: productToEdit.stock || 0,
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" || name === "stock") {
      // Parse as number and ensure it's not negative
      const numValue = Math.max(0, parseInt(value) || 0);
      setProduct({ ...product, [name]: numValue });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle main image file upload
  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: "Bildet er for stort. Maksimal størrelse er 5MB.",
        });
        return;
      }

      const base64 = await fileToBase64(file);
      setProduct({ ...product, image: base64 });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setFeedback({
        type: "error",
        message: "Kunne ikke laste opp bildet. Vennligst prøv igjen.",
      });
    }
  };

  // Handle additional image file upload
  const handleAdditionalImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: "error",
          message: "Bildet er for stort. Maksimal størrelse er 5MB.",
        });
        return;
      }

      const base64 = await fileToBase64(file);
      setProduct({
        ...product,
        images: [
          ...product.images,
          { src: base64, alt: product.productName, isBase64: true },
        ],
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      setFeedback({
        type: "error",
        message: "Kunne ikke laste opp bildet. Vennligst prøv igjen.",
      });
    }
  };

  // Add existing image URL
  const addImage = () => {
    if (additionalImageUrl.trim()) {
      setProduct({
        ...product,
        images: [
          ...product.images,
          {
            src: additionalImageUrl,
            alt: product.productName,
            isBase64: false,
          },
        ],
      });
      setAdditionalImageUrl("");
    }
  };

  const removeImage = (index) => {
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: "", message: "" });

    try {
      // Validation
      if (
        !product.productName ||
        !product.productDescription ||
        !product.price ||
        !product.category ||
        !product.image
      ) {
        throw new Error("Alle obligatoriske felter må fylles ut");
      }

      const database = getDatabase();
      const productData = {
        ...product,
        price: Number(product.price),
        stock: Number(product.stock || 0),
      };

      if (isEditMode) {
        // Update existing product - no changes needed here
        const productRef = ref(database, `products/${productToEdit.id}`);
        productData.id = productToEdit.id;
        await update(productRef, productData);

        setFeedback({
          type: "success",
          message: "Produktet ble oppdatert!",
        });

        // Return to product list after successful update
        setTimeout(() => {
          if (onEditComplete) {
            onEditComplete();
          }
        }, 1500);
      } else {
        // Create new product with name-based ID
        const productId = generateProductId(product.productName);

        // Check if a product with this ID already exists
        const productRef = ref(database, `products/${productId}`);
        const snapshot = await get(productRef);

        if (snapshot.exists()) {
          // Product with this ID already exists, append timestamp
          const timestamp = new Date().getTime().toString().slice(-4);
          productData.id = `${productId}-${timestamp}`;
        } else {
          productData.id = productId;
        }

        // Set the data at the specific path (not using push anymore)
        await set(ref(database, `products/${productData.id}`), productData);

        setFeedback({
          type: "success",
          message: "Produktet ble lagt til!",
        });

        // Reset form after adding a product
        setProduct({
          productName: "",
          productDescription: "",
          extendedDescription: "",
          price: "",
          category: "",
          image: "",
          images: [],
          stock: 0,
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
      setFeedback({
        type: "error",
        message: `Feil ved lagring av produkt: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-mabry text-xl text-primary mb-4">
        {isEditMode ? "Rediger produkt" : "Legg til nytt produkt"}
      </h2>

      {feedback.message && (
        <div
          className={`mb-4 p-3 rounded-lg ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product name */}
        <div>
          <label
            htmlFor="productName"
            className="block font-mabry text-primary mb-1"
          >
            Produktnavn*
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={product.productName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        {/* Product description */}
        <div>
          <label
            htmlFor="productDescription"
            className="block font-mabry text-primary mb-1"
          >
            Kort beskrivelse*
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            value={product.productDescription}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          ></textarea>
        </div>

        {/* Extended description (markdown) */}
        <div>
          <label
            htmlFor="extendedDescription"
            className="block font-mabry text-primary mb-1"
          >
            Utvidet beskrivelse (markdown)
          </label>
          <textarea
            id="extendedDescription"
            name="extendedDescription"
            value={product.extendedDescription}
            onChange={handleChange}
            rows="6"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary font-mono text-sm"
            placeholder="### Overskrift\n- Punkt 1\n- Punkt 2\n\nMer tekst her..."
          ></textarea>
        </div>

        {/* Price and Category in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block font-mabry text-primary mb-1"
            >
              Pris (NOK)*
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block font-mabry text-primary mb-1"
            >
              Kategori*
            </label>
            <select
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required
            >
              <option value="">Velg en kategori</option>
              {Object.entries(CATEGORY_NAMES).map(([value, name]) => (
                <option key={value} value={value}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock */}
        <div>
          <label
            htmlFor="stock"
            className="block font-mabry text-primary mb-1"
          >
            Antall på lager
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>

        {/* Main image section */}
        <div>
          <label className="block font-mabry text-primary mb-1">
            Hovedbilde*
          </label>

          <div className="flex space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="url"
                checked={uploadType === "url"}
                onChange={() => setUploadType("url")}
                className="mr-1"
              />
              <span>URL</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                value="file"
                checked={uploadType === "file"}
                onChange={() => setUploadType("file")}
                className="mr-1"
              />
              <span>Last opp fil</span>
            </label>
          </div>

          {uploadType === "url" ? (
            <input
              type="text"
              id="image"
              name="image"
              value={product.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="https://example.com/image.jpg"
              required={!product.image.startsWith("data:")}
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              required={!product.image}
            />
          )}

          {product.image && (
            <div className="mt-2">
              <img
                src={product.image}
                alt="Forhåndsvisning"
                className="h-20 object-contain border border-gray-200 rounded-md"
              />
            </div>
          )}
        </div>

        {/* Additional images */}
        <div>
          <label className="block font-mabry text-primary mb-1">
            Ekstra bilder
          </label>

          <div className="flex space-x-4 mb-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="url"
                checked={additionalUploadType === "url"}
                onChange={() => setAdditionalUploadType("url")}
                className="mr-1"
              />
              <span>URL</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="radio"
                value="file"
                checked={additionalUploadType === "file"}
                onChange={() => setAdditionalUploadType("file")}
                className="mr-1"
              />
              <span>Last opp fil</span>
            </label>
          </div>

          {additionalUploadType === "url" ? (
            <div className="flex">
              <input
                type="text"
                value={additionalImageUrl}
                onChange={(e) => setAdditionalImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-secondary text-primary font-mabry rounded-r-md hover:bg-secondary/80"
              >
                Legg til
              </button>
            </div>
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={handleAdditionalImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          )}

          {product.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {product.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.src}
                    alt={`Ekstra bilde ${index + 1}`}
                    className="h-16 object-contain border border-gray-200 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 bg-secondary text-primary font-mabry rounded-md hover:bg-primary hover:text-accent transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting
              ? "Lagrer..."
              : isEditMode
                ? "Oppdater produkt"
                : "Legg til produkt"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
