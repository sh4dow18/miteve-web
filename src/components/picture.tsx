// Set this component as a client component
"use client";
// Picture Requirements
import Image from "next/image";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
// Picture Props
interface Props {
  src: string;
  alt: string;
  caption: string;
}
// Picture Main Function
function Picture({ src, alt, caption }: Props) {
  // Picture Hooks
  const [open, SetOpen] = useState<boolean>(false);
  // Picture Image Handler Function
  const OpenAndCloseImage = () => {
    // If the browser does not support view transitions, do not do it, else do it
    document.startViewTransition
      ? document.startViewTransition(() => SetOpen(!open))
      : SetOpen(!open);
  };
  // Returns Picture Component
  return (
    // Picture Main Container
    <div>
      {/* Main Figure */}
      <figure
        onClick={OpenAndCloseImage}
        className="cursor-pointer min-[1000px]:w-96 min-[1351px]:w-full"
      >
        <Image
          src={src}
          alt={alt}
          width={1000}
          height={100}
          priority
          className="w-full h-auto rounded-lg min-[1351px]:max-w-[530px]"
        />
        <figcaption className="text-xs mt-3 text-center">{caption}</figcaption>
      </figure>
      {/* Picture Modal to view the Picture Bigger */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative">
            <XMarkIcon
              onClick={OpenAndCloseImage}
              className="w-6 h-6 absolute top-2 right-2 text-white text-2xl cursor-pointer"
            />
            <Image
              src={src}
              alt={alt}
              width={1000}
              height={100}
              className="max-w-full max-h-[90vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Picture;
