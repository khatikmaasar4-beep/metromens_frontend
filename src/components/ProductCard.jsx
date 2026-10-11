import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  // Already full URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Uploaded image from backend
  if (image.startsWith("/uploads")) {
    return `${API_URL}${image}`;
  }

  // Existing frontend images
  return image;
}

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl = getImageUrl(product.image);

  // Demo products marked as coming soon
  const isComingSoon = product.comingSoon === true;

  // Normal stock check for real products
  const isOutOfStock =
    !isComingSoon && Number(product.stock || 0) <= 0;

  return (
    <div className="product-card">
      <Link
        to={`/product/${product._id || product.id}`}
        className="product-image"
      >
        <img
          src={imageUrl}
          alt={product.name}
        />

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="product-info">
        <p>{product.category}</p>

        <h3>{product.name}</h3>

        <div className="product-price">
          <strong>₹{product.price}</strong>

          {product.oldPrice > product.price && (
            <del>₹{product.oldPrice}</del>
          )}
        </div>

        <button
          className="quick-add visible-add"
          disabled={isComingSoon || isOutOfStock}
          onClick={() => {
            if (isComingSoon) {
              return;
            }

            if (isOutOfStock) {
              alert("This product is out of stock.");
              return;
            }

            const firstAvailableSize =
              product.sizes?.find(
                (size) =>
                  Number(product.sizeStock?.[size] || 0) > 0
              );

            addToCart(
              product,
              firstAvailableSize ||
                product.sizes?.[0] ||
                ""
            );
          }}
        >
          {isComingSoon
            ? "COMING SOON"
            : isOutOfStock
              ? "OUT OF STOCK"
              : "ADD TO CART"}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;