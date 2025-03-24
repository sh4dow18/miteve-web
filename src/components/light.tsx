// Light Props
interface Props {
  direction: "tl" | "br";
}
// Light Main Function
function Light({ direction }: Props) {
  // Returns Light Component
  return (
    // Light Diffusion Container
    <div
      className={`absolute inset-x-0 overflow-hidden blur-3xl dark:opacity-50 lg:transform-gpu ${
        direction === "br" ? "bottom-28 min-[500px]:left-auto" : "top-12"
      }`.trimEnd()}
      aria-hidden="true"
    >
      {/* Polygon container for light */}
      <div
        className={`relative aspect-1155/678 w-[36.125rem] bg-linear-to-tr from-[#dc150a] to-primary ${
          direction === "br"
            ? "translate-x-20"
            : "-translate-x-3/4 min-[500px]:-translate-x-1/2 md:-translate-x-1/4"
        }`}
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
      />
    </div>
  );
}

export default Light;