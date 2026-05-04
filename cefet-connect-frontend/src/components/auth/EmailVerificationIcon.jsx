export default function EmailVerificationIcon() {
  return (
    <div className="relative flex h-16 w-20 items-center justify-center">
      <div className="absolute inset-x-2 bottom-1 h-10 rounded-xl bg-white/45 shadow-sm" />

      <div className="relative flex h-11 w-14 items-center justify-center rounded-md bg-white shadow-md">
        <div className="absolute inset-0 rounded-md bg-white" />

        <div className="absolute inset-0 overflow-hidden rounded-md">
          <div className="absolute left-0 top-0 h-full w-full border-l-[28px] border-r-[28px] border-t-[22px] border-l-transparent border-r-transparent border-t-[#d8eefb]" />
          <div className="absolute bottom-0 left-0 h-full w-full border-b-[24px] border-l-[28px] border-r-[28px] border-b-white border-l-transparent border-r-transparent" />
        </div>

        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#65c64d]">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m5 12 4 4 10-10" />
          </svg>
        </div>
      </div>

      <span className="absolute left-1 top-1 h-2 w-2 rounded-full bg-white/80" />
      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-white/80" />
      <span className="absolute right-0 top-6 h-2 w-2 rounded-full bg-white/70" />
      <span className="absolute left-0 bottom-4 h-1.5 w-1.5 rounded-full bg-white/70" />
    </div>
  );
}