import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { API_URL } from "../config";

function Shop() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const selectedCategory =
    searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Shirts",
    "T-Shirts",
    "Jeans",
    "Trousers",
  ];

  // ========================================
  // GET PRODUCTS FROM MONGODB
  // ========================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/products`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Products fetch nahi hue"
          );
        }

        setProducts(
          data.products || []
        );
      } catch (error) {
        console.error(error);

      setError(
  `Products load nahi ho rahe: ${error.message}`
);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ========================================
  // CATEGORY FILTER
  // ========================================

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category
              ?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  const handleCategory = (
    category
  ) => {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({
        category,
      });
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="shop-page">
        <div className="shop-header">
          <p>METRO MENS WEAR</p>

          <h1>
            SHOP COLLECTION
          </h1>

          <span>
            Loading collection...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="shop-page">

      {/* HEADER */}

      <div className="shop-header">

        <p>
          METRO MENS WEAR
        </p>

        <h1>
          SHOP COLLECTION
        </h1>

        <span>
          Discover our latest
          men's fashion collection.
        </span>

      </div>


      {/* FILTERS */}

      <div className="shop-filters">

        {categories.map(
          (category) => (

            <button
              key={category}
              onClick={() =>
                handleCategory(
                  category
                )
              }
              className={
                selectedCategory ===
                category
                  ? "active"
                  : ""
              }
            >
              {category}
            </button>

          )
        )}

      </div>


      {/* ERROR */}

      {error && (

        <div className="shop-error">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

        </div>

      )}


      {/* PRODUCTS */}

      {!error && (

        <div className="products-grid">

          {filteredProducts.length >
          0 ? (

            filteredProducts.map(
              (product) => (

                <ProductCard
                  key={
                    product._id
                  }
                  product={{
                    ...product,
                    id: product._id,
                    _id: product._id,
                    productId: product._id,
                  }}
                />

              )
            )

          ) : (

            <div className="no-products">

              <h2>
                No products found
              </h2>

              <p>
                There are currently
                no products in this
                category.
              </p>

            </div>

          )}

        </div>

      )}

    </section>
  );
}

export default Shop;