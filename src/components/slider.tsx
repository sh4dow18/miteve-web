// Set this component as a client component
"use client";
// Slider Stylesheets
import "keen-slider/keen-slider.min.css";
// Slider Requirements
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Content, Series } from "@/lib/types";
// Slider Props
interface Props {
  title: string;
  contentList: Content[] | Series[];
  type: "movies" | "series";
  lessSlides?: boolean;
}
// Slider Main Function
function Slider({ title, contentList, type, lessSlides }: Props) {
  // Slider Hooks
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: lessSlides
      ? { perView: 5.2, spacing: 7 }
      : { perView: 9.2, spacing: 7 },
    breakpoints: lessSlides
      ? {
          "(max-width: 600px)": { slides: { perView: 4.2, spacing: 7 } },
          "(max-width: 400px)": { slides: { perView: 3.2, spacing: 7 } },
        }
      : {
          "(max-width: 1500px)": { slides: { perView: 8.2, spacing: 10 } },
          "(max-width: 1300px)": { slides: { perView: 7.2, spacing: 7 } },
          "(max-width: 1100px)": { slides: { perView: 6.2, spacing: 7 } },
          "(max-width: 800px)": { slides: { perView: 5.2, spacing: 7 } },
          "(max-width: 600px)": { slides: { perView: 4.2, spacing: 7 } },
          "(max-width: 400px)": { slides: { perView: 3.2, spacing: 7 } },
        },
  });
  // Returs Slider Component
  return (
    // Slider Main Section
    <section className="flex flex-col gap-3">
      {/* Slider Title */}
      <h2 className="font-semibold text-xl text-gray-300 md:text-2xl">
        {title}
      </h2>
      {/* Slider Images Container */}
      <div className="flex items-center gap-2 relative">
        {/* Slider Left Button */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="hidden cursor-pointer md:block md:absolute md:top-0 md:left-0 md:z-10 md:shadow-xs md:bg-gray-900/70 md:h-full"
        >
          <ChevronLeftIcon className="w-10 h-10 fill-gray-300/70" />
        </button>
        {/* Slider Images */}
        <div ref={sliderRef} className="keen-slider">
          {contentList.map((content) => (
            // Slider Card
            <Link
              key={content.id}
              href={`/${type}/${content.id}`}
              className="keen-slider__slide rounded-md"
            >
              <Image
                src={content.image}
                alt={`${content.title} Cover`}
                width={300}
                height={450}
                className={`rounded-md w-44 mx-auto transition-all ease-in-out hover:scale-110 ${
                  lessSlides
                    ? "h-28 min-[376px]:h-32 min-[481px]:h-36 min-[580px]:h-40 min-[800px]:h-44 min-[850px]:h-52"
                    : "h-32 min-[481px]:h-36 min-[560px]:h-40 min-[730px]:h-44 min-[1000px]:h-56 min-[1440px]:h-64"
                }`}
              />
            </Link>
          ))}
        </div>
        {/* Slider Right Button */}
        <button
          onClick={() => instanceRef.current?.next()}
          className="hidden cursor-pointer md:block md:absolute md:top-0 md:right-0 md:z-10 md:shadow-xs md:bg-gray-900/70 md:h-full"
        >
          <ChevronRightIcon className="w-10 h-10" />
        </button>
      </div>
    </section>
  );
}

export default Slider;
