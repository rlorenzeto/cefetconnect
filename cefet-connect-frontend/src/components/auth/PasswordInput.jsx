import { useState } from "react";

function EyeIcon({ isVisible }) {
  if (isVisible) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
        <circle cx="12" cy="12" r="2.8" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2.8 2.8 0 0 0 3.9 3.9" />
      <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c5.5 0 9 6 9 6a16.2 16.2 0 0 1-3.2 3.8" />
      <path d="M6.2 6.3C4.1 7.8 3 10 3 10s3.5 6 9 6c1.5 0 2.8-.3 4-.9" />
    </svg>
  );
}

export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={isVisible ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 pr-11 text-sm outline-none"
      />

      <button
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[#777]"
        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
      >
        <EyeIcon isVisible={isVisible} />
      </button>
    </div>
  );
}