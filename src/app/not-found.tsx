// Not Found Page Requirements
import { NotFound } from "@/components";
// Not Found Page Main Function
function NotFoundPage() {
  // Returns Not Found Page
  return (
    <NotFound
      backTo={{
        name: "Inicio",
        href: "/",
      }}
    />
  );
}

export default NotFoundPage;
