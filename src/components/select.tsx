"use client";
// Select Requirements
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, useRef, useState } from "react";
// Select Props
interface Props {
  name: string;
  label: string;
  optionsList: { name: string; value: string }[];
  multiple?: boolean;
}
// Select Main Function
function Select({ name, label, optionsList, multiple }: Props) {
  // Select hooks
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const [state, SetState] = useState<"Valid" | "Neutral">("Neutral");
  // Select On Change Function
  const OnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // Checks if it is an Select Multiple or Select Simple
    if (multiple === true) {
      // Checks if the selected options are at least 1, if so it is valid
      SetState(event.target.selectedOptions.length > 0 ? "Valid" : "Neutral");
      return;
    }
    SetState(event.target.value !== "" ? "Valid" : "Neutral");
  };
  // Returns Select Component
  return (
    // Select Container
    <div className="flex flex-col gap-1">
      {/* Select Label */}
      <label
        htmlFor={name}
        className="text-black font-medium dark:text-white lowContrast:text-gray-500"
      >
        {label}
      </label>
      {/* Select Content Container */}
      <div className="relative w-full">
        {/* Main Select */}
        <select
          ref={selectRef}
          id={name}
          name={name}
          multiple={multiple}
          onChange={OnChange}
          aria-invalid={state === "Valid" ? false : undefined}
          className="w-full appearance-none bg-gray-50 text-black rounded-md outline-2 py-2 pl-1 outline-gray-300 focus-within:outline-mateoryPurple dark:bg-gray-800 dark:text-white dark:outline-gray-800 highContrast:bg-white highContrast:outline-black lowContrast:bg-gray-100 lowContrast:outline-gray-300 lowContrast:text-gray-500 min-[344px]:pl-3"
        >
          {optionsList.map((option, index) => (
            <option key={index} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
        {/* Select Arrow */}
        {multiple === undefined && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <ChevronDownIcon className="w-5" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Select;
