import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 16, showNumber = false, reviewsCount = null }) => {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== null && (
        <span className="text-xs text-slate-400">({reviewsCount})</span>
      )}
    </div>
  );
};

export default RatingStars;

