import { useState, useEffect } from "react";
import { FaStar, FaReply, FaTrash, FaUser, FaEdit, FaTimes, FaCheck } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, push, set, remove, get } from "firebase/database";
import ReplyForm from "./ReplyForm";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

function ReviewItem({ review, productId }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editingProfilePicture, setEditingProfilePicture] = useState(null);
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
      let profilePicture = null;

      if (currentUser) {
        try {
          const userRef = ref(database, `users/${currentUser.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            // Prioritize nickname, then fall back to real name
            userDisplayName =
              userData.nickname || userData.name || "Anonym bruker";
            profilePicture = userData.profilePicture || null;
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      await set(newReplyRef, {
        userId: currentUser.uid,
        userDisplayName: userDisplayName,
        profilePicture: profilePicture,
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

  // Function to initiate editing a reply
  const startEditingReply = async (reply) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.text);
    setEditingProfilePicture(reply.profilePicture);

    if (currentUser) {
      try {
        const userRef = ref(database, `users/${currentUser.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          if (userData.profilePicture) {
            setEditingProfilePicture(userData.profilePicture);
          }
        }
      } catch (err) {
        console.error("Error fetching updated user data:", err);
      }
    }
  };

  // Function to handle editing a reply
  const handleEditReply = async (replyId) => {
    setIsSubmittingEdit(true);
    try {
      const reply = replies.find(r => r.id === replyId);
      if (!reply) return;

      const replyRef = ref(
        database,
        `reviews/${productId}/${review.id}/replies/${replyId}`
      );

      await set(replyRef, {
        ...reply,
        profilePicture: editingProfilePicture,
        text: editReplyText,
        edited: true,
        editedAt: Date.now(),
      });

      setEditingReplyId(null);
      setEditReplyText("");
      setEditingProfilePicture(null);
      return true;
    } catch (error) {
      console.error("Error updating reply:", error);
      return false;
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  // Function to cancel editing a reply
  const cancelEditReply = () => {
    setEditingReplyId(null);
    setEditReplyText("");
    setEditingProfilePicture(null);
  };

  // Function to handle deleting a reply
  const handleDeleteReply = async (replyId) => {
    if (window.confirm("Er du sikker på at du vil slette dette svaret?")) {
      try {
        const replyRef = ref(
          database,
          `reviews/${productId}/${review.id}/replies/${replyId}`
        );
        await remove(replyRef);
      } catch (error) {
        console.error("Error deleting reply:", error);
      }
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

  // Check if user can edit/delete a specific reply
  const canModifyReply = (reply) => {
    return currentUser && (currentUser.uid === reply.userId || isAdmin);
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
        <div className="flex items-center">
          {/* Profile Picture */}
          <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 flex items-center justify-center flex-shrink-0">
            {review.profilePicture ? (
              <img 
                src={review.profilePicture} 
                alt="Profilbilde" 
                className="object-cover w-full h-full" 
              />
            ) : (
              <FaUser className="text-pinegreen opacity-50" />
            )}
          </div>
          
          {/* User Name */}
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
              {editingReplyId === reply.id ? (
                // Edit reply form
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {editingProfilePicture ? (
                        <img 
                          src={editingProfilePicture} 
                          alt="Profilbilde" 
                          className="object-cover w-full h-full" 
                        />
                      ) : (
                        <FaUser className="text-pinegreen opacity-50 text-xs" />
                      )}
                    </div>
                    <div className="font-mabry text-pinegreen text-sm">
                      {reply.userDisplayName || "Anonym bruker"}
                    </div>
                  </div>
                  <textarea
                    value={editReplyText}
                    onChange={(e) => setEditReplyText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-mossgreen text-sm mb-2"
                    rows="2"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEditReply}
                      className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                      disabled={isSubmittingEdit}
                    >
                      <FaTimes className="mr-1" /> Avbryt
                    </button>
                    <button
                      onClick={() => handleEditReply(reply.id)}
                      className="text-mossgreen hover:text-pinegreen text-sm flex items-center"
                      disabled={!editReplyText.trim() || isSubmittingEdit}
                    >
                      {isSubmittingEdit ? (
                        <span>Lagrer...</span>
                      ) : (
                        <>
                          <FaCheck className="mr-1" /> Lagre
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // Normal reply display
                <>
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {/* Reply Profile Picture */}
                      <div className="w-6 h-6 rounded-full overflow-hidden mr-2 bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {reply.profilePicture ? (
                          <img 
                            src={reply.profilePicture} 
                            alt="Profilbilde" 
                            className="object-cover w-full h-full" 
                          />
                        ) : (
                          <FaUser className="text-pinegreen opacity-50 text-xs" />
                        )}
                      </div>
                      
                      {/* Reply User Name */}
                      <div>
                        <div className="font-mabry text-pinegreen text-sm">
                          {reply.userDisplayName || "Anonym bruker"}
                          {isAdmin && replyUserDetails[reply.userId] && (
                            <span className="text-gray-400 text-xs ml-1">
                              ({replyUserDetails[reply.userId].name || "N/A"},{" "}
                              {replyUserDetails[reply.userId].readableId || "N/A"})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-xs text-gray-500 mr-2">
                        {reply.createdAt
                          ? formatDistanceToNow(new Date(reply.createdAt), {
                              addSuffix: true,
                              locale: nb,
                            })
                          : ""}
                        {reply.edited && (
                          <span className="ml-1">(redigert)</span>
                        )}
                      </div>
                      
                      {/* Edit and delete buttons */}
                      {canModifyReply(reply) && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditingReply(reply)}
                            className="text-mossgreen hover:text-pinegreen"
                            title="Rediger svar"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteReply(reply.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Slett svar"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="font-mabrylight text-pinegreen text-sm mt-1 ml-8">
                    {reply.text}
                  </p>
                </>
              )}
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
