import { Star, StarHalf } from "lucide-react";

interface Props {
  rating: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

function Stars({ rating, interactive, onRate }: Props) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 10; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 fill-yellow-500 text-yellow-500 ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(
        <StarHalf key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 text-gray-600 ${
            interactive
              ? "cursor-pointer hover:text-yellow-500 hover:scale-110 transition-all"
              : ""
          }`}
          onClick={() => interactive && onRate && onRate(i)}
        />
      );
    }
  }

  return <div className="flex items-center gap-1">{stars}</div>;
}

export default Stars;
