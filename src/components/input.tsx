// Set this component as a client component
"use client";
// Input Requirements
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { ChangeEvent, Ref, useState } from "react";
// Input Props
interface Props {
  label: string;
  placeholder: string;
  name: string;
  help: string;
  validation:
    | "float"
    | "text"
    | "int"
    | "intNoCero"
    | "name"
    | "file"
    | "time"
    | "code"
    | "email";
  disabled?: boolean;
  autoComplete?: string;
  maxLength?: number;
  optional?: boolean;
  reference?: Ref<HTMLInputElement>;
}
// Input Regular Expressions to use in Validations
const REGEX: Record<string, RegExp> = {
  // Only Positive Numbers
  // Example: 8000 or 0.20
  float: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/,
  // Only Readable Text
  // Example: Ramsés or Juan Tamarindo or Pepelefu
  text: /^[a-zA-Z0-9ÁÉÍÓÚÑáéíóúñ ]+$/,
  // Only Integer Numbers
  // Example: 8000 or 9502
  int: /^\d+$/,
  // Only Integer Numbers without 0
  // Example: 8000 or 9502
  intNoCero: /^[1-9]\d*$/,
  // Only Names
  // Example: John Doe or Mario Bros
  name: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ']+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ']+)*$/,
  // Only Files Names
  // Example: Kung Fu Panda.webm or Astralopitecus.mp4
  file: /^[\w\s\-()\[\]]+\.[a-zA-Z0-9]{1,5}$/,
  // Only Time Format
  // Example: 00:45:23 or 01:00:21
  time: /^(00|01):[0-5]\d:[0-5]\d$/,
  // Only Youtube Video Code
  // Example: P8S3DKZCNeI or eMM_ssMgGOM
  code: /^[a-zA-Z0-9_-]+$/,
  // Only valid e-mails
  // Example: sh4dow18@miteve.com or example@example.com
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};
// Input Main Function
function Input({
  label,
  placeholder,
  name,
  help,
  validation,
  disabled,
  autoComplete,
  maxLength,
  optional,
  reference,
}: Props) {
  // Input Hooks
  const [state, SetState] = useState<"Valid" | "Neutral" | "Invalid">(
    "Neutral"
  );
  // Input on Change Function
  const OnChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Event Value
    const VALUE = event.target.value;
    // If Value is Empty, set Neutral
    if (VALUE.length == 0) {
      SetState("Neutral");
    }
    // If is not empty, check if it is valid
    else {
      // If Value is Valid, set Valid
      if (REGEX[validation ? validation : name].test(VALUE)) {
        SetState("Valid");
        return;
      }
      // If Value is not Valid, set Invalid
      SetState("Invalid");
    }
  };
  // Returns Input Component
  return (
    // Input Container
    <div className="flex flex-col gap-1">
      {/* Input Label */}
      <label
        htmlFor={name}
        aria-disabled={disabled}
        className="font-medium text-white aria-disabled:text-gray-700"
      >
        {label}
      </label>
      {/* Input Content Container */}
      <div
        aria-disabled={disabled}
        className="flex place-content-between rounded-md outline-2 py-2 px-1 focus-within:outline-primary bg-gray-800 outline-gray-800 aria-disabled:bg-gray-900 aria-disabled:outline-gray-900 min-[344px]:px-3"
      >
        {/* Main Input */}
        <input
          ref={reference}
          id={name}
          name={name}
          type="text"
          placeholder={`Ejemplo: ${placeholder}`}
          onChange={OnChange}
          aria-invalid={state !== "Neutral" ? state === "Invalid" : undefined}
          disabled={disabled}
          autoComplete={autoComplete || "on"}
          maxLength={maxLength || 10}
          required={optional === true ? false : true}
          className="w-full bg-transparent outline-hidden disabled:text-gray-600 text-white disabled:placeholder:text-gray-600"
        />
        {/* Input Validation Icon */}
        {state === "Neutral" ? (
          <div className="hidden min-[360px]:block min-[360px]:w-6 min-[360px]:h-6" />
        ) : state === "Valid" ? (
          <CheckIcon
            aria-disabled={disabled}
            className="hidden min-[360px]:block min-[360px]:w-6 aria-disabled:opacity-0"
          />
        ) : (
          <XMarkIcon
            aria-disabled={disabled}
            className="hidden min-[360px]:block min-[360px]:w-6 min-[360px]:fill-red-500 aria-disabled:opacity-0"
          />
        )}
      </div>
      {/* Input Help Message */}
      <small
        aria-disabled={disabled}
        className={`aria-disabled:text-gray-600 ${
          state !== "Neutral"
            ? state === "Invalid"
              ? "text-red-500"
              : undefined
            : undefined
        }`}
      >
        {`${help}${optional === true ? ". Este Campo es OPCIONAL" : ""}`}
      </small>
    </div>
  );
}

export default Input;
