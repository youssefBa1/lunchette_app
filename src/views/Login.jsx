import { useState, useEffect } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import authService from "../services/authService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const isAuth = authService.isAuthenticated();
    console.log("Login page mounted, auth status:", isAuth);
    if (isAuth) {
      console.log("Already authenticated, redirecting to home");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Login form submitted");

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );
      console.log("Login successful, redirecting...");

      // Get the default route based on user role
      const defaultRoute = authService.getDefaultRoute();
      console.log("Redirecting to:", defaultRoute);

      navigate(defaultRoute, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message || "Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-rose-300">Lunchette</h1>
          <p className="text-gray-600 mt-2">Connectez-vous à votre compte</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-rose-300 focus:ring-rose-300 border-gray-300 rounded"
                disabled={loading}
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-rose-300 hover:text-rose-400"
              >
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-300 hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{" "}
            <a
              href="#"
              className="font-medium text-rose-300 hover:text-rose-400"
            >
              Contactez l'administrateur
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
