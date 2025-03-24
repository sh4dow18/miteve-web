// Logo Requirements
import Image from "next/image";
import Link from "next/link";
// Logo Props
interface Props {
  href: string;
  icon: string;
  width?: number;
  height?: number;
}
// Logo Main Function
function Logo({ href, icon, width, height }: Props) {
  // Returns Logo Component
  return (
    // Logo Link
    <Link href={href} target="_blank">
      {/* Logo Image */}
      <Image
        src={`/logos/${icon}.svg`}
        alt={`${icon} logo`}
        width={width || 30}
        height={height || 30}
        className="filter brightness-0 hover:brightness-50 dark:brightness-100 dark:hover:brightness-150"
      />
    </Link>
  );
}

export default Logo;