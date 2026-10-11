import { useEffect, useState } from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  return image;
}

function ProductDetails() {
  const { id } = useParams();

  const { addToCart } =
    useCart();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [size, setSize] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);


  // ========================================
  // FETCH PRODUCT
  // ========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/api/products/${id}`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Product not found"
          );
        }

        const mongoProduct =
          data.product;

        setProduct({
          ...mongoProduct,
          id: mongoProduct._id,
          _id: mongoProduct._id,
          productId: mongoProduct._id,
        });

        // ==================================
        // FIRST AVAILABLE SIZE
        // ==================================

        const sizes =
          mongoProduct.sizes || [];

        const sizeStock =
          mongoProduct.sizeStock || {};

        const firstAvailableSize =
          sizes.find(
            (item) =>
              Number(
                sizeStock[item] || 0
              ) > 0
          );

        if (firstAvailableSize) {
          setSize(
            firstAvailableSize
          );
        } else if (
          sizes.length > 0
        ) {
          setSize(
            sizes[0]
          );
        }

      } catch (error) {
        console.error(error);

        setError(
          "Product load nahi ho raha."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  // ========================================
  // SIZE STOCK
  // ========================================

  const getSizeStock = (
    selectedSize
  ) => {
    if (!product) {
      return 0;
    }

    // New size-wise inventory
    if (
      product.sizeStock
    ) {
      return Number(
        product.sizeStock[
          selectedSize
        ] || 0
      );
    }

    // Legacy product fallback
    return Number(
      product.stock || 0
    );
  };


  const selectedSizeStock =
    getSizeStock(size);


  // ========================================
  // QUANTITY
  // ========================================

  const increaseQuantity = () => {
    if (
      quantity <
      selectedSizeStock
    ) {
      setQuantity(
        (previous) =>
          previous + 1
      );
    }
  };


  const decreaseQuantity = () => {
    setQuantity(
      (previous) =>
        Math.max(
          1,
          previous - 1
        )
    );
  };


  // ========================================
  // CHANGE SIZE
  // ========================================

  const handleSizeChange = (
    selectedSize
  ) => {
    const available =
      getSizeStock(
        selectedSize
      );

    if (available <= 0) {
      return;
    }

    setSize(
      selectedSize
    );

    // Reset quantity when
    // customer changes size
    setQuantity(1);
  };


  // ========================================
  // ADD TO CART
  // ========================================

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    if (!size) {
      alert(
        "Please select a size."
      );

      return;
    }

    const available =
      getSizeStock(size);

    if (available <= 0) {
      alert(
        `${size} size is out of stock.`
      );

      return;
    }

    if (
      quantity >
      available
    ) {
      alert(
        `Only ${available} ${size} size item(s) available.`
      );

      return;
    }

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(
        product,
        size
      );
    }

    alert(
      `${product.name} (${size}) added to cart`
    );
  };


  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="product-loading">

        <span>
          METRO MENS WEAR
        </span>

        <h1>
          LOADING
          <br />
          PRODUCT...
        </h1>

      </main>
    );
  }


  // ========================================
  // ERROR
  // ========================================

  if (
    error ||
    !product
  ) {
    return (
      <main className="product-not-found">

        <h2>
          Product Not Found
        </h2>

        <p>
          {error ||
            "This product does not exist."}
        </p>

        <Link to="/shop">
          ← BACK TO SHOP
        </Link>

      </main>
    );
  }


  // ========================================
  // PRODUCT
  // ========================================

  return (
    <section className="product-details">

      <Link
        to="/shop"
        className="back-shop"
      >
        ← BACK TO SHOP
      </Link>


      <div className="product-details-grid">

        {/* ================================= */}
        {/* IMAGE */}
        {/* ================================= */}

        <div className="details-image">

          <img
            src={getImageUrl(
              product.image
            )}
            alt={
              product.name
            }
          />

          {product.badge && (
            <span className="details-badge">
              {product.badge}
            </span>
          )}

        </div>


        {/* ================================= */}
        {/* DETAILS */}
        {/* ================================= */}

        <div className="details-info">

          <span className="details-category">
            {product.category}
          </span>


          <h1>
            {product.name}
          </h1>


          {/* PRICE */}

          <div className="details-price">

            <strong>
              ₹{product.price}
            </strong>

            {product.oldPrice >
              product.price && (
              <del>
                ₹
                {
                  product.oldPrice
                }
              </del>
            )}

          </div>


          {/* DESCRIPTION */}

          <p className="details-description">
            {product.description ||
              "Premium men's fashion designed for comfort and everyday style."}
          </p>


          {/* ================================= */}
          {/* TOTAL STOCK */}
          {/* ================================= */}

          <div className="product-stock-info">

            {Number(
              product.stock || 0
            ) > 0 ? (
              <>
                <span>
                  ✓ IN STOCK
                </span>

                <small>
                  {
                    product.stock
                  }{" "}
                  total available
                </small>
              </>
            ) : (
              <span>
                OUT OF STOCK
              </span>
            )}

          </div>


          {/* ================================= */}
          {/* SIZE */}
          {/* ================================= */}

          {product.sizes &&
            product.sizes.length >
              0 && (

            <div className="size-section">

              <div className="size-heading">

                <span>
                  SELECT SIZE
                </span>

                {size && (
                  <strong>
                    {size}
                  </strong>
                )}

              </div>


              <div className="size-options">

                {product.sizes.map(
                  (item) => {

                    const available =
                      getSizeStock(
                        item
                      );

                    const isOutOfStock =
                      available <= 0;

                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={
                          isOutOfStock
                        }
                        className={
                          size === item
                            ? "selected"
                            : ""
                        }
                        onClick={() =>
                          handleSizeChange(
                            item
                          )
                        }
                      >

                        <span>
                          {item}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>


              {/* SIZE AVAILABILITY */}

              {size && (
                <div className="selected-size-stock">

                  {selectedSizeStock >
                  0 ? (
                    <>
                      <span>
                        ✓ {size} SIZE
                        AVAILABLE
                      </span>

                      <small>
                        {
                          selectedSizeStock
                        }{" "}
                        unit
                        {selectedSizeStock !==
                        1
                          ? "s"
                          : ""}{" "}
                        left
                      </small>
                    </>
                  ) : (
                    <span>
                      {size} SIZE
                      OUT OF STOCK
                    </span>
                  )}

                </div>
              )}

            </div>
          )}


          {/* ================================= */}
          {/* QUANTITY */}
          {/* ================================= */}

          <div className="quantity-section">

            <span>
              QUANTITY
            </span>

            <div className="quantity-box">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= 1
                }
              >
                −
              </button>

              <span>
                {quantity}
              </span>

              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                disabled={
                  quantity >=
                  selectedSizeStock
                }
              >
                +
              </button>

            </div>

            {selectedSizeStock >
              0 && (
              <small className="quantity-stock-note">
                Maximum{" "}
                {
                  selectedSizeStock
                }{" "}
                available
              </small>
            )}

          </div>


          {/* ================================= */}
          {/* ADD CART */}
          {/* ================================= */}

          <button
            type="button"
            className="details-cart-btn"
            onClick={
              handleAddToCart
            }
            disabled={
              !size ||
              selectedSizeStock <=
                0
            }
          >
            {selectedSizeStock <=
            0
              ? "OUT OF STOCK"
              : "ADD TO CART →"}
          </button>


          {/* ================================= */}
          {/* META */}
          {/* ================================= */}

          <div className="product-meta">

            <span>
              ✓ Premium Quality
            </span>

            <span>
              ✕ Returns/exchanges: Not accepted
            </span>

            <span>
              ✓ Delivery: To be confirmed via WhatsApp
            </span>

            <span>
              ✓ Secure Shopping
            </span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default ProductDetails;