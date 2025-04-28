// Home Page Requirements
import MainLogo from "@/components/main-logo";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
// Home Page Metadata
export const metadata: Metadata = {
  title: "Miteve",
  description: `Miteve es una herramienta web que ayuda a tener un propio "Netflix en Casa" y así que se pueda disfrutar de todo el contenido descargado en un solo lugar y a través de internet`,
};
// Home Page Main Function
export default function Home() {
  const IMAGES_LIST = [
    {
      name: "Kung Fu Panda",
      cover: "d1RHScaZc7I8j0lDke1c4AxI435",
      type: "Para Disfrutar en Familia",
      href: "/9502?type=movies",
    },
    {
      name: "Deadpool & Wolverine",
      cover: "by8z9Fe8y7p4jo2YlW2SZDnptyT",
      type: "Toda la Acción",
      href: "/533535?type=movies",
    },
    {
      name: "Matrix",
      cover: "icmmSD4vTTDKOq2vvdulafOGw93",
      type: "Lo Mejor de Keanu Reaves",
      href: "/603?type=movies",
    },
    {
      name: "My Hero Academia",
      cover: "6wSSyRNeF9vBJ1h29nuw3vG9hZI",
      type: "Series Imaginativas",
      href: "/65930?type=series",
    },
    {
      name: "The Walking Dead",
      cover: "5PCKxpFcCTDFT3b1olJGPaAIM9e",
      type: "Series de Estados Unidos",
      href: "/206586?type=series",
    },
  ];
  // Returns Home Page
  return (
    // Home Page Main Section
    <div className="flex flex-col gap-6 my-5 px-7 max-w-5xl mx-auto">
      <section className="flex flex-col items-center gap-6">
        {/* Home Page Main Title */}
        <h1 className="hidden">Miteve</h1>
        {/* Home Page Main Logo */}
        <MainLogo
          width={250}
          height={250}
          className="h-auto min-[375px]:w-[20rem] min-[560px]:w-[30rem]"
        />
        {/* Home Page Main Description */}
        <p className="text-center leading-7">
          {`Miteve es una herramienta web que ayuda a tener un propio "Netflix en
        Casa" y así que se pueda disfrutar de todo el contenido descargado en un
        solo lugar y a través de internet`}
        </p>
        {/* Home Page Main CTA Section */}
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* How it works Link */}
          <Link
            href="/movies"
            className="bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
          >
            Empezar
          </Link>
          {/* View Docs Link Container */}
          <div className="flex gap-1 sm:items-center hover:text-white">
            <Link
              href="https://github.com/sh4dow18/miteve-web"
              target="_blank"
              className="font-bold"
            >
              Ver Documentación
            </Link>
            <ArrowRightIcon className="w-4" />
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center gap-6">
        <h2 className="text-3xl font-bold text-gray-300 min-[375px]:text-4xl min-[426px]:text-[2.7rem] min-[468px]:text-3xl md:text-4xl">
          Lo Mejor de Series y Películas
        </h2>
        <p className="leading-7 min-[361px]:text-center">
          Miteve es el destino ideal para disfrutar de todo el contenido que se
          posea, como grandes relatos, dramas apasionantes y las comedias más
          destacadas
        </p>
        <div className="flex flex-wrap gap-5 place-content-center">
          {IMAGES_LIST.map((image, index) => (
            <Link
              key={index}
              href={image.href}
              className="overflow-hidden rounded-sm w-[45%] sm:w-[30%]"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500/${image.cover}.jpg`}
                alt={`${image.name} Cover`}
                width={500}
                height={300}
                className="transition-all cursor-pointer hover:scale-110"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
