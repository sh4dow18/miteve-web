// Not Found Requirements
import Link from "next/link";
// Not Found Props
interface Props {
  backTo: {
    name: string;
    href: string;
  };
}
// Not Found Main Function
function NotFound({ backTo }: Props) {
  // Returns Not Found Component
  return (
    // Not Found Container
    <div className="text-center px-10">
      {/* Not Found Code */}
      <span className="text-primary-light font-semibold mb-2 text-center">
        404
      </span>
      {/* Not Found information section */}
      <section className="flex flex-col gap-5 items-center">
        {/* Not Found Title */}
        <h1 className="text-gray-300 text-[2.5rem] leading-none font-bold min-[351px]:text-5xl min-[420px]:text-6xl">
          Contenido No Encontrado
        </h1>
        {/* Not Found Description */}
        <p>Lo sentimos, no se pudo encontrar el contenido que está buscando.</p>
        {/* Not Found Link */}
        <Link
          href={backTo.href}
          className="w-fit bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
        >
          Volver a {backTo.name}
        </Link>
      </section>
    </div>
  );
}

export default NotFound;
