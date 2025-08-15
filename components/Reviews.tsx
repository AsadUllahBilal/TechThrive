"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

interface Review {
  _id: string;
  user: { name: string; profilePicture: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

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
        fetchReviews();
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="border p-3 rounded">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      review.user?.profilePicture ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8-sy0Y-97bsW5BLoIHWPMIUN-AYMvT9wJrQ&s"
                    }
                    alt="ProfilePic"
                    className="w-[40px] h-[40px] rounded-full"
                  />
                  <p className="font-semibold">
                    {review.user?.name || "Anonymous"}
                  </p>
                </div>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              {review.comment && <p className="text-black dark:text-white">{review.comment}</p>}
              <small className="text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {/* Add Review Form */}
      {session ? (
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
                <option
                  key={num}
                  value={num}
                  className="border-none rounded px-2 py-1 bg-[#222] text-white"
                >
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
            <Button disabled size={"lg"}>
              {" "}
              <Loader2Icon className="animate-spin" /> Submitting...
            </Button>
          ) : (
            <Button variant={"navbarBtn"} size={"lg"}>
              Submit Review
            </Button>
          )}
        </form>
      ) : (
        <p className="mt-4 text-sm text-gray-600">
          Please log in to write a review.{" "}
          <Link href="/login" className="text-red-600">
            <span>Login</span>
          </Link>
        </p>
      )}
    </div>
  );
}
