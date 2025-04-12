// Set this component as a client component
"use client";
// Stars Requirements
import dynamic from "next/dynamic";
// Stars Import without Server Side Rendering
const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });
// Stars Props
interface Props {
  count: number;
  size: number;
  value: number;
}
// Stars Main Function
function Stars({ count, size, value }: Props) {
  return (
    // Stars Main Function
    <div className="block">
      <StarRatings
        rating={value}
        starRatedColor="gold"
        numberOfStars={count}
        starDimension={`${size}px`}
        starSpacing="5px"
      />
    </div>
  );
}

export default Stars;
