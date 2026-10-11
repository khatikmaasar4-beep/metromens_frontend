
import { Link } from "react-router-dom";
import products from "../data/products";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";

function Products() {
  return (
    <section className="products-section">
      <div className="products-heading">
        <div>
          <p>OUR COLLECTION</p>
          <h2>
            NEW
            <br />
            ARRIVALS
          </h2>
        </div>

        <Link to="/shop" className="view-all">
          VIEW ALL →
        </Link>
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <ScrollReveal
            key={product.id}
            className={`product-reveal product-reveal-${index % 4}`}
          >
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

export default Products;
