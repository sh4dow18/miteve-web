// Home Page Requirements
import Accordion from "@/components/accordion";
import MainLogo from "@/components/main-logo";
import {
  ArrowRightIcon,
  ComputerDesktopIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/16/solid";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cloneElement, ReactElement } from "react";
// Home Page Metadata
export const metadata: Metadata = {
  title: "Miteve",
  description: `Miteve es una herramienta web que ayuda a tener un propio "Netflix en Casa" y así que se pueda disfrutar de todo el contenido descargado en un solo lugar y a través de internet`,
};
// Home Page Main Function
export default function Home() {
  // Home Page Constants
  const IMAGES_LIST = [
    {
      name: "Kung Fu Panda",
      cover: "d1RHScaZc7I8j0lDke1c4AxI435",
      type: "Para Disfrutar en Familia",
      href: "/movies/9502",
    },
    {
      name: "Deadpool & Wolverine",
      cover: "by8z9Fe8y7p4jo2YlW2SZDnptyT",
      type: "Toda la Acción",
      href: "/movies/533535",
    },
    {
      name: "Matrix",
      cover: "icmmSD4vTTDKOq2vvdulafOGw93",
      type: "Lo Mejor de Keanu Reaves",
      href: "/movies/603",
    },
    {
      name: "My Hero Academia",
      cover: "6wSSyRNeF9vBJ1h29nuw3vG9hZI",
      type: "Series Imaginativas",
      href: "/series/65930",
    },
    {
      name: "The Walking Dead",
      cover: "5PCKxpFcCTDFT3b1olJGPaAIM9e",
      type: "Series de Estados Unidos",
      href: "/series/206586",
    },
  ];
  const BENEFITS_LIST = [
    {
      image: <ComputerDesktopIcon />,
      title: "Accede a todo tu contenido en un solo lugar",
      description:
        "Clasifica tus películas y series descargadas en un solo lugar, con un sistema que optimiza tu biblioteca multimedia",
    },
    {
      image: <QuestionMarkCircleIcon />,
      title: "Una Interfaz intuitiva y moderna",
      description:
        "Diseñado con Next.js, TailwindCSS y TypeScript, Miteve es de código abierto, personalizable y completamente gratuito.",
    },
    {
      image: <UserGroupIcon />,
      title: "Pensado para todos los usuarios",
      description:
        "Ideal para familias, cinéfilos o cualquier persona que quiera tener su propia plataforma de streaming en casa",
    },
    {
      image: <ShieldCheckIcon />,
      title: "Rápido y seguro",
      description:
        "Reproduce tu contenido en segundos, sin anuncios y sin necesidad de servicios de terceros ni configuraciones complicadas",
    },
  ];
  const QUESTIONS_LIST = [
    {
      name: "¿Como me Registro?",
      answer:
        "Actualmente no existe un sistema de Usuarios en Miteve, por lo que no se puede registrar, pero esto cambiará en futuras versiones.",
    },
    {
      name: "¿En qué dispositivos funciona Miteve?",
      answer:
        "Funciona en todos los dispositivos que cuenten con un navegador semimoderno, debido a que es una página web, por lo que funciona en computadoras, tables, móviles y hasta en televisores con navegador",
    },
    {
      name: "¿Miteve tiene algún costo?",
      answer:
        "No, es una herramienta de código abierto y completamente gratuita.",
    },
    {
      name: "¿Qué necesito para usar Miteve?",
      answer:
        "Solo necesita una computadora donde alojar su contenido descargado y una conexión a Internet para accederlo desde sus dispositivos.",
    },
    {
      name: "¿Puedo acceder a Miteve fuera de mi casa?",
      answer:
        "Por si solo, Miteve no es capaz de acceder a este contenido fuera de la red local, pero como funciona como página web, se puede hostear en cualquier lugar que admita Next.JS, como Vercel que es un PaaS, así como crear su propio servidor con Nginx o usar Hostinet, por ejemplo. No se recomienda usar un servidor de Red Privada Virtual (VPN) propio en su propio servidor para poder acceder a este, debido que estos relentizan mucho los servicios de streaming",
    },
    {
      name: "¿Miteve organiza automáticamente mis series y películas?",
      answer:
        "Miteve permite que actualice usted su contenido a través de la ventana de Administración de manera sencilla y el contenido se pondriá desde su gestor de archivos",
    },
    {
      name: "¿Es necesario saber de programación para usar Miteve?",
      answer: "No, Miteve está diseñado para ser intuitivo y fácil de usar.",
    },
    {
      name: "¿Es necesario saber de programación para administrar Miteve?",
      answer:
        "No, actualmente se puede administrar Miteve desde la misma aplicación y el contenido a través del explorador de archivos",
    },
    {
      name: "¿Qué formatos de video soporta Miteve?",
      answer:
        "Tiene como objetivo usar por defecto archivos WEBM, ya que estos tipos de archivos son recomendados para Streaming, porque funcionan en la mayor cantidad de dispositivos y navegadores, además de que pueden tener una alta resolución con el menor peso posible, pero también el administrador puede elegir el formato de su contenido, ya sea MP4, MKV, AVI, entre otros",
    },
    {
      name: "¿Puedo personalizar la apariencia de Miteve?",
      answer: "Actualmente no, pero en futuras versiones esto podría cambiar",
    },
  ];
  // Returns Home Page
  return (
    // Home Page Main Section
    <div className="flex flex-col gap-14 my-5 px-7 max-w-5xl mx-auto">
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
        <div className="flex flex-col gap-6 justify-center min-[345px]:flex-row min-[345px]:flex-wrap">
          {/* Begins Link */}
          <Link
            href="/movies"
            className="bg-primary text-white px-4 py-2 font-medium rounded-md text-center hover:bg-primary-light"
          >
            Empezar
          </Link>
          {/* How it works Link */}
          <Link
            href="/how-it-works"
            className="bg-gray-600 text-white px-4 py-2 rounded-md text-center hover:bg-gray-500"
          >
            ¿Como Funciona?
          </Link>
          {/* View Docs Link Container */}
          <div className="flex gap-1 items-center hover:text-white">
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
      {/* Benefits Section */}
      <section>
        {/* Benefits Information Container */}
        <div className="mb-10 md:text-center md:mx-auto">
          {/* Mini Title */}
          <span className="font-semibold text-primary mt-1">
            Disfruta más Rápido
          </span>
          {/* Benefits Title */}
          <h2 className="text-gray-300 text-3xl font-bold mb-5 min-[361px]:text-4xl md:text-5xl">
            {`La forma más sencilla de tener tu propio "Netflix en casa"`}
          </h2>
          {/* Benefits Description */}
          <p className="leading-8">
            Creado por un programador con diplomado en aplicaciones
            informáticas, Miteve transforma tu colección de videos descargados
            en una plataforma accesible desde cualquier dispositivo conectado a
            Internet, haciendo que tu entretenimiento sea más organizado,
            accesible y fácil de disfrutar
          </p>
        </div>
        {/* Benefits "Benefits" Container */}
        <div className="flex flex-col gap-6 mt-5 min-[779px]:flex-row min-[779px]:flex-wrap min-[779px]:justify-center min-[779px]:gap-5">
          {BENEFITS_LIST.map((benefit, index) => (
            <section
              key={index}
              className="flex gap-3 min-[779px]:max-w-xs lg:max-w-sm xl:max-w-md"
            >
              <div>
                {cloneElement(
                  benefit.image as ReactElement<{ className?: string }>,
                  {
                    className: "w-10 p-2 bg-primary rounded-lg fill-gray-200",
                  }
                )}
              </div>
              <section className="flex flex-col gap-2">
                <span className="font-semibold text-gray-300">
                  {benefit.title}
                </span>
                <p className="leading-7">{benefit.description}</p>
              </section>
            </section>
          ))}
        </div>
      </section>
      {/* The Best of the Content Section */}
      <section className="flex flex-col items-center gap-6">
        {/* The Best of the Content Title */}
        <h2 className="text-3xl font-bold text-gray-300 min-[375px]:text-4xl min-[426px]:text-[2.7rem] min-[468px]:text-3xl md:text-4xl">
          Lo Mejor de Series y Películas
        </h2>
        {/* The Best of the Content Description */}
        <p className="leading-7 min-[361px]:text-center">
          Miteve es el destino ideal para disfrutar de todo el contenido que se
          posea, como grandes relatos, dramas apasionantes y las comedias más
          destacadas
        </p>
        {/* The Best of the Content Images */}
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
      {/* Questions Section */}
      <section>
        {/* Questions Title */}
        <h2 className="text-gray-300 text-4xl font-bold mb-5 md:text-center">
          ¿Aún tienes preguntas?
        </h2>
        {/* Questions Accordions */}
        <div className="flex flex-col gap-5 mt-7">
          {QUESTIONS_LIST.map((question, index) => (
            <Accordion
              key={index}
              title={question.name}
              content={question.answer}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
