// Error Page Requirements
import { NotFound } from "@/components";
import { Metadata } from "next";
// Error Page Metadata
export const metadata: Metadata = {
  title: "Error",
  description:
    "Esta es una página de error cuando no se encuentra la base de datos",
};
// Error Page Main Function
function Error() {
  return (
    <NotFound
      backTo={{
        name: "Inicio",
        href: "/",
      }}
      message={{
        title: "Base de Datos No Encontrada",
        description:
          "La Base de Datos de películas y series no se encuentra disponible. Contacte al administrador para más información",
      }}
    />
  );
}

export default Error;
