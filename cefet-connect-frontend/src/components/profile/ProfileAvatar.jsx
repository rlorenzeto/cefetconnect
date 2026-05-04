function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-14 w-14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21c1.5-4.2 4-6.2 7.5-6.2s6 2 7.5 6.2" />
    </svg>
  );
}

export default function ProfileAvatar({ src, name, size = "large" }) {
  const sizeClass =
    size === "small"
      ? "h-32 w-32"
      : "h-40 w-40 lg:h-52 lg:w-52";

  return (
    <div
      className={`mx-auto flex ${sizeClass} items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] text-[#777] shadow-sm`}
    >
      {src ? (
        <img src={src} alt={name || "Foto de perfil"} className="h-full w-full object-cover" />
      ) : (
        <UserIcon />
      )}
    </div>
  );
}