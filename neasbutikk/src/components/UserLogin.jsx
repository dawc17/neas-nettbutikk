import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaSignInAlt,
  FaLock,
  FaEnvelope,
  FaArrowLeft,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate, Link, useLocation } from "react-router-dom";

function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get returnPath from location state if available
  const returnPath = location.state?.returnPath || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const { role } = await login(email, password);

      // Redirect based on role and return path
      if (role === "admin") {
        navigate("/adminpanel");
      } else {
        // For regular users, redirect to the return path or home page
        navigate(returnPath);
      }
    } catch (error) {
      setError("Feil e-post eller passord. Vennligst prøv igjen.");
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pinegreen-footer">
      <div className="p-4">
        <Link
          to="/"
          className="inline-flex items-center text-white bg-pinegreen px-4 py-2 rounded-md hover:bg-mossgreen transition-all duration-200"
        >
          <FaArrowLeft className="mr-2" />
          Tilbake til butikk
        </Link>
      </div>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-mabry text-pinegreen">Logg inn</h2>
            <p className="text-gray-500 font-mabrylight">
              Logg inn for å få tilgang til dine favoritter og mer
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block font-mabry text-pinegreen mb-2"
              >
                E-post
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaEnvelope className="text-pinegreen" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-mossgreen"
                  placeholder="din@epost.no"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block font-mabry text-pinegreen mb-2"
              >
                Passord
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-pinegreen" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-mossgreen"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pinegreen text-white font-mabry py-2 px-4 rounded-md hover:bg-mossgreen transition-all duration-200 flex items-center justify-center mb-4"
            >
              {loading ? (
                <span>Logger inn...</span>
              ) : (
                <>
                  <FaSignInAlt className="mr-2" />
                  <span>Logg inn</span>
                </>
              )}
            </button>

            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Har du ikke en konto?</p>
              <Link
                to="/register"
                className="bg-mossgreen text-pinegreen font-mabry py-2 px-4 rounded-md hover:bg-mossgreen/85 transition-all duration-200 flex items-center justify-center"
              >
                <FaUserPlus className="mr-2" />
                <span>Registrer deg</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
