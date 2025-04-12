// Main Logo Requirements
import Image from "next/image";
// Main Logo Props
interface Props {
  width: number;
  height: number;
  className: string;
}
// Main Logo Main Function
function MainLogo({ width, height, className }: Props) {
  // Returns Main Logo Component
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
