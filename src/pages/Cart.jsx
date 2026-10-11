import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <main className="empty-cart">

        <span className="cart-label">
          YOUR SHOPPING BAG
        </span>

        <h1>
          YOUR CART
          <br />
          IS EMPTY.
        </h1>

        <p>
          Looks like you haven't added anything
          to your cart yet.
        </p>

        <Link
          to="/shop"
          className="continue-shopping"
        >
          CONTINUE SHOPPING →
        </Link>

      </main>
    );
  }

  return (
    <main className="cart-page">

      {/* HEADER */}

      <div className="cart-header">

        <span>
          YOUR SHOPPING BAG
        </span>

        <h1>
          CART
        </h1>

        <p>
          {cart.length} item
          {cart.length > 1 ? "s" : ""} in your bag
        </p>

      </div>


      {/* CART LAYOUT */}

      <div className="cart-layout">

        {/* ITEMS */}

        <div className="cart-items">

          {cart.map((item) => (

            <div
              className="cart-item"
              key={`${item.id}-${item.size}`}
            >

              {/* IMAGE */}

              <Link
                to={`/product/${item.id}`}
                className="cart-item-image"
              >
              <img
  src={
    item.image?.startsWith("http://") ||
    item.image?.startsWith("https://")
      ? item.image
      : item.image?.startsWith("/uploads")
        ? `${API_URL}${item.image}`
        : item.image
  }
  alt={item.name}
  onError={(e) => {
    e.currentTarget.style.visibility = "hidden";
  }}
/>
              </Link>


              {/* INFORMATION */}

              <div className="cart-item-info">

                <span className="cart-category">
                  {item.category}
                </span>

                <h3>
                  {item.name}
                </h3>

                <p>
                  Size: <strong>{item.size}</strong>
                </p>

                <strong className="cart-item-price">
                  ₹{item.price}
                </strong>

              </div>


              {/* QUANTITY */}

              <div className="cart-quantity">

                <span>QUANTITY</span>

                <div className="quantity-box">

                  <button
                    onClick={() =>
                      decreaseQuantity(
                        item.id,
                        item.size
                      )
                    }
                  >
                    −
                  </button>

                  <strong>
                    {item.quantity}
                  </strong>

                  <button
                    onClick={() =>
                      increaseQuantity(
                        item.id,
                        item.size
                      )
                    }
                  >
                    +
                  </button>

                </div>

              </div>


              {/* TOTAL */}

              <div className="cart-item-total">

                <span>TOTAL</span>

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

              </div>


              {/* REMOVE */}

              <button
                className="cart-remove"
                onClick={() =>
                  removeFromCart(
                    item.id,
                    item.size
                  )
                }
              >
                REMOVE ×
              </button>

            </div>

          ))}

        </div>


        {/* SUMMARY */}

        <aside className="cart-summary">

          <span>
            ORDER SUMMARY
          </span>

          <h2>
            ₹{cartTotal}
          </h2>

          <div className="summary-row">
            <span>Subtotal</span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>

            <strong style={{ fontSize: "11px", fontWeight: "normal", textAlign: "right" }}>
              To be confirmed via WhatsApp
            </strong>
          </div>

          <div className="summary-line"></div>

          <div className="summary-total">
            <span>TOTAL</span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <Link to="/checkout" className="checkout-btn">
  PROCEED TO CHECKOUT →
</Link>

          <Link
            to="/shop"
            className="keep-shopping"
          >
            ← CONTINUE SHOPPING
          </Link>

          <p style={{ marginTop: "15px", fontSize: "11px", color: "#888", lineHeight: "1.5" }}>
            * Note: Returns/exchanges are not accepted. Delivery policy will be confirmed via WhatsApp.
          </p>

        </aside>

      </div>

    </main>
  );
}

export default Cart;