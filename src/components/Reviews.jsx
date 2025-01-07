import { useState } from 'react';
import { Rating } from './Rating';
import ReviewForm from './ReviewForm';

export default function Reviews({ reviews, onAddReview }) {
  const [showForm, setShowForm] = useState(false);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
          <div className="flex items-center mt-1">
            <Rating value={averageRating} size="small" />
            <span className="ml-2 text-sm text-gray-500">
              Based on {reviews.length} reviews
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Write a Review
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <ReviewForm
            onSubmit={(review) => {
              onAddReview(review);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{review.name}</h4>
                <Rating value={review.rating} size="small" />
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.date).toLocaleDateString()}
              </span>
            </div>
            <p className="mt-2 text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 