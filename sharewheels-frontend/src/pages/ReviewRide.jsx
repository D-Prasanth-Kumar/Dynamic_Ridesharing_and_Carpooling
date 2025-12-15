import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Star, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function ReviewRide() {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0); 
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await api.post('/reviews', {
        rideId,
        rating,
        comment
      });

      alert('Thank you! Your review has been submitted.');
      navigate('/dashboard');

    } catch (err) {
      alert('Error submitting review: ' + (err.response?.data || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-txt-main transition-colors duration-300">
      <Navbar />

      <div className="flex items-center justify-center min-h-[85vh] px-6">
        <div className="bg-card border border-txt-muted/20 rounded-2xl p-8 shadow-xl max-w-md w-full">

          {/* Header */}
          <h2 className="text-2xl font-bold text-center mb-2">Rate Your Ride</h2>
          <p className="text-center text-txt-dim mb-8">How was your experience?</p>

          {/* Rating Stars */}
          <div className="flex justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-125"
              >
                <Star
                  size={42}
                  className={
                    star <= (hover || rating)
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow'
                      : 'text-gray-300'
                  }
                />
              </button>
            ))}
          </div>

          {/* Comment Box */}
          <div className="mb-6">
            <label className="text-sm text-txt-dim font-medium">Your Feedback (Optional)</label>
            <textarea
              rows="4"
              placeholder="Share your experience with the driver..."
              className="w-full bg-white/5 border border-txt-muted/20 rounded-xl p-4 text-sm outline-none 
                         focus:ring-2 focus:ring-brand-purple/40 transition-all mt-2"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-4">
            <button
                onClick={handleSubmit}
                disabled={isLoading || rating === 0}
                className={`
                px-5 py-2 rounded-xl font-bold shadow-xl transition-all flex items-center justify-center gap-2
                ${
                    rating === 0 || isLoading
                    ? "bg-blue-600/40 text-white shadow-blue-600/10 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:-translate-y-1"
                }
                `}
            >
                {isLoading ? (
                <Loader2 className="animate-spin text-white" size={20} />
                ) : (
                <span>Submit Review</span>
                )}
            </button>
            </div>

        </div>
      </div>
    </div>
  );
}
