"use client";
import dynamic from "next/dynamic";

const StarRatings = dynamic(() => import("react-star-ratings"), { ssr: false });

interface Props {
  count: number;
  size: number;
  value: number;
}

function Stars({ count, size, value }: Props) {
  return (
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
