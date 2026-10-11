import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  // Laptop: Command + Shift + A
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

  // Mobile: tap the logo 5 times
  function handleLogoTap() {
    tapCount.current += 1;

    clearTimeout(tapTimer.current);

    if (tapCount.current >= 5) {
      tapCount.current = 0;
      navigate("/admin");
      return;
    }

    tapTimer.current = setTimeout(() => {
      tapCount.current = 0;
    }, 2000);
  }

  useEffect(() => {
    return () => clearTimeout(tapTimer.current);
  }, []);

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="logo"
        onClick={handleLogoTap}
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