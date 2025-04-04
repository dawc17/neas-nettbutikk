import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, push, set, get } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import { FaStar, FaCommentAlt, FaEdit } from "react-icons/fa";

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const { currentUser } = useAuth();
  const database = getDatabase();
  const [userReview, setUserReview] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Fetch reviews for this product
  useEffect(() => {
    const reviewsRef = ref(database, `reviews/${productId}`);
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const reviewsData = snapshot.val();
      if (reviewsData) {
        // Convert from object to array and add the review ID
        const reviewsArray = Object.entries(reviewsData).map(
          ([id, review]) => ({
            id,
            ...review,
          })
        );

        // Sort by newest first
        reviewsArray.sort((a, b) => b.createdAt - a.createdAt);

        setReviews(reviewsArray);

        // If user is logged in, check if they've already left a review
        if (currentUser) {
          const userExistingReview = reviewsArray.find(
            (review) => review.userId === currentUser.uid
          );
          setUserReview(userExistingReview || null);
        } else {
          setUserReview(null);
        }

        // Calculate average rating
        const totalRating = reviewsArray.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        setAverageRating(totalRating / reviewsArray.length);
      } else {
        setReviews([]);
        setAverageRating(0);
        setUserReview(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [productId, database, currentUser]);

  const handleAddReview = async (reviewData) => {
    // Check if user already has a review
    if (userReview) {
      return false;
    }

    try {
      const reviewsRef = ref(database, `reviews/${productId}`);
      const newReviewRef = push(reviewsRef);

      // Get user's info from database
      let userDisplayName = "Anonym bruker"; // Default fallback
      let profilePicture = null;

      if (currentUser) {
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            userDisplayName =
              userData.nickname || userData.name || "Anonym bruker";
            profilePicture = userData.profilePicture || null;
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      await set(newReviewRef, {
        userId: currentUser.uid,
        userDisplayName: userDisplayName,
        profilePicture: profilePicture,
        rating: reviewData.rating,
        text: reviewData.text,
        createdAt: Date.now(),
      });

      return true;
    } catch (error) {
      console.error("Error adding review:", error);
      return false;
    }
  };

  const handleEditExistingReview = async (reviewData) => {
    if (!userReview) return false;

    try {
      const reviewRef = ref(database, `reviews/${productId}/${userReview.id}`);
      
      // Get fresh user data in case profile picture was updated
      let profilePicture = userReview.profilePicture;
      
      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          profilePicture = userData.profilePicture || profilePicture;
        }
      } catch (err) {
        console.error("Error fetching updated user data:", err);
      }
      
      await set(reviewRef, {
        ...userReview,
        profilePicture: profilePicture,
        rating: reviewData.rating,
        text: reviewData.text,
        edited: true,
        editedAt: Date.now(),
      });

      setShowEditForm(false);
      return true;
    } catch (error) {
      console.error("Error updating review:", error);
      return false;
    }
  };

  return (
    <div className="border-t border-pinegreen/10 p-4 md:p-8">
      <h2 className="font-mabry text-xl text-pinegreen mb-4">Anmeldelser</h2>

      {/* Summary section */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center">
          <div className="flex items-center text-yellow-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.round(averageRating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="font-mabry text-pinegreen">
            {averageRating ? averageRating.toFixed(1) : "0"} / 5 (
            {reviews.length}{" "}
            {reviews.length === 1 ? "anmeldelse" : "anmeldelser"})
          </span>
        </div>
      </div>

      {/* Review Form */}
      {currentUser ? (
        userReview ? (
          showEditForm ? (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h3 className="font-mabry text-pinegreen">
                  Rediger din anmeldelse
                </h3>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-sm text-gray-500 hover:text-pinegreen"
                >
                  Avbryt redigering
                </button>
              </div>
              <ReviewForm
                initialRating={userReview.rating}
                initialText={userReview.text}
                buttonText="Oppdater anmeldelse"
                onSubmit={handleEditExistingReview}
              />
            </div>
          ) : (
            <div className="bg-mossgreen/20 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <p className="font-mabrylight text-pinegreen">
                  Du har allerede skrevet en anmeldelse.
                </p>
                <button
                  onClick={() => setShowEditForm(true)}
                  className="text-sm text-mossgreen hover:underline flex items-center"
                >
                  <FaEdit className="mr-1" /> Rediger
                </button>
              </div>
            </div>
          )
        ) : (
          <ReviewForm onSubmit={handleAddReview} />
        )
      ) : (
        <div className="bg-mossgreen/20 rounded-lg p-4 mb-6">
          <p className="font-mabrylight text-pinegreen">
            <a href="/login" className="text-mossgreen hover:underline">
              Logg inn
            </a>{" "}
            for å skrive en anmeldelse.
          </p>
        </div>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="font-mabrylight text-pinegreen">Laster anmeldelser...</p>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem key={review.id} review={review} productId={productId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <FaCommentAlt className="mx-auto text-gray-300 text-4xl mb-2" />
          <p className="font-mabrylight text-pinegreen">
            Ingen anmeldelser ennå. Vær den første til å anmelde dette
            produktet!
          </p>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
