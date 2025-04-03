import { useState, useEffect } from "react";
import { FaStar, FaReply, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, push, set, remove, get } from "firebase/database";
import ReplyForm from "./ReplyForm";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

function ReviewItem({ review, productId }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const { currentUser } = useAuth();
  const database = getDatabase();

  const isAuthor = currentUser && currentUser.uid === review.userId;
  const isAdmin = currentUser && currentUser.role === "admin";
  const canModify = isAuthor || isAdmin;

  // Fetch additional user details for admin view
  useEffect(() => {
    if (isAdmin && review.userId) {
      const fetchUserDetails = async () => {
        try {
          const userRef = ref(database, `users/${review.userId}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserDetails(snapshot.val());
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserDetails();
    }
  }, [isAdmin, review.userId, database]);

  const formattedDate = review.createdAt
    ? formatDistanceToNow(new Date(review.createdAt), {
        addSuffix: true,
        locale: nb,
      })
    : "";

  // Convert replies object to array if it exists
  const replies = review.replies
    ? Object.entries(review.replies).map(([id, reply]) => ({ id, ...reply }))
    : [];

  const handleReply = async (replyData) => {
    try {
      const replyRef = ref(
        database,
        `reviews/${productId}/${review.id}/replies`
      );
      const newReplyRef = push(replyRef);

      let userDisplayName = "Anonym bruker";

      if (currentUser) {
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            // Prioritize nickname, then fall back to real name, then readableId
            userDisplayName =
              userData.nickname || userData.name || "Anonym bruker";
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      await set(newReplyRef, {
        userId: currentUser.uid,
        userDisplayName: userDisplayName,
        text: replyData.text,
        createdAt: Date.now(),
      });

      setShowReplyForm(false);
      return true;
    } catch (error) {
      console.error("Error adding reply:", error);
      return false;
    }
  };

  const handleDelete = async () => {
    if (!canModify) return;

    if (window.confirm("Er du sikker på at du vil slette denne anmeldelsen?")) {
      try {
        const reviewRef = ref(database, `reviews/${productId}/${review.id}`);
        await remove(reviewRef);
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  // State for storing reply user details (for admin use)
  const [replyUserDetails, setReplyUserDetails] = useState({});

  // Effect to fetch reply user details for admins
  useEffect(() => {
    if (isAdmin && replies.length > 0) {
      const fetchReplyUserDetails = async () => {
        const details = {};

        for (const reply of replies) {
          if (reply.userId) {
            try {
              const userRef = ref(database, `users/${reply.userId}`);
              const snapshot = await get(userRef);
              if (snapshot.exists()) {
                details[reply.userId] = snapshot.val();
              }
            } catch (error) {
              console.error(
                `Error fetching details for user ${reply.userId}:`,
                error
              );
            }
          }
        }

        setReplyUserDetails(details);
      };

      fetchReplyUserDetails();
    }
  }, [isAdmin, replies, database]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Review header */}
      <div className="flex justify-between mb-2">
        <div>
          <div className="font-mabry text-pinegreen">
            {review.userDisplayName || "Anonym bruker"}
            {isAdmin && userDetails && (
              <span className="text-gray-400 text-sm ml-1">
                ({userDetails.name || "N/A"}, {userDetails.readableId || "N/A"})
              </span>
            )}
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < review.rating ? "text-yellow-500" : "text-gray-300"
                }
              />
            ))}
            <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
            {review.edited && (
              <span className="text-xs text-gray-500 ml-2">(redigert)</span>
            )}
          </div>
        </div>

        {canModify && (
          <div>
            <button
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>

      {/* Review content */}
      <p className="font-mabrylight text-pinegreen mb-4">{review.text}</p>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-gray-200 mt-4 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <div className="font-mabry text-pinegreen text-sm">
                  {reply.userDisplayName || "Anonym bruker"}
                  {isAdmin && replyUserDetails[reply.userId] && (
                    <span className="text-gray-400 text-sm ml-1">
                      ({replyUserDetails[reply.userId].name || "N/A"},{" "}
                      {replyUserDetails[reply.userId].readableId || "N/A"})
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {reply.createdAt
                    ? formatDistanceToNow(new Date(reply.createdAt), {
                        addSuffix: true,
                        locale: nb,
                      })
                    : ""}
                </div>
              </div>
              <p className="font-mabrylight text-pinegreen text-sm mt-1">
                {reply.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Reply actions */}
      {currentUser && !showReplyForm && (
        <div className="mt-4">
          <button
            onClick={() => setShowReplyForm(true)}
            className="flex items-center text-sm text-pinegreen hover:text-mossgreen"
          >
            <FaReply className="mr-1" /> Svar
          </button>
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <div className="mt-4">
          <ReplyForm
            onSubmit={handleReply}
            onCancel={() => setShowReplyForm(false)}
          />
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
