import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem(
        "metro_admin_token",
        data.token
      );

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        "Backend server is not running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-box">

        <span>METRO MENS WEAR</span>

        <h1>
          ADMIN
          <br />
          LOGIN.
        </h1>

        <p>
          Sign in to manage your store.
        </p>

        <form onSubmit={handleLogin}>

          <div className="admin-input">
            <label>USERNAME</label>

            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-input">
            <label>PASSWORD</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "SIGNING IN..."
              : "LOGIN →"}
          </button>

        </form>

      </div>

    </main>
  );
}

export default AdminLogin;