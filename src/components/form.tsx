// Set this component as a client component
"use client";
// Form Requirements
import { FormEvent, useEffect, useRef, useState } from "react";
import Modal from "./modal";
// Form Props
interface Props {
  children: React.ReactNode;
  submitButton: string;
  OnSubmit: (event: FormEvent<HTMLFormElement>) => Promise<Response>;
  className?: string;
  extraValidation?: boolean;
}
// Form Main Function
function Form({
  children,
  submitButton,
  OnSubmit,
  className,
  extraValidation,
}: Props) {
  // Form Hooks
  const [disabled, SetDisabled] = useState<boolean>(true);
  const [modalSettings, SetModalSettings] = useState<{
    open: boolean;
    status: "success" | "error" | "loading";
    message: string;
  }>({
    open: false,
    status: "loading",
    message: "Cargando...",
  });
  // Form Reference
  const REFERENCE = useRef<HTMLFormElement | null>(null);
  // Form Main Use Effect Hook
  useEffect(() => {
    // Update Disable Attribute in Submit Button
    const UpdateButton = () => {
      // If the Reference Exists, continue
      if (REFERENCE.current) {
        // First, get every Input, Textarea and Select in the Form
        // Later, create a new key-value array with input name and aria-invalid attribute
        // Example: [ ["name", true], ["email", false] ]
        const inputsList = Array.from(
          REFERENCE.current.querySelectorAll<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
          >("input, textarea, select")
        ).map((input) => [
          input.name,
          input.getAttribute("aria-invalid") === "false",
        ]);
        // Create a new object from a key-value array
        // Example: From [ ["name", true], ["email", false] ] to { name: true, email: false }
        const FORM_OBJECT = Object.fromEntries(inputsList);
        // Get values from FORM_OBJECT to check if every value is true
        // If it is true, set false, if not, set true
        // Also, if there is an extra validation, check it
        const VALIDATION =
          extraValidation !== undefined
            ? !Object.values(FORM_OBJECT).every(Boolean) ||
              extraValidation === false
            : !Object.values(FORM_OBJECT).every(Boolean);
        SetDisabled(VALIDATION);
      }
    };
    // Update Button Function Call
    UpdateButton();
    // Create a new observer for "aria invalid" attributes to update the disabled attribute on the Submit button
    // Mutation Observer can observe changes in the DOM
    const ARIA_INVALID_OBSERVER = new MutationObserver(UpdateButton);
    // If the Reference Exists, continue
    if (REFERENCE.current) {
      // Aria Invalid Observer can observe attributes and subtrees, but focuses on the aria-invalid attribute and its children
      ARIA_INVALID_OBSERVER.observe(REFERENCE.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ["aria-invalid", "disabled"],
        childList: true,
      });
    }
    // When useEffect finishes, unmount the observer
    return () => {
      ARIA_INVALID_OBSERVER.disconnect();
    };
  }, [extraValidation]);
  // Form On Submit Function
  const FormOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // Avoid reloading the page
    event.preventDefault();
    // Open Loading Modal
    SetModalSettings({
      ...modalSettings,
      open: true,
    });
    // Execute the On Submit Function Submitted and get the Response from API
    const RESPONSE = await OnSubmit(event);
    // Check if the Response is OK
    const OK = RESPONSE.ok;
    // Set modal to success or error, depending on the response
    SetModalSettings({
      open: true,
      status: OK === true ? "success" : "error",
      message:
        OK === true
          ? "Se ha realizado la operación con éxito"
          : (await RESPONSE.json()).message,
    });
  };
  // Returns Form Component
  return (
    <>
      <form
        className={
          className || "w-full min-[1024px]:max-w-3xl min-[1440px]:max-w-2xl"
        }
        ref={REFERENCE}
        onSubmit={FormOnSubmit}
      >
        {/* Form Body */}
        {children}
        {/* Form Submit Button */}
        <button
          type="submit"
          disabled={disabled}
          className="w-full mt-5 py-2 px-3 font-medium rounded-md text-center text-white bg-primary cursor-pointer hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {submitButton}
        </button>
      </form>
      <Modal
        open={modalSettings.open}
        status={modalSettings.status}
        message={modalSettings.message}
        Close={() => {
          SetModalSettings({
            open: false,
            status: "loading",
            message: "Cargando...",
          });
          if (modalSettings.status === "success") {
            location.reload();
          }
        }}
      />
    </>
  );
}

export default Form;
