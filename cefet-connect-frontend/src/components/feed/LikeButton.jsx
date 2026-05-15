export default function LikeButton({
  liked,
  total = 0,
  onClick,
  disabled = false,
  label = "Curtir",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
        liked
          ? "bg-[#e8f7ef] text-[#089464]"
          : "bg-[#f1f1f1] text-[#343434] hover:bg-[#e5e5e5]"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={liked ? "currentColor" : "none"}>
        <path
          d="M12 21s-7-4.4-9.4-8.6C.8 9.2 2.6 5.5 6.1 5.1c2-.2 3.5.8 4.4 2.1.9-1.3 2.4-2.3 4.4-2.1 3.5.4 5.3 4.1 3.5 7.3C19 16.6 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>

      <span>{label}</span>

      <span className="font-semibold">{total}</span>
    </button>
  );
}