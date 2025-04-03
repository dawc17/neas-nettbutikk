import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, get, update } from "firebase/database";
import Navbar from "../components/Navbar";
import FooterMain from "../components/Footer";
import { FaUser, FaEnvelope, FaIdCard, FaUserEdit } from "react-icons/fa";

function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add these new state variables
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleUpdateNickname = async () => {
    if (!nickname.trim()) {
      setSaveError("Kallenavn kan ikke være tomt.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const database = getDatabase();
      const userRef = ref(database, `users/${currentUser.uid}`);

      // Update the nickname in the user profile
      await update(userRef, {
        nickname: nickname.trim(),
      });

      // Update local user data
      setUserData({
        ...userData,
        nickname: nickname.trim(),
      });

      // Update all reviews by this user
      await updateUserDisplayNameInContent(nickname.trim());

      setIsEditingNickname(false);
    } catch (err) {
      setSaveError("Kunne ikke lagre kallenavnet: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // New function to update user display name in reviews and replies
  const updateUserDisplayNameInContent = async (newNickname) => {
    try {
      const database = getDatabase();

      // First, get all reviews
      const reviewsRef = ref(database, "reviews");
      const reviewsSnapshot = await get(reviewsRef);

      if (!reviewsSnapshot.exists()) return;

      const updates = {};
      const allProducts = reviewsSnapshot.val();

      // Loop through all products
      Object.entries(allProducts).forEach(([productId, productReviews]) => {
        // Loop through all reviews for this product
        Object.entries(productReviews).forEach(([reviewId, review]) => {
          // If this review belongs to the current user, update the userDisplayName
          if (review.userId === currentUser.uid) {
            updates[`reviews/${productId}/${reviewId}/userDisplayName`] =
              newNickname;
          }

          // Check if there are replies and if any belong to this user
          if (review.replies) {
            Object.entries(review.replies).forEach(([replyId, reply]) => {
              if (reply.userId === currentUser.uid) {
                updates[
                  `reviews/${productId}/${reviewId}/replies/${replyId}/userDisplayName`
                ] = newNickname;
              }
            });
          }
        });
      });

      // Apply all updates in one batch
      if (Object.keys(updates).length > 0) {
        await update(ref(database), updates);
      }
    } catch (error) {
      console.error("Error updating display name in content:", error);
      // Don't throw - we don't want to prevent nickname update if this fails
    }
  };

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

  useEffect(() => {
    if (userData) {
      setNickname(userData.nickname || "");
    }
  }, [userData]);

  return (
    <div className="min-h-screen flex flex-col hide-scrollbar">
      <header>
        <Navbar />
      </header>
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-mabry text-pinegreen mb-6">
            Min profil
          </h1>

          {loading ? (
            <div className="bg-lightgray rounded-xl p-6 shadow-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pinegreen mx-auto"></div>
              <p className="mt-4 font-mabrylight text-pinegreen">
                Laster brukerdata...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          ) : userData ? (
            <div className="bg-lightgray rounded-xl p-6 shadow-md">
              <div className="space-y-6">
                {/* Nickname section - moved to the top */}
                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaUserEdit className="text-pinegreen text-xl" />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-sm font-mabrylight text-gray-500">
                      Kallenavn
                    </h2>
                    {isEditingNickname ? (
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <input
                          type="text"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          className="border rounded-md p-1 mb-2 sm:mb-0 sm:mr-2 font-mabry text-pinegreen"
                          placeholder="Ditt kallenavn"
                        />
                        <div className="flex">
                          <button
                            onClick={handleUpdateNickname}
                            disabled={isSaving}
                            className="bg-mossgreen text-pinegreen px-3 py-1 rounded-md hover:bg-mossgreen/80 transition-all mr-2"
                          >
                            {isSaving ? "Lagrer..." : "Lagre"}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingNickname(false);
                              setNickname(userData.nickname || "");
                              setSaveError(null);
                            }}
                            className="bg-gray-200 text-pinegreen px-3 py-1 rounded-md hover:bg-gray-300 transition-all"
                          >
                            Avbryt
                          </button>
                        </div>
                        {saveError && (
                          <p className="text-red-500 text-sm mt-1">
                            {saveError}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="font-mabry text-pinegreen text-lg">
                          {userData.nickname || "Ikke satt"}
                        </p>
                        <button
                          onClick={() => setIsEditingNickname(true)}
                          className="ml-2 text-mossgreen hover:text-pinegreen transition-all"
                        >
                          {userData.nickname ? "Endre" : "Legg til"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Name section - now below nickname */}
                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaUser className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">
                      Navn
                    </h2>
                    <p className="font-mabry text-pinegreen text-lg">
                      {userData.name}
                    </p>
                  </div>
                </div>

                {/* Email section */}
                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaEnvelope className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">
                      E-post
                    </h2>
                    <p className="font-mabry text-pinegreen text-lg">
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* User-ID section */}
                <div className="flex items-center">
                  <div className="bg-mossgreen rounded-full p-3 mr-4">
                    <FaIdCard className="text-pinegreen text-xl" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mabrylight text-gray-500">
                      Bruker-ID
                    </h2>
                    <p className="font-mabry text-pinegreen text-lg">
                      {userData.readableId || "Ikke tilgjengelig"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-lightgray rounded-xl p-6 shadow-md text-center">
              <p className="font-mabrylight text-pinegreen">
                Ingen brukerdata funnet.
              </p>
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
