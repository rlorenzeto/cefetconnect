export default function BrandLogo({ className = "", variant = "full" }) {
  if (variant === "icon") {
    return (
      <img
        src="/logo-sem-escrito.png"
        alt="Cefet Connect"
        className={className}
      />
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/logo-sem-escrito.png"
        alt="Cefet Connect"
        className="h-12 w-auto object-contain"
      />

      <div className="flex flex-col leading-none">
        <span className="text-[18px] font-extrabold italic tracking-tight text-[#2d67c5]">
          CEFET
        </span>
        <span className="text-[17px] font-extrabold italic tracking-tight text-[#65c64d]">
          Connect
        </span>
      </div>
    </div>
  );
}