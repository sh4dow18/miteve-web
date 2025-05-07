// How it Works Page Requirements
import { Picture } from "@/components";
import { Metadata } from "next";
// How it Works Page Metadata
export const metadata: Metadata = {
  title: "¿Como Funciona?",
  description:
    "Bienvenido a la guía de Miteve, Aquí encontrará todo lo que necesitas para aprender a usar Miteve",
};
// How it Works Page Main Function
function HowItWorksPage() {
  // How it Works Page Constants
  const STEP_BY_STEP_LIST = [
    {
      title: "Seleccionar el Tipo de Contenido",
      description:
        "Primero se debe identificar cual contenido desea ver, ya sea una película o una serie",
    },
    {
      title: "Ir a la Página del Tipo de Contenido",
      description:
        "Una vez identificado el tipo de contenido, se debe ir a la página correspondiente, si es una película, a la página de peliculas, si es una serie, se de ir a la pestaña de Series. Para hacerlo, en la parte superior de la pantalla verá varias opciones para la navegación. Si está en un celular o tableta, podrá ver un menu en la parte superior que puede abrir haciendo click en él",
    },
    {
      title: "Elegir el Contenido deseado",
      description:
        "Luego, al saber el tipo de contenido, se debe ahora escoger entre las diferentes peliculas o series que hay. Al haberla escogido, se debe hacer clíc sobre la carátula del contenido para poder ver más información de él",
    },
    {
      title: "Reproducir el Contenido deseado",
      description:
        "Por último, para visualizar el contenido, se debe dar clíc al botón grande de reproducir. Si es una película, accederá a la película directamente, si es una serie, accederá al primer capítulo de la serie de la primera temporada disponible.",
    },
    {
      title: "Reproducir un Capítulo en Específico (Opcional)",
      description:
        "Para series, si se desea visualizar un capítulo en particular, se debe ir abajo en la página y seleccionar la temporada disponible correspondiente, para posteriormente elegir un capítulo deseado haciendo clíc en este.",
    },
    {
      title: "Manipular el Contenido en el Reproductor",
      description:
        "Para todo tipo de contenido, existen 6 botones principales: Reproducir, Atrasar 10 Segundos, Adelantar 10 Segundos, Mutear, Volver al Contenido y Pantalla Completa. Para series, existe un botón extra, el cual permite pasar al siguiente capítulo, el cual permite pasar al siguiente capítulo de la serie si hay, sin tener que salir del reproductor. Para manipular el contenido, solo de hacer clíc a cualquiera de estos botones.",
    },
  ];
  const PICTURES_LIST = [
    {
      src: "home.png",
      alt: "Inicio",
      caption: "Inicio de Miteve",
    },
    {
      src: "movies.png",
      alt: "Películas",
      caption: "Página de Películas con Contenido",
    },
    {
      src: "movie.png",
      alt: "Kung Fu Panda",
      caption: "Página de Pelicula con Contenido",
    },
    {
      src: "episodes.png",
      alt: "Episodios de Serie",
      caption: "Página de Serie con Selección de Episodios",
    },
    {
      src: "player-series.png",
      alt: "Reproductor",
      caption: "Reproductor con Episodio de Serie",
    },
  ];
  // Returns How it Works Page
  return (
    // How it Works Page Main Container
    <div className="flex flex-col gap-5 m-6 max-w-3xl min-[351px]:mx-8 min-[800px]:mx-auto min-[1000px]:max-w-7xl">
      {/* How it Works Page Title Section */}
      <section className="flex flex-col gap-5 min-[875px]:text-center">
        {/* How it Works Page Title */}
        <h1 className="text-3xl leading-none font-bold text-gray-300 min-[466px]:text-5xl">
          ¿Como Funciona?
        </h1>
        {/* How it Works Page Title Description */}
        <p className="leading-8">
          Bienvenido a la guía de Miteve, Aquí encontrará todo lo que necesitas
          para aprender a usar Miteve
        </p>
      </section>
      {/* How it Works Page Information Container */}
      <div className="min-[1000px]:flex min-[1000px]:flex-row min-[1000px]:flex-wrap min-[1000px]:gap-10 min-[1000px]:place-content-center">
        {/* How it Works Page Steps Container */}
        <div className="flex flex-col gap-5 min-[1000px]:max-w-md min-[1351px]:max-w-lg">
          {/* How it Works Page Steps Section */}
          <section className="flex flex-col gap-5 min-[875px]:text-center">
            {/* How it Works Page Steps Title */}
            <h2 className="text-gray-300 text-2xl font-bold min-[466px]:text-4xl">
              ¿Como Puedo Ver el Contenido?
            </h2>
            {/* How it Works Page Steps Description */}
            <p className="leading-8">
              Se va explicar paso a paso cómo usar las páginas de contenido,
              como la de películas y la de series, para poder visualizar el
              contenido
            </p>
          </section>
          {/* How it Works Page Steps List */}
          <ol className="counter-reset list-none space-y-2">
            {STEP_BY_STEP_LIST.map((item, index) => (
              // Use CSS container increment to add the numbers in the list
              <li
                key={index}
                className="relative mb-5 pl-10 mt-0 before:counter-increment before:content-[counter(list-item)] before:bg-primary before:rounded-full before:text-white before:font-medium before:text-center before:absolute before:left-0 before:top-1 before:w-6 before:h-6"
              >
                {/* Step Container */}
                <p className="leading-8">
                  <strong className="text-gray-300">{item.title}</strong>:{" "}
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
          {/* How it Works Page Steps Final Paragraph */}
          <p className="leading-8">
            Como se puede observar, la página se puede navegar, así como ver el
            contenido, de una forma muy similar a aplicaciones de streaming como
            Netflix y Max.
          </p>
        </div>
        {/* How it Works Page Pictures Container */}
        <div className="flex flex-col gap-5">
          {PICTURES_LIST.map((picture, index) => (
            <Picture
              key={index}
              src={`/images/how-it-works/${picture.src}`}
              alt={picture.alt}
              caption={picture.caption}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
