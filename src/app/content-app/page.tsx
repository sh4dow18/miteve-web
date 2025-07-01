// Set this component as a client component
"use client";
// Content App Page Requirements
import { Form, Input, Textarea } from "@/components";
import { FormEvent } from "react";
// RContent App Page Main Function
function ContentAppPage() {
  // Form On Submit Function
  const OnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    const BODY = {
      name: FORM.username.value,
      email: FORM.email.value,
      message: FORM.message.value,
    };
    return await fetch("/api/emails/content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Return Content App Page
  return (
    // Content App Page Main Container
    <div className="flex flex-col gap-5 my-6 max-w-2xl mx-6 min-[710px]:mx-auto">
      {/* Content App Page Information Section */}
      <section className="flex flex-col gap-5 min-[370px]:text-center">
        {/* Content App Page Page Title */}
        <h1 className="text-3xl leading-none font-bold text-gray-300 min-[466px]:text-5xl">
          Solicitar Contenido
        </h1>
        {/* Content App Page Title Description */}
        <p className="leading-8">
          Ayuda indicando que te gustaría ver en Miteve
        </p>
      </section>
      <Form
        submitButton="Solicitar Contenido"
        OnSubmit={OnSubmit}
        className="flex flex-col gap-3"
        messages={{
          success: "El Contenido ha sido solicitado",
          loading: "Solicitando Contenido...",
        }}
      >
        {/* Inputs Container */}
        <div className="flex flex-col gap-5 min-[660px]:grid min-[660px]:grid-cols-2">
          {/* Name Input */}
          <Input
            label="Nombre"
            placeholder="Ramsés Solano"
            help="Solo Nombres Válidos"
            name="username"
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
          help="Describe detalladamente el contenido te gustaría ver, debido a que pueden existir contenidos parecidos y se necesita saber con detalle el contenido que desea. Si solo desea una temporada de una serie, indicarla."
          placeholder="Me gustaría ver el anime Samurai X, pero la original de 1996, no la nueva, además solo quiero los últimos 10 capítulos"
          maxLength={255}
        />
      </Form>
    </div>
  );
}

export default ContentAppPage;
