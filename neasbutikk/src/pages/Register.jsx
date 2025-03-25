import { useState } from "react";
import { FaUserPlus, FaLock, FaEnvelope, FaArrowLeft, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const database = getDatabase();
  
  // Generate a readable ID from email
  const generateReadableId = (email) => {
    // Extract first part of email (before @)
    const emailPrefix = email.split('@')[0];
    
    // Take first 4 characters of the email prefix
    const prefixStart = emailPrefix.substring(0, 4).toLowerCase();
    
    // Add a timestamp to ensure uniqueness
    const timestamp = new Date().getTime().toString().slice(-6);
    
    return `${prefixStart}_${timestamp}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (password !== confirmPassword) {
      return setError("Passordene stemmer ikke overens.");
    }

    if (password.length < 6) {
      return setError("Passordet må være minst 6 tegn.");
    }

    try {
      setError("");
      setLoading(true);

      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Generate a readable ID
      const readableId = generateReadableId(email);

      // Store additional user information in the Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        name: name,
        email: email,
        readableId: readableId,
        role: "user", // Default role is regular user
        createdAt: new Date().toISOString()
      });

      // Show success message
      setRegistrationSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Denne e-postadressen er allerede i bruk.');
      } else {
        setError(`Registrering feilet: ${error.message}`);
      }
      console.error("Registration error:", error);
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
            <h2 className="text-3xl font-mabry text-pinegreen">Registrer deg</h2>
            <p className="text-gray-500 font-mabrylight">
              Opprett en konto for å få tilgang til alle funksjonene
            </p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {registrationSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">
                Registrering vellykket! Du blir nå videresendt til forsiden.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block font-mabry text-pinegreen mb-2"
              >
                Navn
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaUser className="text-pinegreen" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-mossgreen"
                  placeholder="Ditt navn"
                />
              </div>
            </div>
            
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
              <p className="text-xs text-gray-500 mt-1">Minst 6 tegn</p>
            </div>
            
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block font-mabry text-pinegreen mb-2"
              >
                Bekreft passord
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaLock className="text-pinegreen" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-mossgreen"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || registrationSuccess}
              className="w-full bg-pinegreen text-white font-mabry py-2 px-4 rounded-md hover:bg-mossgreen transition-all duration-200 flex items-center justify-center mb-4"
            >
              {loading ? (
                <span>Registrerer...</span>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  <span>Registrer deg</span>
                </>
              )}
            </button>
            
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600 mb-4">Har du allerede en konto?</p>
              <Link 
                to="/login" 
                className="bg-mossgreen text-pinegreen font-mabry py-2 px-4 rounded-md hover:bg-mossgreen/85 transition-all duration-200 flex items-center justify-center"
              >
                <FaEnvelope className="mr-2" />
                <span>Logg inn</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;