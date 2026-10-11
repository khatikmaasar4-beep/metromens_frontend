const features = [
  {
    number: "01",
    title: "QUALITY",
    text: "We focus on clothing that looks good and feels comfortable.",
  },

  {
    number: "02",
    title: "LATEST STYLES",
    text: "Discover modern styles and everyday fashion for men.",
  },

  {
    number: "03",
    title: "GREAT VALUE",
    text: "Quality men's fashion at prices that make sense.",
  },

  {
    number: "04",
    title: "TRUSTED STORE",
    text: "A local men's fashion store built around customer trust.",
  },
];

function WhyUs() {
  return (
    <section className="why-section" id="about">

      <div className="why-heading">

        <p>WHY METRO</p>

        <h2>
          STYLE.
          <br />
          QUALITY.
          <br />
          TRUST.
        </h2>

      </div>

      <div className="why-grid">

        {features.map((feature) => (

          <div
            className="why-card"
            key={feature.number}
          >

            <span>
              {feature.number}
            </span>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.text}
            </p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default WhyUs;