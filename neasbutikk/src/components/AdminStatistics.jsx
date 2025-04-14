import { useState, useEffect, useMemo } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { formatPrice } from "../utils/priceFormatter";
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSpinner,
  FaChartLine,
  FaTable,
  FaChartBar,
  FaEye,
  FaRedo,
  FaShoppingCart,
} from "react-icons/fa";
import { useProducts } from "../data/ProductsData";
// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function AdminStatistics() {
  // State variables
  const [orders, setOrders] = useState([]);
  const [productViews, setProductViews] = useState({});
  const [productOrders, setProductOrders] = useState({});
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingViews, setLoadingViews] = useState(true);
  const [loadingOrderCounts, setLoadingOrderCounts] = useState(true);
  const [error, setError] = useState(null);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { products, loading: loadingProducts } = useProducts();
  const [activeView, setActiveView] = useState("productStats"); // "productStats" or "salesChart"

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: "orderCount",
    direction: "desc",
  });

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

  // Fetch product views data
  useEffect(() => {
    const database = getDatabase();
    const viewsRef = ref(database, "productViews");

    const unsubscribe = onValue(
      viewsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const viewsData = snapshot.val();
          setProductViews(viewsData);
        } else {
          setProductViews({});
        }
        setLoadingViews(false);
      },
      (error) => {
        console.error("Error fetching product views:", error);
        setError("Kunne ikke hente produktvisninger: " + error.message);
        setLoadingViews(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch product order count data
  useEffect(() => {
    const database = getDatabase();
    const ordersCountRef = ref(database, "productOrders");

    const unsubscribe = onValue(
      ordersCountRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const orderCountData = snapshot.val();
          setProductOrders(orderCountData);
        } else {
          setProductOrders({});
        }
        setLoadingOrderCounts(false);
      },
      (error) => {
        console.error("Error fetching product order counts:", error);
        setError("Kunne ikke hente produktbestillinger: " + error.message);
        setLoadingOrderCounts(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to reset weekly view and order counts
  const handleResetWeeklyStats = async () => {
    if (isResetting) return;

    try {
      setIsResetting(true);
      const database = getDatabase();
      const updates = {};

      // Reset weekly view counts
      Object.keys(productViews).forEach((productId) => {
        updates[`productViews/${productId}/weekly/count`] = 0;
      });

      // Reset weekly order counts
      Object.keys(productOrders).forEach((productId) => {
        updates[`productOrders/${productId}/weekly/count`] = 0;
      });

      // Apply all updates in one batch operation
      await update(ref(database), updates);

      // Show success message
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    } catch (error) {
      console.error("Error resetting weekly stats:", error);
      setError("Kunne ikke nullstille ukentlige statistikker: " + error.message);
    } finally {
      setIsResetting(false);
    }
  };

  // Calculate statistics per product
  const productStats = useMemo(() => {
    if (
      loadingProducts ||
      loadingOrders ||
      loadingViews ||
      loadingOrderCounts ||
      !products ||
      !orders.length
    ) {
      return [];
    }

    // Create a map to track order counts for each product
    const stats = {};

    // Initialize stats object for all products
    products.forEach((product) => {
      const productViewData = productViews[product.id];
      const productOrderData = productOrders[product.id];

      stats[product.id] = {
        id: product.id,
        name: product.productName,
        image: product.image,
        price: product.price,
        orderCount: 0,
        totalRevenue: 0,
        stock: product.stock || 0,
        viewCount: productViewData?.total?.count || 0,
        weeklyViewCount: productViewData?.weekly?.count || 0,
        weeklyOrderCount: productOrderData?.weekly?.count || 0,
        totalOrderCount: productOrderData?.total?.count || 0,
        lastOrderedTimestamp: null,
        popularityScore: 0, // Will be calculated below
      };
    });

    // Count all order items
    orders.forEach((order) => {
      if (!order.items) return;

      order.items.forEach((item) => {
        if (stats[item.id]) {
          const quantity = item.quantity || 1;
          stats[item.id].orderCount += quantity;
          // Calculate revenue: price × quantity
          stats[item.id].totalRevenue += stats[item.id].price * quantity;
          // Track last ordered date
          if (
            !stats[item.id].lastOrderedTimestamp ||
            order.createdAt > stats[item.id].lastOrderedTimestamp
          ) {
            stats[item.id].lastOrderedTimestamp = order.createdAt;
          }
        }
      });
    });

    // Calculate popularity score (combination of weekly views and orders)
    // Formula: 1 × weekly views + 5 × weekly orders
    // This gives orders 5× more weight than views
    Object.values(stats).forEach((product) => {
      product.popularityScore =
        (product.weeklyViewCount || 0) + 5 * (product.weeklyOrderCount || 0);
    });

    // Convert to array for easier sorting and rendering
    return Object.values(stats);
  }, [
    products,
    orders,
    loadingProducts,
    loadingOrders,
    productViews,
    loadingViews,
    productOrders,
    loadingOrderCounts,
  ]);

  // Generate time series data for sales chart
  const salesOverTimeData = useMemo(() => {
    if (loadingProducts || loadingOrders || !products || !orders.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Get date range (past 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Initialize sales map for each product
    const salesByDay = {};
    products.forEach((product) => {
      salesByDay[product.id] = {};

      // Initialize each day with 0 sales
      for (
        let d = new Date(thirtyDaysAgo);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        salesByDay[product.id][dateStr] = 0;
      }
    });

    // Filter orders from the last 30 days and group by product and day
    orders
      .filter((order) => order.createdAt >= thirtyDaysAgo.getTime())
      .forEach((order) => {
        if (!order.items) return;

        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];

        order.items.forEach((item) => {
          if (
            salesByDay[item.id] &&
            salesByDay[item.id][orderDate] !== undefined
          ) {
            const quantity = item.quantity || 1;
            salesByDay[item.id][orderDate] += quantity;
          }
        });
      });

    // Get top 5 products by total orders
    const top5Products = [...productStats]
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 5);

    // Create labels for the last 30 days
    const labels = [];
    for (
      let d = new Date(thirtyDaysAgo);
      d <= today;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      // Format as DD/MM
      const [year, month, day] = dateStr.split("-");
      labels.push(`${day}/${month}`);
    }

    // Create datasets for chart
    const datasets = top5Products.map((product, index) => {
      const data = Object.keys(salesByDay[product.id])
        .sort()
        .map((date) => salesByDay[product.id][date]);

      // Generate a deterministic color based on product id
      const hue = parseInt(product.id.substring(0, 6), 16) % 360;

      return {
        label: product.name,
        data: data,
        borderColor: `hsl(${hue}, 70%, 50%)`,
        backgroundColor: `hsla(${hue}, 70%, 50%, 0.5)`,
        tension: 0.3,
      };
    });

    return {
      labels,
      datasets,
    };
  }, [productStats, orders, products, loadingOrders, loadingProducts]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Salg siste 30 dager",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Antall solgt",
        },
      },
      x: {
        title: {
          display: true,
          text: "Dato",
        },
      },
    },
  };

  // Sorting function
  const sortedProductStats = useMemo(() => {
    if (!productStats.length) return [];

    return [...productStats].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [productStats, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnName) => {
    if (sortConfig.key !== columnName) {
      return <FaSort className="inline ml-1 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="inline ml-1 text-primary" />
    ) : (
      <FaSortDown className="inline ml-1 text-primary" />
    );
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Aldri";
    return new Date(timestamp).toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const loading =
    loadingOrders || loadingProducts || loadingViews || loadingOrderCounts;

  // Render the statistics navigation
  const renderStatsNav = () => (
    <div className="mb-6 border-b border-gray-200">
      <ul className="flex flex-wrap text-sm font-medium text-center">
        <li className="mr-2">
          <button
            onClick={() => setActiveView("productStats")}
            className={`inline-flex items-center px-4 py-3 rounded-t-lg ${
              activeView === "productStats"
                ? "bg-base-300 border-b-2 border-pinegreen text-pinegreen"
                : "hover:text-pinegreen hover:bg-gray-100"
            }`}
          >
            <FaTable className="mr-2" /> Produktstatistikk
          </button>
        </li>
        <li className="mr-2">
          <button
            onClick={() => setActiveView("salesChart")}
            className={`inline-flex items-center px-4 py-3 rounded-t-lg ${
              activeView === "salesChart"
                ? "bg-base-300 border-b-2 border-pinegreen text-pinegreen"
                : "hover:text-pinegreen hover:bg-gray-100"
            }`}
          >
            <FaChartLine className="mr-2" /> Salg over tid
          </button>
        </li>
      </ul>
    </div>
  );

  // Render product statistics table
  const renderProductStatsView = () => (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-mabry text-lg text-primary">Produktstatistikk</h3>
        <div>
          <button
            onClick={handleResetWeeklyStats}
            disabled={isResetting}
            className={`inline-flex items-center px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-secondary/80 transition-all ${
              isResetting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isResetting ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : (
              <FaRedo className="mr-2" />
            )}
            Nullstill ukentlige statistikker
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
          Ukentlige statistikker er nullstilt!
        </div>
      )}

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-base-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-base-300 bg-base-300 text-left text-xs font-mabry text-pinegreen uppercase">
                Produkt
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("orderCount")}
              >
                Bestillinger {getSortIcon("orderCount")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("totalRevenue")}
              >
                Inntekt {getSortIcon("totalRevenue")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("price")}
              >
                Pris {getSortIcon("price")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("stock")}
              >
                Lager {getSortIcon("stock")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("viewCount")}
              >
                Visn. {getSortIcon("viewCount")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("weeklyViewCount")}
              >
                Ukentlige visn. {getSortIcon("weeklyViewCount")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("weeklyOrderCount")}
              >
                Ukentlige best. {getSortIcon("weeklyOrderCount")}
              </th>
              <th
                className="py-2 px-4 border-b border-base-300 bg-base-300 text-right text-xs font-mabry text-pinegreen uppercase cursor-pointer"
                onClick={() => requestSort("popularityScore")}
              >
                Pop. score {getSortIcon("popularityScore")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProductStats.length > 0 ? (
              sortedProductStats.map((product) => (
                <tr key={product.id} className="hover:bg-base-200">
                  <td className="py-3 px-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-10 w-10 object-contain"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-mabry text-sm text-pinegreen">
                          {product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabry text-sm text-right">
                    {product.orderCount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabry text-sm text-right">
                    {formatPrice(product.totalRevenue)}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm text-right">
                    {formatPrice(product.price)}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm text-right">
                    {product.stock}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm text-right">
                    {product.viewCount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm text-right">
                    {product.weeklyViewCount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabrylight text-sm text-right">
                    {product.weeklyOrderCount}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-200 font-mabry text-sm text-right">
                    {product.popularityScore}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-4 text-center font-mabrylight">
                  Ingen produktdata funnet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">Bestselger</h3>
          {productStats.length > 0 ? (
            <div>
              {(() => {
                const bestSeller = [...productStats].sort(
                  (a, b) => b.orderCount - a.orderCount
                )[0];
                return (
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={bestSeller.image}
                        alt={bestSeller.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-mabry text-primary">
                        {bestSeller.name}
                      </div>
                      <div className="font-mabrylight text-sm text-gray-600">
                        {bestSeller.orderCount} bestillinger
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="font-mabrylight text-primary">Ingen data</p>
          )}
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">
            Høyeste inntekt
          </h3>
          {productStats.length > 0 ? (
            <div>
              {(() => {
                const highestRevenue = [...productStats].sort(
                  (a, b) => b.totalRevenue - a.totalRevenue
                )[0];
                return (
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={highestRevenue.image}
                        alt={highestRevenue.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-mabry text-primary">
                        {highestRevenue.name}
                      </div>
                      <div className="font-mabrylight text-sm text-gray-600">
                        {formatPrice(highestRevenue.totalRevenue)}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="font-mabrylight text-primary">Ingen data</p>
          )}
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">Mest populært</h3>
          {productStats.length > 0 ? (
            <div>
              {(() => {
                const mostPopular = [...productStats].sort(
                  (a, b) => b.popularityScore - a.popularityScore
                )[0];
                return (
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={mostPopular.image}
                        alt={mostPopular.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-mabry text-primary">
                        {mostPopular.name}
                      </div>
                      <div className="font-mabrylight text-sm text-gray-600">
                        Score: {mostPopular.popularityScore}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <FaEye className="mr-1" /> {mostPopular.weeklyViewCount}
                        <FaShoppingCart className="ml-2 mr-1" />{" "}
                        {mostPopular.weeklyOrderCount}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="font-mabrylight text-primary">Ingen data</p>
          )}
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">Lavt lager</h3>
          {productStats.length > 0 ? (
            <div>
              {(() => {
                const lowStock = [...productStats]
                  .filter((p) => p.stock < 10) // Threshold for low stock
                  .sort((a, b) => a.stock - b.stock)[0];

                if (!lowStock) {
                  return (
                    <p className="font-mabrylight text-primary">
                      Alle produkter har godt lagernivå
                    </p>
                  );
                }

                return (
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        src={lowStock.image}
                        alt={lowStock.name}
                        className="h-12 w-12 object-contain"
                      />
                    </div>
                    <div className="ml-3">
                      <div className="font-mabry text-primary">
                        {lowStock.name}
                      </div>
                      <div className="font-mabrylight text-sm text-red-600">
                        Bare {lowStock.stock} på lager
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <p className="font-mabrylight text-primary">Ingen data</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render sales over time chart
  const renderSalesChartView = () => (
    <div>
      <h3 className="font-mabry text-lg text-primary mb-3">Salg over tid</h3>
      <div className="bg-base-300 p-4 rounded-lg shadow-md">
        <p className="font-mabrylight text-sm text-gray-600 mb-4">
          Grafen viser antall solgte enheter per dag for de 5 mest populære
          produktene.
        </p>
        <div className="h-96">
          {productStats.length > 0 ? (
            <Line options={chartOptions} data={salesOverTimeData} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="font-mabrylight text-primary">
                Ingen salgsdata tilgjengelig
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">
            Salgsutvikling
          </h3>
          <p className="font-mabrylight text-sm text-gray-600">
            Se salgsutvikling for de mest populære produktene. Bruk grafen til å
            analysere trender og sesongvariasjon.
          </p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <h3 className="font-mabry text-primary text-lg mb-2">Trender</h3>
          <p className="font-mabrylight text-sm text-gray-600">
            Identifiser salgstopper og vekstperioder for hver produkt. Dette gir
            verdifull innsikt for innkjøp og kampanjer.
          </p>
        </div>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="w-full">
      <h2 className="font-mabry text-xl text-primary mb-4">Statistikk</h2>

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
          {renderStatsNav()}

          {activeView === "productStats"
            ? renderProductStatsView()
            : renderSalesChartView()}
        </div>
      )}
    </div>
  );
}

export default AdminStatistics;
