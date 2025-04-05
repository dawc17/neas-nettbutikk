import { useState } from "react";

function ReplyForm({ onSubmit, onCancel, initialText = "" }) {
  const [text, setText] = useState(initialText);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (text.trim().length < 5) {
      setError("Svaret må være minst 5 tegn.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const success = await onSubmit({ text });

      if (success) {
        setText("");
      } else {
        setError("Kunne ikke sende svar. Vennligst prøv igjen.");
      }
    } catch (err) {
      setError("Feil ved sending av svar: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded-lg">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded-md mb-2 text-sm">
          {error}
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="2"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary mb-2"
        placeholder="Skriv et svar..."
        required
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 border border-gray-300 rounded text-sm"
        >
          Avbryt
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`px-3 py-1 bg-secondary text-primary rounded text-sm ${
            submitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Sender..." : "Send svar"}
        </button>
      </div>
    </form>
  );
}

export default ReplyForm;
