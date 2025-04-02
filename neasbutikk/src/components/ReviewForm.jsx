import { useState } from "react";
import { FaStar } from "react-icons/fa";

function ReviewForm({
  onSubmit,
  initialRating = 0,
  initialText = "",
  buttonText = "Send anmeldelse",
}) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState(initialText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      setError("Vennligst velg en rating.");
      return;
    }

    if (text.trim().length < 10) {
      setError("Anmeldelsen må være minst 10 tegn.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const success = await onSubmit({
        rating,
        text,
      });

      if (success) {
        // Reset form
        setRating(initialRating);
        setText("");
      } else {
        setError("Kunne ikke sende anmeldelse. Vennligst prøv igjen.");
      }
    } catch (err) {
      setError("Feil ved sending av anmeldelse: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg p-4 mb-6 shadow-sm"
    >
      <h3 className="font-mabry text-pinegreen mb-4">Skriv en anmeldelse</h3>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block font-mabrylight text-pinegreen mb-2">
          Rating
        </label>
        <div className="flex">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <FaStar
                key={index}
                className="cursor-pointer text-2xl transition-colors"
                color={
                  ratingValue <= (hoverRating || rating) ? "#f59e0b" : "#e5e7eb"
                }
                onMouseEnter={() => setHoverRating(ratingValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(ratingValue)}
              />
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="reviewText"
          className="block font-mabrylight text-pinegreen mb-2"
        >
          Anmeldelse
        </label>
        <textarea
          id="reviewText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mossgreen"
          placeholder="Del dine erfaringer med dette produktet..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`bg-mossgreen text-pinegreen font-mabry rounded-lg py-2 px-4 hover:bg-pinegreen hover:text-sunlightyellow transition-all duration-150 ${
          submitting ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {submitting ? "Sender..." : buttonText}
      </button>
    </form>
  );
}

export default ReviewForm;
