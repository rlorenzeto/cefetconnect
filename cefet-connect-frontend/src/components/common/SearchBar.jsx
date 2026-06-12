export default function SearchBar({
  value,
  onChange,
  placeholder = "Pesquisar ...",
  className = "",
}) {
  return (
    <label
      className={`flex h-11 w-full items-center gap-3 rounded-[10px] bg-white px-4 text-[#202020] shadow-sm ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0 text-[#202020]"
        fill="none"
      >
        <circle
          cx="11"
          cy="11"
          r="6.5"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M16 16l4 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#202020] outline-none placeholder:text-[#8a8a8a]"
      />
    </label>
  );
}