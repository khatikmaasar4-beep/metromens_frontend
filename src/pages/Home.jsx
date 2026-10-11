
import Categories from "../components/Categories";
import Products from "../components/Products";
import WhyUs from "../components/WhyUs";
import Store from "../components/Store";
import ScrollReveal from "../components/ScrollReveal";

function Home() {
  return (
    <>
      <main className="hero">
        <div className="hero-content">
          <p className="hero-label">
            METRO MENS WEAR
          </p>

          <h1>
            ELEVATE YOUR
            <br />
            EVERYDAY STYLE.
          </h1>

          <p className="hero-description">
            Discover premium men's fashion
            <br />
            made for every occasion.
          </p>

          <a href="#categories" className="shop-btn">
            SHOP COLLECTION →
          </a>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-men.jpg"
            alt="Men's Fashion"
          />
        </div>
      </main>

      <div id="categories">
        <ScrollReveal>
          <Categories />
        </ScrollReveal>
      </div>

      <ScrollReveal>
        <Products />
      </ScrollReveal>

      <ScrollReveal>
        <WhyUs />
      </ScrollReveal>

      <ScrollReveal>
        <Store />
      </ScrollReveal>
    </>
  );
}

export default Home;
