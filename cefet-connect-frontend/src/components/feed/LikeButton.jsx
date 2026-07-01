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
        className={`inline-flex items-center gap-2 px-3 py-1.5 leading-none transition ${
          liked ? "hover:bg-[#d8f0e4]" : "hover:bg-[#e5e5e5]"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0"
          fill={liked ? "currentColor" : "none"}
          aria-hidden="true"
        >
          <path
            d="M12 20.7 10.55 19.38C5.4 14.72 2 11.63 2 7.85 2 4.78 4.42 2.35 7.5 2.35c1.74 0 3.41.82 4.5 2.1 1.09-1.28 2.76-2.1 4.5-2.1 3.08 0 5.5 2.43 5.5 5.5 0 3.78-3.4 6.87-8.55 11.53L12 20.7Z"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <span className="leading-none">{label}</span>
      </button>

      <button
        type="button"
        onClick={onTotalClick}
        className={`border-l border-black/10 px-3 py-1.5 font-semibold leading-none transition ${
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