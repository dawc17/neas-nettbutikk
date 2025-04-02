import { useState } from "react";
import { FaStar, FaReply, FaTrash, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  update,
  get,
} from "firebase/database";
import ReplyForm from "./ReplyForm";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";

function ReviewItem({ review, productId }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(review.text);
  const [editRating, setEditRating] = useState(review.rating);
  const { currentUser } = useAuth();
  const database = getDatabase();

  const isAuthor = currentUser && currentUser.uid === review.userId;
  const isAdmin = currentUser && currentUser.role === "admin";
  const canModify = isAuthor || isAdmin;

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
            userDisplayName = userData.readableId || "Anonym bruker";
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }

      await set(newReplyRef, {
        userId: currentUser.uid,
        userDisplayName: userDisplayName, // Using readableId instead of userName
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

  const handleEdit = async () => {
    if (!isAuthor) return;

    if (editing) {
      try {
        const reviewRef = ref(database, `reviews/${productId}/${review.id}`);
        await update(reviewRef, {
          text: editText,
          rating: editRating,
          edited: true,
          editedAt: Date.now(),
        });
        setEditing(false);
      } catch (error) {
        console.error("Error updating review:", error);
      }
    } else {
      setEditing(true);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      {/* Review header */}
      <div className="flex justify-between mb-2">
        <div>
          {/* Use userDisplayName instead of userName */}
          <div className="font-mabry text-pinegreen">
            {review.userDisplayName || "Anonym bruker"}
          </div>
          <div className="flex items-center">
            {!editing &&
              [...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                  }
                />
              ))}
            {editing && (
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className="cursor-pointer"
                    color={index < editRating ? "#f59e0b" : "#e5e7eb"}
                    onClick={() => setEditRating(index + 1)}
                  />
                ))}
              </div>
            )}
            <span className="text-xs text-gray-500 ml-2">{formattedDate}</span>
            {review.edited && (
              <span className="text-xs text-gray-500 ml-2">(redigert)</span>
            )}
          </div>
        </div>

        {canModify && (
          <div className="flex space-x-2">
            {isAuthor && (
              <button
                onClick={handleEdit}
                className="text-pinegreen hover:text-mossgreen"
              >
                <FaEdit />
              </button>
            )}
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
      {editing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mossgreen mb-2"
          rows="3"
        />
      ) : (
        <p className="font-mabrylight text-pinegreen mb-4">{review.text}</p>
      )}

      {editing && (
        <div className="flex justify-end space-x-2 mb-4">
          <button
            onClick={() => setEditing(false)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            Avbryt
          </button>
          <button
            onClick={handleEdit}
            className="px-3 py-1 bg-mossgreen text-pinegreen rounded text-sm"
          >
            Lagre endringer
          </button>
        </div>
      )}

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-gray-200 mt-4 space-y-3">
          {replies.map((reply) => (
            <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between">
                <div className="font-mabry text-pinegreen text-sm">
                  {reply.userDisplayName || "Anonym bruker"}
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
