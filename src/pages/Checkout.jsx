import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

const WHATSAPP_NUMBER = "919425495385";

function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    address: "",
    city: "",
    pincode: "",
    notes: "",
  });

  const [loading, setLoading] =
    useState(false);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ========================================
  // WHATSAPP ORDER
  // ========================================

  const handleWhatsAppOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      // ==================================
      // GET FRESH PRODUCTS
      // ==================================
      // Cart may contain an old/wrong MongoDB ID.
      // Resolve every cart item against fresh DB data.

      const productsResponse =
        await fetch(
          `${API_URL}/api/products`
        );

      const productsData =
        await productsResponse.json();

      if (
        !productsResponse.ok ||
        !productsData.success
      ) {
        throw new Error(
          "Products load nahi ho rahe. Please try again."
        );
      }

      const freshProducts =
        productsData.products || [];


      // ==================================
      // RESOLVE CART ITEMS
      // ==================================

      const orderItems =
        cart.map((item) => {
          const targetId = String(
            item.productId ||
            item._id ||
            item.id ||
            ""
          );

          const product =
            freshProducts.find(
              (candidate) =>
                String(candidate._id) ===
                targetId
            );

          if (!product) {
            throw new Error(
              `${item.name} (${item.size}) is currently unavailable or not found.`
            );
          }

          const sizeStock =
            product.sizeStock || {};

          const hasSizeStock =
            Object.keys(sizeStock).length > 0;

          const available = hasSizeStock
            ? Number(
                sizeStock[item.size] || 0
              )
            : Number(
                product.stock || 0
              );

          if (
            available <
            Number(item.quantity)
          ) {
            throw new Error(
              `${product.name} (${item.size}) has only ${available} item(s) left in stock.`
            );
          }

          return {
            productId:
              product._id,

            id:
              product._id,

            name:
              product.name,

            image:
              product.image,

            size:
              item.size,

            quantity:
              Number(item.quantity),

            price:
              Number(product.price),

            total:
              Number(product.price) *
              Number(item.quantity),
          };
        });


      // ==================================
      // SEND ORDER TO BACKEND
      // ==================================

      const response =
        await fetch(
          `${API_URL}/api/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer: form,

              items: orderItems,

              subtotal:
                Number(
                  cartTotal
                ),

              delivery: 0,

              total:
                Number(
                  cartTotal
                ),

              paymentMethod:
                "COD",
            }),
          }
        );


      const data =
        await response.json();


      // ==================================
      // STOCK / SERVER ERROR
      // ==================================

      if (!response.ok) {

        if (
          response.status ===
          409
        ) {
          throw new Error(
            data.message ||
              "Some product is out of stock."
          );
        }

        throw new Error(
          data.message ||
            "Order failed"
        );
      }


      // ==================================
      // ORDER SUCCESS
      // ==================================

      console.log(
        "Order saved:",
        data.order
      );


      // ==================================
      // WHATSAPP MESSAGE
      // ==================================

      let message =
        `*NEW ORDER - METRO MEN'S WEAR*%0A%0A`;

      message +=
        `*ORDER ID:* ${data.order._id}%0A`;

      message +=
        `*PAYMENT:* CASH ON DELIVERY%0A%0A`;


      // ==================================
      // CUSTOMER DETAILS
      // ==================================

      message +=
        `*CUSTOMER DETAILS*%0A`;

      message +=
        `Name: ${form.name}%0A`;

      message +=
        `Mobile: ${form.mobile}%0A`;

      message +=
        `Address: ${form.address}%0A`;

      message +=
        `City: ${form.city}%0A`;

      message +=
        `Pincode: ${form.pincode}%0A`;

      if (form.notes) {
        message +=
          `Notes: ${form.notes}%0A`;
      }


      // ==================================
      // ORDER ITEMS
      // ==================================

      message +=
        `%0A*ORDER ITEMS*%0A`;

      cart.forEach(
        (item, index) => {

          message +=
            `%0A${index + 1}. ${item.name}%0A`;

          message +=
            `Size: ${item.size}%0A`;

          message +=
            `Quantity: ${item.quantity}%0A`;

          message +=
            `Price: ₹${item.price}%0A`;

          message +=
            `Item Total: ₹${
              item.price *
              item.quantity
            }%0A`;
        }
      );


      // ==================================
      // TOTAL
      // ==================================

      message +=
        `%0A--------------------%0A`;

      message +=
        `*SUBTOTAL: ₹${cartTotal}*%0A`;

      message +=
        `Delivery: To be confirmed via WhatsApp%0A`;

      message +=
        `*TOTAL: ₹${cartTotal}*%0A`;

      message +=
        `%0A*Policy: Returns/exchanges not accepted*%0A`;

      message +=
        `%0AThank you for shopping with Metro Men's Wear!`;


      // ==================================
      // OPEN WHATSAPP
      // ==================================

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

      window.open(
        whatsappURL,
        "_blank"
      );


      alert(
        "Order placed successfully! 🎉"
      );

      clearCart();

    } catch (error) {

      console.error(
        "Order Error:",
        error
      );

      alert(
        error.message ||
          "Order save nahi hua. Please try again."
      );

    } finally {

      setLoading(false);
    }
  };


  // ========================================
  // EMPTY CART
  // ========================================

  if (cart.length === 0) {
    return (
      <main className="checkout-empty">

        <span>
          CHECKOUT
        </span>

        <h1>
          YOUR CART
          <br />
          IS EMPTY.
        </h1>

        <p>
          Add some products
          before checking out.
        </p>

        <Link
          to="/shop"
          className="checkout-back-btn"
        >
          GO TO SHOP →
        </Link>

      </main>
    );
  }


  // ========================================
  // CHECKOUT PAGE
  // ========================================

  return (
    <main className="checkout-page">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="checkout-header">

        <span>
          METRO MENS WEAR
        </span>

        <h1>
          CHECK
          <br />
          OUT.
        </h1>

        <p>
          Complete your details
          to place your order.
        </p>

      </div>


      <div className="checkout-layout">

        {/* ================================= */}
        {/* CUSTOMER FORM */}
        {/* ================================= */}

        <form
          className="checkout-form"
          onSubmit={
            handleWhatsAppOrder
          }
        >

          {/* CUSTOMER */}

          <div className="checkout-section-title">

            <span>
              01
            </span>

            <h2>
              YOUR DETAILS
            </h2>

          </div>


          <div className="form-grid">

            {/* NAME */}

            <div className="form-group">

              <label>
                FULL NAME
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* MOBILE */}

            <div className="form-group">

              <label>
                MOBILE NUMBER
              </label>

              <input
                type="tel"
                name="mobile"
                placeholder="Enter mobile number"
                value={
                  form.mobile
                }
                onChange={
                  handleChange
                }
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />

            </div>

          </div>


          {/* ADDRESS */}

          <div className="checkout-section-title second">

            <span>
              02
            </span>

            <h2>
              DELIVERY ADDRESS
            </h2>

          </div>


          <div className="form-group">

            <label>
              ADDRESS
            </label>

            <textarea
              name="address"
              placeholder="House no., street, area..."
              value={
                form.address
              }
              onChange={
                handleChange
              }
              rows="4"
              required
            ></textarea>

          </div>


          <div className="form-grid">

            {/* CITY */}

            <div className="form-group">

              <label>
                CITY
              </label>

              <input
                type="text"
                name="city"
                placeholder="City"
                value={
                  form.city
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>


            {/* PINCODE */}

            <div className="form-group">

              <label>
                PINCODE
              </label>

              <input
                type="text"
                name="pincode"
                placeholder="6-digit pincode"
                value={
                  form.pincode
                }
                onChange={
                  handleChange
                }
                pattern="[0-9]{6}"
                maxLength="6"
                required
              />

            </div>

          </div>


          {/* NOTES */}

          <div className="form-group">

            <label>
              ORDER NOTES
              (OPTIONAL)
            </label>

            <textarea
              name="notes"
              placeholder="Any special instructions..."
              value={
                form.notes
              }
              onChange={
                handleChange
              }
              rows="3"
            ></textarea>

          </div>


          {/* ================================= */}
          {/* PAYMENT */}
          {/* ================================= */}

          <div className="checkout-payment-box">

            <div>

              <span>
                PAYMENT METHOD
              </span>

              <strong>
                CASH ON DELIVERY
              </strong>

            </div>

            <small>
              Pay when your order
              is delivered.
            </small>

          </div>


          {/* ================================= */}
          {/* ORDER BUTTON */}
          {/* ================================= */}

          <button
            type="submit"
            className="whatsapp-order-btn"
            disabled={loading}
          >
            {loading
              ? "CHECKING STOCK..."
              : "ORDER ON WHATSAPP →"}
          </button>


          <Link
            to="/cart"
            className="back-cart-link"
          >
            ← BACK TO CART
          </Link>

        </form>


        {/* ================================= */}
        {/* ORDER SUMMARY */}
        {/* ================================= */}

        <aside className="checkout-summary">

          <span>
            ORDER SUMMARY
          </span>

          <h2>
            ₹{cartTotal}
          </h2>


          <div className="checkout-products">

            {cart.map(
              (item) => (

                <div
                  className="checkout-product"
                  key={`${item.id}-${item.size}`}
                >

                  <img
                    src={
                      item.image?.startsWith(
                        "/uploads"
                      )
                        ? `${API_URL}${item.image}`
                        : item.image
                    }
                    alt={
                      item.name
                    }
                  />


                  <div>

                    <h3>
                      {
                        item.name
                      }
                    </h3>

                    <p>
                      Size:{" "}
                      {
                        item.size
                      }{" "}
                      ×{" "}
                      {
                        item.quantity
                      }
                    </p>

                    <strong>
                      ₹
                      {
                        item.price *
                        item.quantity
                      }
                    </strong>

                  </div>

                </div>

              )
            )}

          </div>


          <div className="checkout-line"></div>


          <div className="checkout-total-row">

            <span>
              SUBTOTAL
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>


          <div className="checkout-total-row">

            <span>
              DELIVERY
            </span>

            <strong style={{ fontSize: "11px", fontWeight: "normal", textAlign: "right" }}>
              To be confirmed via WhatsApp
            </strong>

          </div>


          <div className="checkout-line"></div>


          <div className="checkout-final-total">

            <span>
              TOTAL
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

          <p style={{ marginTop: "15px", fontSize: "11px", color: "#888", lineHeight: "1.5" }}>
            * Note: Returns/exchanges are not accepted. Delivery policy will be confirmed via WhatsApp.
          </p>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;