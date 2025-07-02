// Set this component as a client component
"use client";
// Textarea Requirements
import { ChangeEvent, useState } from "react";
// Textarea Props
interface Props {
  label: string;
  name: string;
  placeholder: string;
  help: string;
  maxLength?: number;
  rows?: number;
  optional?: boolean;
}
// Textarea Main Function
function Textarea({
  label,
  name,
  placeholder,
  help,
  maxLength,
  rows,
  optional,
}: Props) {
  // Textarea Hooks
  const [state, SetState] = useState<"Valid" | "Neutral">("Neutral");
  const [actualChars, SetActualChars] = useState<number>(0);
  // Textarea On Change Function
  const OnChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // Event Value
    const VALUE = event.target.value;
    // If Value is Empty, set Neutral, else Valid
    SetState(VALUE.length === 0 ? "Neutral" : "Valid");
    // Set Actual Chars with the Actual Length
    SetActualChars(VALUE.length);
  };
  // Returns Textarea component
  return (
    // Textarea Main Container
    <div className="flex flex-col gap-1">
      {/* Textarea Label */}
      <label htmlFor={name} className="text-white font-medium">
        {label}
      </label>
      {/* Textarea Second Container */}
      <div className="rounded-md outline-2 py-2 px-1 bg-gray-800 outline-gray-800 focus-within:outline-primary min-[344px]:px-3">
        {/* Main Textarea */}
        <textarea
          id={name}
          name={name}
          placeholder={`Ejemplo: ${placeholder}`}
          maxLength={maxLength || 255}
          rows={rows || 4}
          onChange={OnChange}
          aria-invalid={state === "Valid" ? false : undefined}
          required={optional !== true}
          className="w-full resize-none text-white bg-transparent outline-hidden"
        />
        {/* Textarea Chars Container */}
        <div className="text-right mr-2">
          <small>{`${actualChars} / ${maxLength || 255}`}</small>
        </div>
      </div>
      {/* Textarea Help */}
      <small>{`${help}${
        optional === true
          ? ". Este Campo es Opcional. Si se deja vacio o con solo espacios, se tomará como nulo"
          : ""
      }`}</small>
    </div>
  );
}

export default Textarea;
