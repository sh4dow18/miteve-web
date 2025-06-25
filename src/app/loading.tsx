// Loading Page Requirements
import { LoaderCircleIcon } from "lucide-react";
// Loading Page Main Function
function Loading() {
  // Returns Loading Page
  return (
    <div
      className="absolute top-0 h-full w-full"
    >
      <LoaderCircleIcon className="h-20 w-20 text-gray-300 absolute top-[50%] left-[50%] -translate-[50%] animate-spin" />
    </div>
  );
}

export default Loading;
