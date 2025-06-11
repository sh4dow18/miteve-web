// Set this component as a client page
"use client";
// Admin Page Requirements
import { Form, Input, Select } from "@/components";
import { CONTAINER, TMBD_CONTENT } from "@/lib/types";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
// Admin Page Main Function
function Admin() {
  // Admin Page Consts
  const FORMS_BUTTONS_LIST = [
    { id: 1, name: "Géneros" },
    { id: 2, name: "Películas" },
    { id: 3, name: "Series" },
    { id: 4, name: "Temporadas" },
    { id: 5, name: "Episodios" },
    { id: 6, name: "Contenedores" },
  ];
  const DEFAULT_CONTENT_INFO = {
    id: "No hay Información",
    title: "No hay Información",
    year: "No hay Información",
    tagline: "No hay Información",
    description: "No hay Información",
    rating: "No hay Información",
    originCountry: "No hay Información",
    classification: "No hay Información",
    cast: "No hay Información",
    company: "No hay Información",
    collection: "No hay Información",
    cover: "404.png",
    background: "404.png",
  };
  const CONTAINER_TYPES_LIST = [
    { name: "Series", value: "series" },
    { name: "Peliculas", value: "movies" },
  ];
  // Admin Page Hooks
  const [selectedModel, SetSelectedModel] = useState<number>(1);
  const [genresList, SetGenresList] = useState([]);
  const [containers, SetContainers] = useState({
    movies: [],
    series: [],
  });
  const contentRef = useRef<HTMLInputElement | null>(null);
  const [contentInfo, SetContentInfo] =
    useState<TMBD_CONTENT>(DEFAULT_CONTENT_INFO);
  useEffect(() => {
    // Function used to get genres from API
    const GetGenres = async () => {
      const RESPONSE = await fetch("/api/genres").then((response) =>
        response.json()
      );
      SetGenresList(
        RESPONSE.map((genre: { id: number; name: string }) => ({
          name: genre.name,
          value: `${genre.id}`,
        }))
      );
    };
    // Function used to get containers from API
    const GetContainers = async () => {
      const RESPONSE = await fetch("/api/container").then((response) =>
        response.json()
      );
      const MOVIES_CONTAINERS_LIST = RESPONSE.filter(
        (container: CONTAINER) => container.type === "movies"
      ).map((container: CONTAINER) => ({
        name: container.name,
        value: `${container.id}`,
      }));
      const SERIES_CONTAINERS_LIST = RESPONSE.filter(
        (container: CONTAINER) => container.type === "series"
      ).map((container: CONTAINER) => ({
        name: container.name,
        value: `${container.id}`,
      }));
      SetContainers({
        movies: MOVIES_CONTAINERS_LIST,
        series: SERIES_CONTAINERS_LIST,
      });
    };
    GetGenres();
    GetContainers();
  }, []);
  // Function that allows to get Movie Info from The Movie Database API
  const GetMovieInfo = async () => {
    // Check if exists TMDB movie id in input
    if (
      contentRef === null ||
      contentRef.current === null ||
      Number.isNaN(Number.parseInt(contentRef.current.value))
    ) {
      return;
    }
    // Get the Movie Information
    const MOVIE = await fetch(`/api/movie?id=${contentRef.current.value}`).then(
      (response) => response.json()
    );
    // If the Movie does not exists in The Movie Database, return
    if (MOVIE.success === false) {
      return;
    }
    // Get Rating as Float Number
    const RATING = Number.parseFloat(MOVIE.vote_average);
    // Set all Movie Information
    SetContentInfo({
      id: MOVIE.id,
      title: MOVIE.title,
      year: MOVIE.release_date ? MOVIE.release_date.split("-")[0] : "N/A",
      tagline: MOVIE.tagline !== "" ? MOVIE.tagline : "N/A",
      description: MOVIE.overview !== "" ? MOVIE.overview : "N/A",
      rating:
        RATING !== 0.0
          ? `${(RATING / 2).toPrecision(2)}`
          : "No Posee Información",
      classification: MOVIE.classification,
      cast: MOVIE.cast,
      company:
        MOVIE.production_companies && MOVIE.production_companies.length > 0
          ? MOVIE.production_companies[0].name
          : null,
      collection: MOVIE.belongs_to_collection
        ? MOVIE.belongs_to_collection.name
        : null,
      cover: MOVIE.poster_path,
      background: MOVIE.backdrop_path,
    });
  };
  // Function that allows to get Series Info from The Movie Database API
  const GetSeriesInfo = async () => {
    // Check if exists TMDB series id in input
    if (
      contentRef === null ||
      contentRef.current === null ||
      Number.isNaN(Number.parseInt(contentRef.current.value))
    ) {
      return;
    }
    // Get the Series Information
    const SERIES = await fetch(
      `/api/movie?id=${contentRef.current.value}&series=true`
    ).then((response) => response.json());
    // If the Series does not exists in The Movie Database, return
    if (SERIES.success === false) {
      return;
    }
    // Get Rating as Float Number
    const RATING = Number.parseFloat(SERIES.vote_average);
    // Set all Series Information
    SetContentInfo({
      id: SERIES.id,
      title: SERIES.name,
      year: SERIES.last_air_date ? SERIES.last_air_date.split("-")[0] : "N/A",
      tagline: SERIES.tagline !== "" ? SERIES.tagline : "N/A",
      description: SERIES.overview !== "" ? SERIES.overview : "N/A",
      rating:
        RATING !== 0.0
          ? `${(RATING / 2).toPrecision(2)}`
          : "No Posee Información",
      originCountry: SERIES.origin_country[0]
        ? SERIES.origin_country[0]
        : "N/A",
      classification: SERIES.classification,
      cast: SERIES.cast,
      cover: SERIES.poster_path,
      background: SERIES.backdrop_path,
    });
  };
  // Genre Form On Submit Function
  const GenreSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    return await fetch("http://localhost:8080/api/genres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: FORM.genreName.value }),
    });
  };
  // Movie Form On Submit Function
  const MovieSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    // Get a list of option values from Genres Select Multiple
    const GENRES_LIST = Array.from(
      FORM.genresList.selectedOptions as HTMLCollectionOf<HTMLOptionElement>
    ).map((option) => option.value);
    // Set Body to Send the Request
    const BODY = {
      id: contentInfo.id,
      title: contentInfo.title,
      year: contentInfo.year,
      tagline: contentInfo.tagline,
      description: contentInfo.description,
      rating: contentInfo.rating,
      classification: contentInfo.classification,
      cast: contentInfo.cast,
      company: contentInfo.company,
      collection: contentInfo.collection,
      cover: contentInfo.cover,
      background: contentInfo.background,
      genresList: GENRES_LIST,
      trailer: FORM.trailer.value,
      containerId: FORM.container.value,
      orderInContainer: FORM.orderNumber.value,
    };
    return await fetch("http://localhost:8080/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Series Form On Submit Function
  const SeriesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    // Get a list of option values from Genres Select Multiple
    const GENRES_LIST = Array.from(
      FORM.genresList.selectedOptions as HTMLCollectionOf<HTMLOptionElement>
    ).map((option) => option.value);
    // Set Body to Send the Request
    const BODY = {
      id: contentInfo.id,
      title: contentInfo.title,
      year: contentInfo.year,
      tagline: contentInfo.tagline,
      description: contentInfo.description,
      rating: contentInfo.rating,
      classification: contentInfo.classification,
      cast: contentInfo.cast,
      originCountry: contentInfo.originCountry,
      cover: contentInfo.cover,
      background: contentInfo.background,
      genresList: GENRES_LIST,
      trailer: FORM.trailer.value,
      containerId: FORM.container.value,
      orderInContainer: FORM.orderNumber.value,
    };
    return await fetch("http://localhost:8080/api/series", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Seasons Form On Submit Function
  const SeasonsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    const BODY = {
      id: FORM.seriesId.value,
      firstSeason: FORM.firstSeason.value,
      firstEpisode: FORM.firstEpisode.value,
      lastSeason: FORM.lastSeason.value,
      lastEpisode: FORM.lastEpisode.value,
    };
    return await fetch("/api/seasons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Episode Form On Submit Function
  const EpisodesSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    const BODY = {
      id: FORM.seriesId.value,
      seasonNumber: FORM.seasonNumber.value,
      episodeNumber: FORM.episodeNumber.value,
      beginSummary: FORM.beginSummary.value,
      endSummary: FORM.endSummary.value,
      beginIntro: FORM.beginIntro.value,
      endIntro: FORM.endIntro.value,
      beginCredits: FORM.beginCredits.value,
    };
    return await fetch("/api/update-episode", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Containers Form On Submit Function
  const ContainersSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const FORM = event.target as HTMLFormElement;
    const BODY = {
      name: FORM.containerName.value,
      type: FORM.containerType.value,
    };
    return await fetch("/api/container", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(BODY),
    });
  };
  // Returns Admin Page
  return (
    // Admin Page Main Container
    <div className="flex flex-col gap-4 items-center px-6">
      {/* Admin Page Information Container */}
      <section className="flex flex-col gap-4">
        {/* Admin Page Title */}
        <h1 className="text-4xl leading-none font-bold text-gray-300 min-[375px]:text-center min-[375px]:text-5xl">
          Administración
        </h1>
        {/* Admin Page Description */}
        <span className="min-[375px]:text-center">
          Seleccione el formulario para administrar
        </span>
        {/* Admin Page Form Buttons */}
        <div className="flex flex-col gap-3 max-w-xl min-[375px]:flex-row min-[375px]:flex-wrap min-[375px]:place-content-center">
          {FORMS_BUTTONS_LIST.map((button) => (
            <button
              key={button.id}
              onClick={() => {
                SetSelectedModel(button.id);
                SetContentInfo(DEFAULT_CONTENT_INFO);
              }}
              className={`py-2 px-3 font-medium rounded-md text-center min-[375px]:w-[9.1rem] ${
                selectedModel === button.id
                  ? "bg-primary text-white"
                  : "cursor-pointer bg-gray-700"
              }`}
            >
              {button.name}
            </button>
          ))}
        </div>
      </section>
      {/* Admin Page Genre Form */}
      {selectedModel === 1 && (
        <Form
          submitButton="Agregar Género"
          OnSubmit={GenreSubmit}
          className="w-full max-w-md"
        >
          <Input
            label="Nombre"
            placeholder="Acción"
            name="genreName"
            help="Nombre del Género"
            validation="text"
            maxLength={15}
          />
        </Form>
      )}
      {/* Admin Page Movie Form */}
      {selectedModel === 2 && (
        <Form
          className="flex flex-col gap-4 w-full max-w-xl"
          submitButton="Agregar Película"
          extraValidation={contentInfo.title !== "No hay Información"}
          OnSubmit={MovieSubmit}
        >
          <Input
            label="The Movie Database Id"
            placeholder="123456"
            name="tmdbId"
            help="Identificador de la Película en TMBD"
            validation="int"
            reference={contentRef}
          />
          {/* Button to Search Movie Information */}
          <button
            className="py-2 px-3 font-medium rounded-md text-center bg-primary text-white w-full cursor-pointer hover:bg-primary-light"
            type="button"
            onClick={GetMovieInfo}
          >
            Buscar Película
          </button>
          {/* Movie Information Section */}
          <section className="flex flex-col gap-4">
            {/* Movie Information Title */}
            <h2 className="text-gray-200 text-xl font-bold min-[361px]:text-2xl md:text-3xl">
              Información de la Película
            </h2>
            {/* Movie Infomation */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">Título</span>
                  <p>{contentInfo.title}</p>
                </section>
                <section>
                  <span className="text-white">Año</span>
                  <p>{contentInfo.year}</p>
                </section>
                <section>
                  <span className="text-white">Eslogan</span>
                  <p>{contentInfo.tagline}</p>
                </section>
              </div>
              <section>
                <span className="text-white">Descripción</span>
                <p>{contentInfo.description}</p>
              </section>
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">Valoración</span>
                  <p>{contentInfo.rating}</p>
                </section>
                <section>
                  <span className="text-white">Clasificación</span>
                  <p>{contentInfo.classification}</p>
                </section>
                <section>
                  <span className="text-white">Cŕeditos</span>
                  <p>{contentInfo.cast}</p>
                </section>
              </div>
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">Compañía</span>
                  <p>{contentInfo.company}</p>
                </section>
                <section>
                  <span className="text-white">Colección</span>
                  <p>{contentInfo.collection}</p>
                </section>
              </div>
              {/* Movie Information Images */}
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section className="min-[450px]:w-[23%] min-[548px]:w-[26%]">
                  <span className="text-white">Carátula</span>
                  <Image
                    src={
                      contentInfo.cover === "404.png" ||
                      contentInfo.cover === null
                        ? "/images/cover-404.png"
                        : `https://image.tmdb.org/t/p/w500/${contentInfo.cover}`
                    }
                    alt="Cover Image"
                    width={400}
                    height={400}
                  />
                </section>
                <section className="min-[450px]:w-[60%] min-[548px]:w-[70%]">
                  <span className="text-white">Fondo</span>
                  <Image
                    src={
                      contentInfo.background === "404.png" ||
                      contentInfo.background === null
                        ? "/images/404.png"
                        : `https://image.tmdb.org/t/p/w500/${contentInfo.background}`
                    }
                    alt="Cover Image"
                    width={400}
                    height={400}
                  />
                </section>
              </div>
            </div>
          </section>
          {/* Genres List Select */}
          <Select
            label="Géneros"
            name="genresList"
            optionsList={genresList}
            help="Géneros Disponibles para las películas"
            disabled={genresList.length === 0}
            multiple
          />
          {/* Containers List Select */}
          <Select
            label="Contenedor"
            name="container"
            optionsList={containers.movies}
            help="Géneros Disponibles para las películas"
            disabled={containers.movies.length === 0}
          />
          <div className="flex flex-col gap-3 min-[530px]:flex-row">
            {/* Order Input */}
            <Input
              label="Orden en Contenedor"
              placeholder="3"
              name="orderNumber"
              help="Número Entero Positivo de Orden en el Contenedor Seleccionado"
              validation="intNoCero"
              maxLength={2}
            />
            {/* Trailer Input */}
            <Input
              label="Trailer"
              placeholder="PXi3Mv6KMzY"
              name="trailer"
              help="Código de Trailer de Youtube"
              validation="text"
              maxLength={20}
            />
          </div>
        </Form>
      )}
      {/* Admin Page Series Form */}
      {selectedModel === 3 && (
        <Form
          className="flex flex-col gap-4 w-full max-w-xl"
          submitButton="Agregar Serie"
          extraValidation={contentInfo.title !== "No hay Información"}
          OnSubmit={SeriesSubmit}
        >
          <Input
            label="The Movie Database Id"
            placeholder="123456"
            name="tmdbId"
            help="Identificador de la Serie de TMBD"
            validation="int"
            reference={contentRef}
          />
          {/* Button to Search Series Information */}
          <button
            className="py-2 px-3 font-medium rounded-md text-center bg-primary text-white w-full cursor-pointer hover:bg-primary-light"
            type="button"
            onClick={GetSeriesInfo}
          >
            Buscar Serie
          </button>
          {/* Movie Information Section */}
          <section className="flex flex-col gap-4">
            {/* Movie Information Title */}
            <h2 className="text-gray-200 text-xl font-bold min-[361px]:text-2xl md:text-3xl">
              Información de la Serie
            </h2>
            {/* Movie Infomation */}
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">Título</span>
                  <p>{contentInfo.title}</p>
                </section>
                <section>
                  <span className="text-white">Año</span>
                  <p>{contentInfo.year}</p>
                </section>
                <section>
                  <span className="text-white">Eslogan</span>
                  <p>{contentInfo.tagline}</p>
                </section>
              </div>
              <section>
                <span className="text-white">Descripción</span>
                <p>{contentInfo.description}</p>
              </section>
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">Valoración</span>
                  <p>{contentInfo.rating}</p>
                </section>
                <section>
                  <span className="text-white">Clasificación</span>
                  <p>{contentInfo.classification}</p>
                </section>
                <section>
                  <span className="text-white">Cŕeditos</span>
                  <p>{contentInfo.cast}</p>
                </section>
              </div>
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section>
                  <span className="text-white">País de Origen</span>
                  <p>{contentInfo.originCountry}</p>
                </section>
              </div>
              {/* Series Information Images */}
              <div className="flex gap-3 flex-wrap min-[400px]:gap-5">
                <section className="min-[450px]:w-[23%] min-[548px]:w-[26%]">
                  <span className="text-white">Carátula</span>
                  <Image
                    src={
                      contentInfo.cover === "404.png" ||
                      contentInfo.cover === null
                        ? "/images/cover-404.png"
                        : `https://image.tmdb.org/t/p/w500/${contentInfo.cover}`
                    }
                    alt="Cover Image"
                    width={400}
                    height={400}
                  />
                </section>
                <section className="min-[450px]:w-[60%] min-[548px]:w-[70%]">
                  <span className="text-white">Fondo</span>
                  <Image
                    src={
                      contentInfo.background === "404.png" ||
                      contentInfo.background === null
                        ? "/images/404.png"
                        : `https://image.tmdb.org/t/p/w500/${contentInfo.background}`
                    }
                    alt="Cover Image"
                    width={400}
                    height={400}
                  />
                </section>
              </div>
            </div>
          </section>
          {/* Genres List Select */}
          <Select
            label="Géneros"
            name="genresList"
            optionsList={genresList}
            help="Géneros Disponibles para las películas"
            disabled={genresList.length === 0}
            multiple
          />
          {/* Containers List Select */}
          <Select
            label="Contenedor"
            name="container"
            optionsList={containers.series}
            help="Géneros Disponibles para las películas"
            disabled={containers.series.length === 0}
          />
          <div className="flex flex-col gap-3 min-[530px]:flex-row">
            {/* Order Input */}
            <Input
              label="Orden en Contenedor"
              placeholder="3"
              name="orderNumber"
              help="Número Entero Positivo de Orden en el Contenedor Seleccionado"
              validation="intNoCero"
              maxLength={2}
            />
            {/* Trailer Input */}
            <Input
              label="Trailer"
              placeholder="PXi3Mv6KMzY"
              name="trailer"
              help="Código de Trailer de Youtube"
              validation="text"
              maxLength={20}
            />
          </div>
        </Form>
      )}
      {/* Admin Page Season Form */}
      {selectedModel === 4 && (
        <Form
          className="flex flex-col gap-4 w-full max-w-xl"
          submitButton="Agregar Temporadas"
          OnSubmit={SeasonsSubmit}
        >
          {/* Series Id Input */}
          <Input
            label="Identificador de Serie"
            placeholder="1399"
            name="seriesId"
            help="Identificador de la Serie Existente"
            validation="int"
            maxLength={10}
          />
          <div className="flex flex-col gap-3 min-[530px]:flex-row min-[530px]:gap-5">
            {/* First Season Input */}
            <Input
              label="Temporada Inicial"
              placeholder="1"
              name="firstSeason"
              help="Número de Primera Temporada Disponible de la Serie"
              validation="int"
              maxLength={2}
            />
            {/* First Episode Input */}
            <Input
              label="Episodio Inicial"
              placeholder="1"
              name="firstEpisode"
              help="Número de Primer Episodio Disponible de la Serie"
              validation="int"
              maxLength={4}
            />
          </div>
          <div className="flex flex-col gap-3 min-[530px]:flex-row min-[530px]:gap-5">
            {/* Last Season Input */}
            <Input
              label="Temporada Final"
              placeholder="8"
              name="lastSeason"
              help="Número de Última Temporada Disponible de la Serie"
              validation="int"
              maxLength={2}
            />
            {/* Last Episode Input */}
            <Input
              label="Episodio Final"
              placeholder="8"
              name="lastEpisode"
              help="Número de Último Episodio Disponible de la Serie"
              validation="int"
              maxLength={4}
            />
          </div>
        </Form>
      )}
      {/* Admin Page Episodes Form */}
      {selectedModel === 5 && (
        <Form
          className="flex flex-col gap-4 w-full max-w-xl"
          submitButton="Actualizar Episodio"
          OnSubmit={EpisodesSubmit}
        >
          <div className="flex flex-col gap-3 min-[530px]:flex-row min-[530px]:gap-5">
            {/* Series Id Input */}
            <Input
              label="Serie"
              placeholder="1399"
              name="seriesId"
              help="Identificador de la Serie Existente"
              validation="int"
              maxLength={10}
            />
            {/* Season Number Input */}
            <Input
              label="Temporada"
              placeholder="1"
              name="seasonNumber"
              help="Número de la Temporada Existente"
              validation="int"
              maxLength={10}
            />
            {/* Episode Number Input */}
            <Input
              label="Episodio"
              placeholder="1"
              name="episodeNumber"
              help="Número del Episodio Existente"
              validation="int"
              maxLength={10}
            />
          </div>
          <div className="flex flex-col gap-3 min-[530px]:flex-row min-[530px]:gap-5">
            {/* Begin Summary Time Input */}
            <Input
              label="Empieza el Resumen"
              placeholder="00:00:00"
              name="beginSummary"
              help="Tiempo en el que empieza el resumen del capitulo"
              validation="time"
              maxLength={8}
            />
            {/* End Summary Time Input */}
            <Input
              label="Termina el Resumen"
              placeholder="00:01:00"
              name="endSummary"
              help="Tiempo en el que termina el resumen del capitulo"
              validation="time"
              maxLength={8}
            />
          </div>
          <div className="flex flex-col gap-3 min-[530px]:flex-row min-[530px]:gap-5">
            {/* Begin Intro Time Input */}
            <Input
              label="Empieza la Intro"
              placeholder="00:00:00"
              name="beginIntro"
              help="Tiempo en el que empieza la intro del capitulo"
              validation="time"
              maxLength={8}
            />
            {/* End Intro Time Input */}
            <Input
              label="Termina la Intro"
              placeholder="00:01:00"
              name="endIntro"
              help="Tiempo en el que termina la intro del capitulo"
              validation="time"
              maxLength={8}
            />
          </div>
          {/* Begin Credits Time Input */}
          <Input
            label="Empiezan los Créditos"
            placeholder="00:00:00"
            name="beginCredits"
            help="Tiempo en el que empiezan los créditos del capitulo"
            validation="time"
            maxLength={8}
          />
        </Form>
      )}
      {/* Admin Page Container Form */}
      {selectedModel === 6 && (
        <Form
          className="flex flex-col gap-4 w-full max-w-xl"
          submitButton="Agregar Contenedor"
          OnSubmit={ContainersSubmit}
        >
          {/* Container's Name Input */}
          <Input
            label="Nombre"
            placeholder="Para Disfrutar en Familia"
            name="containerName"
            help="Nombre del Contenedor de Contenido"
            validation="text"
            maxLength={30}
          />
          {/* Container Types List Select */}
          <Select
            label="Tipos de Contenedor"
            name="containerType"
            optionsList={CONTAINER_TYPES_LIST}
            help="Tipos de Contenedores Disponibles. Este permite conocer en que espacio se va a agregar el contenedor"
          />
        </Form>
      )}
    </div>
  );
}

export default Admin;
