// Set this component as a client component
"use client";
// Accordion Requirements
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
// Accordion Props
interface Props {
  title: string;
  content: string;
}
// Accordion Main Function
function Accordion({ title, content }: Props) {
  // Accordion Hooks
  const [isOpen, SetIsOpen] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // When the user click outside the Accordion
    function ClickOutside(event: MouseEvent) {
      // If the user click outside, close Accordion
      if (
        sectionRef.current &&
        !sectionRef.current.contains(event.target as Node)
      ) {
        SetIsOpen(false);
      }
    }
    // Add an event listener on the mouse to know when the accordion is clicked outside
    document.addEventListener("mousedown", ClickOutside);
    // Remove the event listener when the component is not used
    return () => {
      document.removeEventListener("mousedown", ClickOutside);
    };
  }, []);
  // Returns Accordion Component
  return (
    // Accordion Section
    <section
      ref={sectionRef}
      onClick={() => SetIsOpen(!isOpen)}
      className="cursor-pointer"
    >
      {/* Accordion Title Container */}
      <div
        className="flex items-center justify-between py-3 border-b-1 border-gray-400/70 aria-expanded:text-gray-300 aria-expanded:border-gray-400/100 hover:text-gray-300"
        aria-expanded={isOpen}
      >
        {/* Accordion Title */}
        <span className="font-semibold text-left flex-1">{title}</span>
        {/* Accordion Icon */}
        <ChevronDownIcon
          className="w-6 h-6 shrink-0 transition-transform duration-300 aria-expanded:rotate-180"
          aria-expanded={isOpen}
        />
      </div>
      {/* Accordion Content */}
      <p
        className="leading-7 overflow-hidden transition-all ease-in-out duration-300 max-h-0 aria-expanded:mt-3 aria-expanded:max-h-[500px]"
        aria-expanded={isOpen}
      >
        {content}
      </p>
    </section>
  );
}

export default Accordion;
