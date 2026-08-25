import Image from "next/legacy/image";

interface LogoProps {
  src: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ src, alt = "Logo" }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 rounded-full">
      {/* Replace icon with an image, matching the icon's size */}
      <Image src={src} alt={alt} width={100} height={100} />
    </div>
  );
};

export default Logo;
