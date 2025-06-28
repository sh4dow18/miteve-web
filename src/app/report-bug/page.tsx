// Set this component as a client component
"use client";
// Report Bug Page Requirements
import { Form, Input, Textarea, UploadFiles } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { FormEvent } from "react";
// Report Bug Page Main Function
function ReportBugPage() {
  // Form On Submit Function
  const OnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = new FormData(event.currentTarget);
    return await fetch("/api/emails/bug", {
      method: "POST",
      body: FORM,
    });
  };
  // Return Report Bug Page
  return (
    // Report Bug Page Main Container
    <div className="flex flex-col gap-5 my-6 max-w-2xl mx-6 min-[710px]:mx-auto">
      {/* Report Bug Page Information Section */}
      <section className="flex flex-col gap-5 min-[370px]:text-center">
        {/* Report Bug Page Page Title */}
        <h1 className="text-3xl leading-none font-bold text-gray-300 min-[466px]:text-5xl">
          Reportar Problema
        </h1>
        {/* Report Bug Page Title Description */}
        <p className="leading-8">
          Ayuda a tener el sistema al día reportando los problemas que
          encuentres en Miteve
        </p>
      </section>
      <Form
        submitButton="Reportar Problema"
        OnSubmit={OnSubmit}
        className="flex flex-col gap-3"
      >
        {/* Inputs Container */}
        <div className="flex flex-col gap-5 min-[660px]:grid min-[660px]:grid-cols-2">
          {/* Name Input */}
          <Input
            label="Nombre"
            placeholder="Ramsés Solano"
            help="Solo Nombres Válidos"
            name="name"
            validation="name"
            maxLength={30}
          />
          {/* E-Mail Input */}
          <Input
            label="Correo Electrónico"
            placeholder="sh4dow18@miteve.com"
            help="Únicamente usado para Contacto"
            name="email"
            validation="email"
            maxLength={50}
            autoComplete="email"
          />
        </div>
        {/* Message Textarea */}
        <Textarea
          label="Mensaje"
          name="message"
          help="Describe detalladamente el problema encontrado"
          placeholder="No me deja ver la película Kung fu Panda"
          maxLength={500}
        />
        {/* Upload Files Drag and Drop Input */}
        <UploadFiles
          label="Evidencia"
          name="files"
          help="Solo Archivos PNG, JPG y JPEG. Los archivos juntos deben tener un peso menor a 4 MB. Esta es requerida para resolver con la mayor brevedad posible"
        />
      </Form>
      {/* Or Separation */}
      <div className="flex items-center grayScale:grayscale">
        <div className="grow border-t border-gray-500 highContrast:border-black lowContrast:border-gray-300" />
        <span className="mx-4 highContrast:text-black lowContrast:text-gray-500">
          ó
        </span>
        <div className="grow border-t border-gray-500 highContrast:border-black lowContrast:border-gray-300" />
      </div>
      {/* Report on Github Button */}
      <Link
        href="https://github.com/sh4dow18/miteve-web/issues/new"
        target="_blank"
      >
        <div className="flex gap-2 place-content-center bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 grayScale:grayscale">
          <Image
            src="/logos/github.svg"
            alt="Github Logo"
            width={25}
            height={25}
            className="filter brightness-150"
          />
          <span>Reportar en Github</span>
        </div>
      </Link>
    </div>
  );
}

export default ReportBugPage;
