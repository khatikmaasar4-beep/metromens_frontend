import { Link } from "react-router-dom";

function Categories() {
  const categories = [
    {
      number: "01",
      small: "Classic & Modern",
      title: "SHIRTS",
      image: "/images/shirt.webp",
      category: "Shirts",
    },
    {
      number: "02",
      small: "Everyday Essentials",
      title: "T-SHIRTS",
      image: "/images/tshirt.webp",
      category: "T-Shirts",
    },
    {
      number: "03",
      small: "Denim Collection",
      title: "JEANS",
      image: "/images/jeans.jpg",
      category: "Jeans",
    },
    {
      number: "04",
      small: "Smart & Comfortable",
      title: "TROUSERS",
      image: "/images/trouser.webp",
      category: "Trousers",
    },
  ];

  return (
    <section className="categories" id="categories">

      <div className="section-heading">
        <p>EXPLORE OUR COLLECTION</p>

        <h2>
          SHOP BY
          <br />
          CATEGORY
        </h2>
      </div>

      <div className="category-grid">

        {categories.map((item) => (
          <Link
            to={`/shop?category=${encodeURIComponent(
              item.category
            )}`}
            className="category-card"
            key={item.number}
          >

            <img
              src={item.image}
              alt={item.title}
              className="category-image"
            />

            <div className="category-overlay"></div>

            <span className="category-number">
              {item.number}
            </span>

            <div className="category-content">

              <span>{item.small}</span>

              <h3>{item.title}</h3>

              <button>
                EXPLORE →
              </button>

            </div>

          </Link>
        ))}

      </div>

    </section>
  );
}

export default Categories;