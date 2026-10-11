function Store() {
  return (
    <section className="store-section" id="store">

      <div className="store-content">

        <p>VISIT OUR STORE</p>

        <h2>
          COME FIND
          <br />
          YOUR
          <br />
          STYLE.
        </h2>

        <p>
          Explore our latest men's collection in-store
          and find the style that fits you.
        </p>

        <div className="store-info">

          <div>
            <span>LOCATION</span>
            <a
              href="https://share.google/PksBbCkvKC6DS5IvP"
              target="_blank"
              rel="noopener noreferrer"
              className="store-address-link"
            >
              Metro Men's Wear, in front of Saklecha Stationery, near Kewalram Petrol Pump, Chouraha, Khandwa, Madhya Pradesh 450001
            </a>
          </div>

          <div>
            <span>CONTACT & WHATSAPP</span>
            <a href="tel:+919425495385" className="phone-nowrap">
              +91 94254 95385
            </a>
            <a
              href="https://wa.me/919425495385"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp: +91 94254 95385
            </a>
          </div>

          <div>
            <span>STORE HOURS</span>
            <strong>10:30 AM–9 PM</strong>
            <small className="store-meta-note">Open all days</small>
          </div>

          <div>
            <span>POLICIES</span>
            <strong>Returns/exchanges: Not accepted</strong>
            <small className="store-meta-note">Delivery: To be confirmed via WhatsApp</small>
          </div>

        </div>

        <div className="store-actions">
          <a
            href="https://share.google/PksBbCkvKC6DS5IvP"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn"
          >
            GET DIRECTIONS →
          </a>

          <a
            href="https://wa.me/919425495385"
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn store-secondary-btn"
          >
            WHATSAPP US →
          </a>

          <a
            href="https://www.instagram.com/metro_mens_wear_khandwa_mp?cplk=MWNoMjdubzR3NWdpaQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="store-btn store-secondary-btn"
          >
            INSTAGRAM ↗
          </a>
        </div>

      </div>


      <div className="store-visual">

        <img
          src="/images/store.jpg"
          alt="Metro Men's Wear Store"
        />

      </div>

    </section>
  );
}

export default Store;