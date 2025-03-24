"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

interface Props {
  contentList: Content[];
  type: "movies" | "series";
}

function Slider({ contentList, type }: Props) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 8.5, spacing: 20 },
    breakpoints: {
      "(max-width: 1440px)": { slides: { perView: 7.5, spacing: 20 } },
      "(max-width: 1200px)": { slides: { perView: 6.5, spacing: 20 } },
      "(max-width: 920px)": { slides: { perView: 5.5, spacing: 20 } },
      "(max-width: 620px)": { slides: { perView: 4.5, spacing: 20 } },
      "(max-width: 480px)": { slides: { perView: 3.5, spacing: 20 } },
    },
  });

  return (
    <div className="flex items-center gap-2 relative">
      <button
        onClick={() => instanceRef.current?.prev()}
        className="hidden cursor-pointer md:block md:absolute md:top-0 md:left-0 md:z-10 md:shadow-xs md:bg-gray-900/70 md:h-full"
      >
        <ChevronLeftIcon className="w-10 h-10 fill-gray-300/70" />
      </button>
      <div ref={sliderRef} className="keen-slider">
        {contentList.map((content) => (
          <div key={content.id} className="keen-slider__slide rounded-md">
            <Link href={`/${content.id}?type=${type}`}>
              <Image
                src={content.image}
                alt={`${content.title} Cover`}
                width={300}
                height={450}
                className="rounded-md w-44 h-28 mx-auto transition-all ease-in-out hover:scale-110 min-[376px]:h-32 min-[481px]:h-36 min-[621px]:h-40 min-[920px]:h-44 min-[1440px]:h-64"
              />
            </Link>
          </div>
        ))}
      </div>
      <button
        onClick={() => instanceRef.current?.next()}
        className="hidden cursor-pointer md:block md:absolute md:top-0 md:right-0 md:z-10 md:shadow-xs md:bg-gray-900/70 md:h-full"
      >
        <ChevronRightIcon className="w-10 h-10" />
      </button>
    </div>
  );
}

export default Slider;
