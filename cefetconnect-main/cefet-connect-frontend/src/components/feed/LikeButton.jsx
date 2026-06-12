export default function LikeButton({
  liked,
  total = 0,
  onClick,
  onTotalClick,
  disabled = false,
  label = "Curtir",
}) {
  const colorClass = liked
    ? "bg-[#e8f7ef] text-[#089464]"
    : "bg-[#f1f1f1] text-[#343434]";

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full text-sm font-medium transition ${colorClass}`}
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`inline-flex items-center gap-2 px-3 py-1.5 transition ${
          liked ? "hover:bg-[#d8f0e4]" : "hover:bg-[#e5e5e5]"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill={liked ? "currentColor" : "none"}
        >
          <path
            d="M12 21s-7-4.4-9.4-8.6C.8 9.2 2.6 5.5 6.1 5.1c2-.2 3.5.8 4.4 2.1.9-1.3 2.4-2.3 4.4-2.1 3.5.4 5.3 4.1 3.5 7.3C19 16.6 12 21 12 21Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>

        <span>{label}</span>
      </button>

      <button
        type="button"
        onClick={onTotalClick}
        className={`border-l border-black/10 px-3 py-1.5 font-semibold transition ${
          liked ? "hover:bg-[#d8f0e4]" : "hover:bg-[#e5e5e5]"
        }`}
        title="Ver quem curtiu"
        aria-label="Ver quem curtiu este post"
      >
        {total}
      </button>
    </div>
  );
}