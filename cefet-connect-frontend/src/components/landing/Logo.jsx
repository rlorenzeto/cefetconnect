import { cn } from "../../lib/utils";

export function Logo({ className, variant = "default" }) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className="relative inline-flex h-16 w-16 shrink-0 items-center justify-center"
      >
        <img
          src="/logo.png"
          alt="CEFET Connect Logo"
          className="h-full w-full object-contain"
        />
      </span>

      <span className="flex flex-col leading-[0.75] tracking-tight">
        <span
          className={cn(
            "font-sans text-xl font-black tracking-wide",
            variant === "light" ? "text-white" : "text-[#0051ba]"
          )}
        >
          CEFET
        </span>

        <span
          className={cn(
            "font-sans text-xl font-bold tracking-normal -mt-1.5",
            variant === "light" ? "text-white/90" : "text-[#5cb036]"
          )}
        >
          Connect
        </span>
      </span>
    </span>
  );
}