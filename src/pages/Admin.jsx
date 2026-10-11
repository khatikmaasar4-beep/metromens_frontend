import { useEffect, useState } from "react";
import { API_URL } from "../config";

const emptyProduct = {
  name: "",
  category: "Shirts",
  price: "",
  oldPrice: "",
  badge: "NEW",
  image: "",
  description: "",
  sizes: "S, M, L, XL",
  stock: "",
};

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [productLoading, setProductLoading] =
    useState(false);

  const [imageUploading, setImageUploading] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [sizeStock, setSizeStock] =
    useState({});

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [productForm, setProductForm] =
    useState(emptyProduct);

  const token = localStorage.getItem(
    "metro_admin_token"
  );

  // ========================================
  // AUTH
  // ========================================

  useEffect(() => {
    if (!token) {
      window.location.href = "/admin";
    }
  }, [token]);

  // ========================================
  // FETCH ORDERS
  // ========================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "metro_admin_token"
        );

        window.location.href = "/admin";
        return;
      }

      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error(
        "Orders error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/products`
      );

      const data =
        await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(
        "Products error:",
        error
      );
    }
  };

  useEffect(() => {
    if (!token) return;

    fetchOrders();
    fetchProducts();
  }, []);

  // ========================================
  // PRODUCT SIZES
  // ========================================

  const getSizeList = () => {
    return productForm.sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  };

  // ========================================
  // PRODUCT INPUT
  // ========================================

  const handleProductChange = (e) => {
    const { name, value } = e.target;

    setProductForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ========================================
  // SIZE STOCK INPUT
  // ========================================

  const handleSizeStockChange = (
    size,
    value
  ) => {
    const numberValue =
      value === ""
        ? ""
        : Math.max(
            0,
            Number(value)
          );

    setSizeStock((current) => ({
      ...current,
      [size]: numberValue,
    }));
  };

  // ========================================
  // TOTAL STOCK
  // ========================================

  const totalSizeStock =
    getSizeList().reduce(
      (total, size) =>
        total +
        (Number(
          sizeStock[size]
        ) || 0),
      0
    );

  // ========================================
  // IMAGE UPLOAD
  // ========================================

  const handleImageUpload = async (e) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      alert(
        "Image 10MB se chhoti honi chahiye."
      );

      e.target.value = "";
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      alert(
        "Sirf JPG, JPEG, PNG aur WEBP images allowed hain."
      );

      e.target.value = "";
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
    setImageUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const response =
        await fetch(
          `${API_URL}/api/upload-image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Image upload failed"
        );
      }

      setProductForm(
        (current) => ({
          ...current,
          image: data.image,
        })
      );

      setImagePreview(
        `${API_URL}${data.image}`
      );

      alert(
        "Image uploaded successfully ✅"
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setProductForm(
        (current) => ({
          ...current,
          image: "",
        })
      );

      setImagePreview("");

      alert(
        error.message ||
          "Image upload failed."
      );
    } finally {
      setImageUploading(false);
    }
  };

  // ========================================
  // REMOVE IMAGE
  // ========================================

  const removeImage = () => {
    setProductForm(
      (current) => ({
        ...current,
        image: "",
      })
    );

    setImagePreview("");
  };

  // ========================================
  // SAVE PRODUCT
  // ========================================

  const saveProduct = async (e) => {
    e.preventDefault();

    if (!productForm.image) {
      alert(
        "Please upload a product image."
      );
      return;
    }

    const sizes = getSizeList();

    if (sizes.length === 0) {
      alert(
        "At least one size enter karo."
      );
      return;
    }

    // Check every size has stock value
    for (const size of sizes) {
      if (
        sizeStock[size] === undefined ||
        sizeStock[size] === ""
      ) {
        alert(
          `${size} size ka stock enter karo.`
        );
        return;
      }
    }

    try {
      setProductLoading(true);

      const cleanSizeStock = {};

      sizes.forEach((size) => {
        cleanSizeStock[size] =
          Number(
            sizeStock[size]
          ) || 0;
      });

      const payload = {
        name: productForm.name,

        category:
          productForm.category,

        price:
          Number(
            productForm.price
          ),

        oldPrice:
          Number(
            productForm.oldPrice
          ) || 0,

        badge:
          productForm.badge ||
          "NEW",

        image:
          productForm.image,

        description:
          productForm.description,

        sizes,

        sizeStock:
          cleanSizeStock,

        stock:
          totalSizeStock,
      };

      const url =
        editingProduct
          ? `${API_URL}/api/products/${editingProduct._id}`
          : `${API_URL}/api/products`;

      const method =
        editingProduct
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            payload
          ),
        });

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Product save nahi hua."
        );
        return;
      }

      alert(
        editingProduct
          ? "Product updated ✅"
          : "Product added ✅"
      );

      resetProductForm();

      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(
        "Product save nahi hua."
      );
    } finally {
      setProductLoading(false);
    }
  };

  // ========================================
  // RESET PRODUCT FORM
  // ========================================

  const resetProductForm = () => {
    setProductForm(
      emptyProduct
    );

    setSizeStock({});

    setImagePreview("");

    setEditingProduct(null);
  };

  // ========================================
  // EDIT PRODUCT
  // ========================================

  const editProduct = (
    product
  ) => {
    setEditingProduct(
      product
    );

    const productSizes =
      product.sizes &&
      product.sizes.length > 0
        ? product.sizes
        : ["S", "M", "L", "XL"];

    const existingStock = {};

    // New size-wise products
    if (
      product.sizeStock
    ) {
      Object.entries(
        product.sizeStock
      ).forEach(
        ([size, value]) => {
          existingStock[size] =
            Number(value) || 0;
        }
      );
    }

    // Legacy products that only have total stock.
    // Keep their total stock in first size
    // so existing data is not lost.
    if (
      Object.keys(
        existingStock
      ).length === 0
    ) {
      productSizes.forEach(
        (size, index) => {
          existingStock[size] =
            index === 0
              ? Number(
                  product.stock
                ) || 0
              : 0;
        }
      );
    }

    setProductForm({
      name:
        product.name || "",

      category:
        product.category ||
        "Shirts",

      price:
        product.price || "",

      oldPrice:
        product.oldPrice ||
        "",

      badge:
        product.badge ||
        "NEW",

      image:
        product.image || "",

      description:
        product.description ||
        "",

      sizes:
        productSizes.join(
          ", "
        ),

      stock:
        product.stock || "",
    });

    setSizeStock(
      existingStock
    );

    if (product.image) {
      setImagePreview(
        product.image.startsWith(
          "http"
        )
          ? product.image
          : product.image.startsWith(
              "/uploads"
            )
          ? `${API_URL}${product.image}`
          : product.image
      );
    } else {
      setImagePreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // DELETE PRODUCT
  // ========================================

  const deleteProduct = async (
    productId
  ) => {
    const confirmDelete =
      window.confirm(
        "Kya tum is product ko delete karna chahte ho?"
      );

    if (!confirmDelete)
      return;

    try {
      const response =
        await fetch(
          `${API_URL}/api/products/${productId}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (data.success) {
        alert(
          "Product deleted ✅"
        );

        fetchProducts();
      } else {
        alert(
          data.message ||
            "Delete failed"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Product delete nahi hua."
      );
    }
  };

  // ========================================
  // UPDATE ORDER STATUS
  // ========================================

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      const response =
        await fetch(
          `${API_URL}/api/orders/${orderId}/status`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              status,
            }),
          }
        );

      const data =
        await response.json();

      if (data.success) {
        setOrders(
          (current) =>
            current.map(
              (order) =>
                order._id ===
                orderId
                  ? {
                      ...order,
                      status:
                        data
                          .order
                          .status,
                    }
                  : order
            )
        );
      } else {
        alert(
          data.message ||
            "Status update failed"
        );
      }
    } catch (error) {
      console.error(error);

      alert(
        "Status update nahi hua."
      );
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "metro_admin_token"
    );

    window.location.href =
      "/admin";
  };

  // ========================================
  // STATS
  // ========================================

  const totalOrders =
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Pending"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status ===
        "Delivered"
    ).length;

  const totalSales =
    orders
      .filter(
        (order) =>
          order.status !==
          "Cancelled"
      )
      .reduce(
        (total, order) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="admin-loading">
        <span>
          METRO MENS WEAR
        </span>

        <h1>
          LOADING
          <br />
          ADMIN...
        </h1>
      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="admin-page">

      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div className="admin-header">

        <div>
          <span>
            METRO MENS WEAR
          </span>

          <h1>
            ADMIN
            <br />
            PANEL.
          </h1>

          <p>
            Manage your store
            orders, products and
            inventory.
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            className="refresh-orders"
            onClick={() => {
              fetchOrders();
              fetchProducts();
            }}
          >
            ↻ REFRESH
          </button>

          <button
            className="admin-logout"
            onClick={
              handleLogout
            }
          >
            LOGOUT
          </button>

        </div>

      </div>


      {/* ================================== */}
      {/* STATS */}
      {/* ================================== */}

      <section className="admin-stats">

        <div className="admin-stat">
          <span>
            TOTAL ORDERS
          </span>

          <strong>
            {totalOrders}
          </strong>
        </div>

        <div className="admin-stat">
          <span>
            PENDING
          </span>

          <strong>
            {pendingOrders}
          </strong>
        </div>

        <div className="admin-stat">
          <span>
            SHIPPED
          </span>

          <strong>
            {shippedOrders}
          </strong>
        </div>

        <div className="admin-stat">
          <span>
            DELIVERED
          </span>

          <strong>
            {deliveredOrders}
          </strong>
        </div>

        <div className="admin-stat sales-stat">
          <span>
            TOTAL SALES
          </span>

          <strong>
            ₹{totalSales}
          </strong>
        </div>

      </section>


      {/* ================================== */}
      {/* PRODUCTS */}
      {/* ================================== */}

      <section className="admin-products">

        <div className="admin-products-header">

          <div>
            <span>
              INVENTORY MANAGEMENT
            </span>

            <h2>
              PRODUCTS
            </h2>
          </div>

          <span>
            {products.length} PRODUCTS
          </span>

        </div>


        {/* ================================= */}
        {/* PRODUCT FORM */}
        {/* ================================= */}

        <div className="product-admin-form">

          <div className="product-form-heading">

            <span>
              {editingProduct
                ? "EDIT PRODUCT"
                : "ADD NEW PRODUCT"}
            </span>

            <h3>
              {editingProduct
                ? "UPDATE PRODUCT"
                : "CREATE PRODUCT"}
            </h3>

          </div>


          <form
            onSubmit={
              saveProduct
            }
          >

            <div className="admin-form-grid">

              {/* NAME */}

              <div className="admin-form-field">

                <label>
                  PRODUCT NAME
                </label>

                <input
                  name="name"
                  value={
                    productForm.name
                  }
                  onChange={
                    handleProductChange
                  }
                  placeholder="Classic Black Shirt"
                  required
                />

              </div>


              {/* CATEGORY */}

              <div className="admin-form-field">

                <label>
                  CATEGORY
                </label>

                <select
                  name="category"
                  value={
                    productForm.category
                  }
                  onChange={
                    handleProductChange
                  }
                >

                  <option>
                    Shirts
                  </option>

                  <option>
                    T-Shirts
                  </option>

                  <option>
                    Jeans
                  </option>

                  <option>
                    Trousers
                  </option>

                </select>

              </div>


              {/* PRICE */}

              <div className="admin-form-field">

                <label>
                  PRICE
                </label>

                <input
                  type="number"
                  name="price"
                  value={
                    productForm.price
                  }
                  onChange={
                    handleProductChange
                  }
                  placeholder="999"
                  min="0"
                  required
                />

              </div>


              {/* OLD PRICE */}

              <div className="admin-form-field">

                <label>
                  OLD PRICE
                </label>

                <input
                  type="number"
                  name="oldPrice"
                  value={
                    productForm.oldPrice
                  }
                  onChange={
                    handleProductChange
                  }
                  placeholder="1299"
                  min="0"
                />

              </div>


              {/* BADGE */}

              <div className="admin-form-field">

                <label>
                  BADGE
                </label>

                <select
                  name="badge"
                  value={
                    productForm.badge
                  }
                  onChange={
                    handleProductChange
                  }
                >

                  <option>
                    NEW
                  </option>

                  <option>
                    POPULAR
                  </option>

                  <option>
                    SALE
                  </option>

                </select>

              </div>

            </div>


            {/* ================================= */}
            {/* IMAGE */}
            {/* ================================= */}

            <div className="admin-form-field image-upload-field">

              <label>
                PRODUCT IMAGE
              </label>

              <div className="image-upload-box">

                {imagePreview ? (
                  <div className="image-preview-wrapper">

                    <img
                      src={
                        imagePreview
                      }
                      alt="Product preview"
                      className="product-image-preview"
                    />

                    <div className="image-upload-actions">

                      <label
                        htmlFor="product-image"
                        className="choose-image-btn"
                      >
                        CHANGE IMAGE
                      </label>

                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={
                          removeImage
                        }
                      >
                        REMOVE
                      </button>

                    </div>

                  </div>
                ) : (
                  <label
                    htmlFor="product-image"
                    className="image-upload-placeholder"
                  >
                    <span>
                      📸
                    </span>

                    <strong>
                      CHOOSE PRODUCT IMAGE
                    </strong>

                    <small>
                      JPG, JPEG, PNG
                      or WEBP
                      <br />
                      Maximum 10MB
                    </small>

                  </label>
                )}

                <input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={
                    handleImageUpload
                  }
                  disabled={
                    imageUploading
                  }
                  hidden
                />

              </div>

              {imageUploading && (
                <p className="image-upload-status">
                  UPLOADING IMAGE...
                </p>
              )}

              {productForm.image && (
                <p className="image-upload-success">
                  ✓ IMAGE READY
                </p>
              )}

            </div>


            {/* ================================= */}
            {/* SIZES */}
            {/* ================================= */}

            <div className="admin-form-field">

              <label>
                AVAILABLE SIZES
              </label>

              <input
                name="sizes"
                value={
                  productForm.sizes
                }
                onChange={
                  handleProductChange
                }
                placeholder="S, M, L, XL"
              />

              <small className="admin-field-help">
                Example: S, M, L, XL
              </small>

            </div>


            {/* ================================= */}
            {/* SIZE INVENTORY */}
            {/* ================================= */}

            <div className="size-inventory-box">

              <div className="size-inventory-heading">

                <div>
                  <span>
                    INVENTORY
                  </span>

                  <h3>
                    SIZE STOCK
                  </h3>
                </div>

                <div className="total-stock-display">

                  <span>
                    TOTAL STOCK
                  </span>

                  <strong>
                    {totalSizeStock}
                  </strong>

                </div>

              </div>


              <div className="size-stock-grid">

                {getSizeList().map(
                  (size) => (
                    <div
                      className="size-stock-item"
                      key={size}
                    >

                      <label>
                        {size}
                      </label>

                      <input
                        type="number"
                        min="0"
                        value={
                          sizeStock[
                            size
                          ] ??
                          ""
                        }
                        onChange={(e) =>
                          handleSizeStockChange(
                            size,
                            e.target
                              .value
                          )
                        }
                        placeholder="0"
                      />

                      <span>
                        units
                      </span>

                    </div>
                  )
                )}

              </div>


              {getSizeList()
                .length === 0 && (
                <p className="no-size-message">
                  Pehle available sizes
                  enter karo.
                </p>
              )}

            </div>


            {/* ================================= */}
            {/* DESCRIPTION */}
            {/* ================================= */}

            <div className="admin-form-field">

              <label>
                DESCRIPTION
              </label>

              <textarea
                name="description"
                value={
                  productForm.description
                }
                onChange={
                  handleProductChange
                }
                placeholder="Premium men's shirt..."
                rows="4"
              />

            </div>


            {/* ================================= */}
            {/* BUTTONS */}
            {/* ================================= */}

            <div className="product-form-buttons">

              <button
                type="submit"
                disabled={
                  productLoading ||
                  imageUploading
                }
                className="save-product-btn"
              >
                {productLoading
                  ? "SAVING..."
                  : imageUploading
                  ? "UPLOADING IMAGE..."
                  : editingProduct
                  ? "UPDATE PRODUCT →"
                  : "ADD PRODUCT →"}
              </button>


              {editingProduct && (
                <button
                  type="button"
                  className="cancel-product-btn"
                  onClick={
                    resetProductForm
                  }
                >
                  CANCEL
                </button>
              )}

            </div>

          </form>

        </div>


        {/* ================================= */}
        {/* PRODUCT LIST */}
        {/* ================================= */}

        <div className="admin-product-list">

          {products.length === 0 ? (

            <div className="no-products-admin">

              <h3>
                NO PRODUCTS
              </h3>

              <p>
                Add your first product
                above.
              </p>

            </div>

          ) : (

            products.map(
              (product) => {

                const productSizeStock =
                  product.sizeStock
                    ? Object.entries(
                        product.sizeStock
                      )
                    : [];

                return (
                  <div
                    className="admin-product-row"
                    key={
                      product._id
                    }
                  >

                    <img
                      src={
                        product.image?.startsWith(
                          "http"
                        )
                          ? product.image
                          : product.image?.startsWith(
                              "/uploads"
                            )
                          ? `${API_URL}${product.image}`
                          : product.image
                      }
                      alt={
                        product.name
                      }
                    />


                    <div className="admin-product-info">

                      <span>
                        {
                          product.category
                        }
                      </span>

                      <h3>
                        {
                          product.name
                        }
                      </h3>

                      <p>
                        ₹
                        {
                          product.price
                        }
                      </p>


                      {/* SIZE STOCK MINI VIEW */}

                      {productSizeStock.length >
                      0 ? (
                        <div className="admin-mini-size-stock">

                          {productSizeStock.map(
                            ([size, stock]) => (
                              <span
                                key={size}
                              >
                                <b>
                                  {size}
                                </b>{" "}
                                {stock}
                              </span>
                            )
                          )}

                        </div>
                      ) : (
                        <small>
                          Legacy stock:{" "}
                          {product.stock ??
                            0}
                        </small>
                      )}

                    </div>


                    <div className="admin-product-stock">

                      <span>
                        TOTAL STOCK
                      </span>

                      <strong>
                        {
                          product.stock ??
                          0
                        }
                      </strong>

                    </div>


                    <div className="admin-product-actions">

                      <button
                        onClick={() =>
                          editProduct(
                            product
                          )
                        }
                      >
                        EDIT
                      </button>

                      <button
                        onClick={() =>
                          deleteProduct(
                            product._id
                          )
                        }
                      >
                        DELETE
                      </button>

                    </div>

                  </div>
                );
              }
            )

          )}

        </div>

      </section>


      {/* ================================== */}
      {/* ORDERS */}
      {/* ================================== */}

      <section className="admin-orders">

        <div className="admin-orders-header">

          <div>

            <span>
              STORE MANAGEMENT
            </span>

            <h2>
              ALL ORDERS
            </h2>

          </div>

          <span>
            {orders.length} ORDER
            {orders.length !== 1
              ? "S"
              : ""}
          </span>

        </div>


        {orders.length === 0 ? (

          <div className="no-orders">

            <h2>
              NO ORDERS YET.
            </h2>

            <p>
              Customer orders will
              appear here.
            </p>

          </div>

        ) : (

          <div className="orders-table">

            <div className="orders-table-head">

              <span>
                ORDER
              </span>

              <span>
                CUSTOMER
              </span>

              <span>
                DATE
              </span>

              <span>
                TOTAL
              </span>

              <span>
                STATUS
              </span>

              <span>
                ACTION
              </span>

            </div>


            {orders.map(
              (order) => (

                <div
                  className="order-row"
                  key={
                    order._id
                  }
                >

                  <div className="order-id">
                    #
                    {order._id
                      .slice(-6)
                      .toUpperCase()}
                  </div>


                  <div className="order-customer">

                    <strong>
                      {
                        order
                          .customer
                          .name
                      }
                    </strong>

                    <span>
                      {
                        order
                          .customer
                          .mobile
                      }
                    </span>

                  </div>


                  <div className="order-date">

                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day:
                          "2-digit",

                        month:
                          "short",

                        year:
                          "numeric",
                      }
                    )}

                  </div>


                  <div className="order-price">
                    ₹
                    {
                      order.total
                    }
                  </div>


                  <div>

                    <select
                      value={
                        order.status
                      }
                      onChange={(e) =>
                        updateStatus(
                          order._id,
                          e.target.value
                        )
                      }
                      className="status-select"
                    >

                      <option>
                        Pending
                      </option>

                      <option>
                        Confirmed
                      </option>

                      <option>
                        Shipped
                      </option>

                      <option>
                        Delivered
                      </option>

                      <option>
                        Cancelled
                      </option>

                    </select>

                  </div>


                  <div>

                    <button
                      className="view-order-btn"
                      onClick={() =>
                        setSelectedOrder(
                          order
                        )
                      }
                    >
                      VIEW →
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        )}

      </section>


      {/* ================================== */}
      {/* ORDER MODAL */}
      {/* ================================== */}

      {selectedOrder && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              className="close-modal"
              onClick={() =>
                setSelectedOrder(
                  null
                )
              }
            >
              ×
            </button>

            <span>
              ORDER DETAILS
            </span>

            <h2>
              #
              {
                selectedOrder._id
                  .slice(-6)
                  .toUpperCase()
              }
            </h2>

            <div className="modal-status">
              {
                selectedOrder.status
              }
            </div>


            <div className="customer-details">

              <h3>
                CUSTOMER
              </h3>

              <p>
                <strong>
                  Name:
                </strong>{" "}
                {
                  selectedOrder
                    .customer
                    .name
                }
              </p>

              <p>
                <strong>
                  Mobile:
                </strong>{" "}
                {
                  selectedOrder
                    .customer
                    .mobile
                }
              </p>

              <p>
                <strong>
                  Address:
                </strong>{" "}
                {
                  selectedOrder
                    .customer
                    .address
                }
              </p>

              <p>
                <strong>
                  City:
                </strong>{" "}
                {
                  selectedOrder
                    .customer
                    .city
                }
              </p>

              <p>
                <strong>
                  Pincode:
                </strong>{" "}
                {
                  selectedOrder
                    .customer
                    .pincode
                }
              </p>

              {selectedOrder
                .customer
                .notes && (
                <p>
                  <strong>
                    Notes:
                  </strong>{" "}
                  {
                    selectedOrder
                      .customer
                      .notes
                  }
                </p>
              )}

            </div>


            <div className="modal-items">

              <h3>
                ORDER ITEMS
              </h3>

              {selectedOrder.items.map(
                (item, index) => (

                  <div
                    className="modal-item"
                    key={index}
                  >

                    <img
                      src={
                        item.image?.startsWith(
                          "http"
                        )
                          ? item.image
                          : item.image?.startsWith(
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

                      <strong>
                        {
                          item.name
                        }
                      </strong>

                      <span>
                        Size:{" "}
                        {
                          item.size
                        }
                      </span>

                      <span>
                        Quantity:{" "}
                        {
                          item.quantity
                        }
                      </span>

                    </div>

                    <strong>
                      ₹
                      {
                        item.total
                      }
                    </strong>

                  </div>

                )
              )}

            </div>


            <div className="modal-total">

              <span>
                TOTAL
              </span>

              <strong>
                ₹
                {
                  selectedOrder.total
                }
              </strong>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}

export default Admin;