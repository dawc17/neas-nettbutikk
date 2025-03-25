import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, get } from "firebase/database";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { FaUser, FaEnvelope, FaIdCard } from "react-icons/fa";

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const database = getDatabase();
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          setError("Kunne ikke finne brukerdata.");
        }
      } catch (err) {
        setError("Feil ved henting av brukerdata: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-mabry text-pinegreen mb-6">Min profil</h1>

          {loading ? (
            <div className="bg-lightgray rounded-xl p-6 shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pinegreen mx-auto"></div>
              <p className="mt-4 font-mabrylight text-pinegreen">Laster brukerdata...</p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : userData ? (
            <div className="bg-lightgray rounded-xl p-6 shadow-md">
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaUser className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">Navn</h2>
                    <p className="font-mabry text-pinegreen text-lg">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaEnvelope className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">E-post</h2>
                    <p className="font-mabry text-pinegreen text-lg">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaIdCard className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">Bruker-ID</h2>
                    <p className="font-mabry text-pinegreen text-lg">{userData.readableId || "Ikke tilgjengelig"}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-lightgray rounded-xl p-6 shadow-md text-center">
              <p className="font-mabrylight text-pinegreen">Ingen brukerdata funnet.</p>
            </div>
          )}
        </div>
      </main>
      <footer>
        <FooterMain />
      </footer>
    </div>
  );
}

export default Profile;