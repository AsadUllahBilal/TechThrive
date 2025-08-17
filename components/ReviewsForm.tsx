"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";

export default function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error adding review");
      } else {
        setRating(0);
        setComment("");
        window.location.reload(); // simple way to re-fetch SSR reviews
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
      <div>
        <label className="block font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded px-2 py-1 bg-[#222] text-white"
          required
        >
          <option value="">Select rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Star{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="border rounded px-2 py-1 w-full"
          placeholder="Write your review..."
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading ? (
        <Button disabled size="lg">
          <Loader2Icon className="animate-spin" /> Submitting...
        </Button>
      ) : (
        <Button variant="navbarBtn" size="lg">
          Submit Review
        </Button>
      )}
    </form>
  );
}