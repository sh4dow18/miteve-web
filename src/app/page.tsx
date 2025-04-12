// Home Page Requirements
import MainLogo from "@/components/main-logo";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { Metadata } from "next";
import Link from "next/link";
// Home Page Metadata
export const metadata: Metadata = {
  title: "Miteve",
  description: `Miteve es una herramienta web que ayuda a tener un propio "Netflix en Casa" y así que se pueda disfrutar de todo el contenido descargado en un solo lugar y a través de internet`,
};
// Home Page Main Function
export default function Home() {
  // Returns Home Page
  return (
    // Home Page Main Section
    <section className="flex flex-col items-center gap-6 px-7 max-w-5xl mx-auto">
      {/* Home Page Main Title */}
      <h1 className="hidden">Miteve</h1>
      {/* Home Page Main Logo */}
      <MainLogo
        width={250}
        height={250}
        className="h-auto min-[375px]:w-[20rem] min-[560px]:w-[30rem]"
      />
      {/* Home Page Main Description */}
      <p className="text-center">
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
  );
}
