
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // Laptop shortcut: Command + Shift + A
  useEffect(() => {
    function handleKeyDown(event) {
      if (
        event.metaKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "a"
      ) {
        event.preventDefault();
        navigate("/admin");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        aria-label="Metro Mens Wear home"
      >
        METRO
        <span>MENS WEAR</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <a href="/#about">About</a>
        <a href="/#store">Store</a>
        <Link to="/admin" className="admin-nav-link">Admin Login</Link>
      </div>

      <div className="nav-actions">
        <Link to="/shop" className="search-btn">
          ⌕
        </Link>

        <Link to="/cart" className="cart-btn">
          🛒
          <span>{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
