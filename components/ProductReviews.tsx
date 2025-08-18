import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getReviewsByProductId } from "@/lib/getReviewsById";
import Link from "next/link";
import ReviewForm from "./ReviewsForm";
import Image from "next/image";

export default async function ProductReviews({
  productId,
}: {
  productId: string;
}) {
  const session = await getServerSession(authOptions);

  const reviews = await getReviewsByProductId(productId);

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-2xl font-bold mb-3">Customer Reviews</h2>

      {reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="border p-3 rounded">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  {review?.user?.image ? (
                    <Image
                      src={review.user?.image}
                      height={50}
                      width={50}
                      alt="ProfilePic"
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  ) : (
                    <Image
                      src="https://plus.unsplash.com/premium_photo-1723028769916-a767a6b0f719?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMGljb25zfGVufDB8fDB8fHww"
                      height={50}
                      width={50}
                      alt="ProfilePic"
                      className="w-[40px] h-[40px] rounded-full"
                    />
                  )}
                  <p className="font-semibold">
                    {review.user?.name || "Anonymous"}
                  </p>
                </div>
                <span className="text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
              </div>
              {review.comment && (
                <p className="text-black dark:text-white">{review.comment}</p>
              )}
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
        <ReviewForm productId={productId} />
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
