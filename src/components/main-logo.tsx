// Mateory Logo Requirements
import Image from "next/image";
// Mateory Logo Props
interface Props {
  width: number;
  height: number;
  className: string;
}
// Mateory Logo Main Function
function MainLogo({ width, height, className }: Props) {
  // Returns Mateory Logo Component
  return (
    <Image
      src="/logo.svg"
      alt="Miteve Logo"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}

export default MainLogo;
