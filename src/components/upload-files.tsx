// Set this component as a client component
"use client";
// Upload Files Requirements
import { useRef, useState } from "react";
// Upload Files Props
interface Props {
  label: string;
  name: string;
  help: string;
}
// Upload Files Main Function
function UploadFiles({ label, name, help }: Props) {
  // Upload Files Hooks
  const [state, SetState] = useState<"Valid" | "Neutral" | "Invalid">(
    "Neutral"
  );
  const [errorMessage, SetErrorMessage] = useState<string | null>(null);
  const [files, SetFiles] = useState<File[]>([]);
  const [isDragging, SetIsDragging] = useState(false);
  const REFERENCE = useRef<HTMLInputElement | null>(null);
  // Upload Files Validate Files Function
  const ValidateFiles = (files: File[]) => {
    // If have no files, return false
    if (files.length === 0) {
      SetErrorMessage("No hay Archivos para Enviar");
      return -1;
    }
    // Check if have an invalid file
    let validFileState = true;
    let totalfilesSize = 0;
    files.filter((file) => {
      // Check if the file is bigger than 4 MB
      if (file.size > 4 * 1024 * 1024) {
        SetErrorMessage(`El Archivo '${file.name}' es mayor a 4 MB`);
        validFileState = false;
        return;
      }
      // Check if the file has an image extension
      if (
        !file.name.endsWith(".png") &&
        !file.name.endsWith(".jpg") &&
        !file.name.endsWith(".jpeg")
      ) {
        SetErrorMessage(`El Archivo '${file.name}' es no es una imagen válida`);
        validFileState = false;
        return;
      }
      totalfilesSize += file.size;
    });
    // Check if the total size of the files is bigger than 4 MB
    if (totalfilesSize > 4 * 1024 * 1024) {
      SetErrorMessage("Los Archivos juntos no pueden superar los 4 MB");
      validFileState = false;
    }
    // If have an invalid file, return false, else true
    return validFileState;
  };
  // Upload Files On Change Function
  const OnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // If the files exists, set the files and check if the are valid
    if (event.target.files) {
      SetFiles(Array.from(event.target.files));
      SetState(
        ValidateFiles(Array.from(event.target.files)) ? "Valid" : "Invalid"
      );
    }
  };
  // Upload Files On Drag Over Function
  const OnDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    // Avoid open image in browser
    event.preventDefault();
    // Set Dragging as true
    SetIsDragging(true);
  };
  // Upload Files On Drop Function
  const OnDrop = (event: React.DragEvent<HTMLDivElement>) => {
    // Avoid open image in browser
    event.preventDefault();
    // Set Dragging as true
    SetIsDragging(false);
    // Get dropped files
    const DROPPED_FILES = event.dataTransfer.files;
    // Set the files
    SetFiles([...DROPPED_FILES]);
    // If Reference current exists, check if there are valid, then add the files to input file
    if (REFERENCE.current) {
      SetState(ValidateFiles(Array.from(DROPPED_FILES)) ? "Valid" : "Invalid");
      REFERENCE.current.files = DROPPED_FILES;
    }
  };
  // Returns Upload Files Component
  return (
    // Upload Files Main Container
    <div className="flex flex-col gap-1">
      {/* Main Label */}
      <label htmlFor={name} className="font-medium text-white">
        {label}
      </label>
      {/* Drag and Drop Container */}
      <div
        onDragOver={OnDragOver}
        onDragLeave={() => {
          SetIsDragging(false);
        }}
        onDrop={OnDrop}
        onClick={() => {
          if (REFERENCE.current !== null) {
            REFERENCE.current.click();
          }
        }}
        className={`cursor-pointer text-center rounded-md outline-2 py-8 px-1 min-[344px]:px-3 ${
          files.length > 0
            ? state === "Valid"
              ? "bg-gray-700"
              : "bg-red-900"
            : isDragging
            ? "bg-primary-light"
            : "bg-gray-800 outline-gray-800 focus-within:outline-primary"
        }`}
      >
        {/* Drag and Drop Line */}
        <span
          className={
            isDragging || state !== "Neutral" ? "text-white" : undefined
          }
        >
          {files.length > 0
            ? state === "Valid"
              ? `¡Hay ${files.length} Archivos listos para subir!`
              : errorMessage
            : isDragging
            ? "¡Suelta los archivos aquí!"
            : "Haz clic o arrastra archivos aquí"}
        </span>
        {/* Main Input */}
        <input
          id={name}
          ref={REFERENCE}
          type="file"
          name={name}
          multiple
          aria-invalid={state !== "Neutral" ? state === "Invalid" : undefined}
          onChange={OnChange}
          className="hidden"
          required
        />
      </div>
      {/* Main Help */}
      <small>{help}</small>
    </div>
  );
}

export default UploadFiles;
