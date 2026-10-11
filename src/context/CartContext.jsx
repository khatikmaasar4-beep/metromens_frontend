import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product, size = product.sizes?.[0] || "") => {
    const productId = String(product._id || product.id || "");
    if (!productId) return;

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) =>
          String(item.productId || item._id || item.id) === productId &&
          item.size === size
      );

      if (existing) {
        return currentCart.map((item) =>
          String(item.productId || item._id || item.id) === productId &&
          item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          id: productId,
          _id: productId,
          productId: productId,
          size,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (id, size) => {
    const targetId = String(id);
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          !(
            String(item.productId || item._id || item.id) === targetId &&
            item.size === size
          )
      )
    );
  };

  const increaseQuantity = (id, size) => {
    const targetId = String(id);
    setCart((currentCart) =>
      currentCart.map((item) =>
        String(item.productId || item._id || item.id) === targetId &&
        item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id, size) => {
    const targetId = String(id);
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          String(item.productId || item._id || item.id) === targetId &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}