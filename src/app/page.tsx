import MainLogo from "@/components/main-logo";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-6 px-7 max-w-5xl mx-auto">
      <h1 className="hidden">Miteve</h1>
      <MainLogo
        width={250}
        height={250}
        className="h-auto min-[375px]:w-[20rem] min-[560px]:w-[30rem]"
      />
      <p className="text-center">
        Miteve es una herramienta web que ayuda a tener un propio "Netflix en
        Casa" y así que se pueda disfrutar de todo el contenido descargado en un
        solo lugar y a través de internet
      </p>
      {/* CTA Section */}
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
