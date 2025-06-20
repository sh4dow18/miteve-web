// Not Found Page Requirements
import { NotFound } from "@/components";
import { Metadata } from "next";
// Not Found Page Metadata
export const metadata: Metadata = {
  title: "Página no Encontrada",
  description: "Lo sentimos, no se pudo encontrar el contenido que está buscando",
};
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
