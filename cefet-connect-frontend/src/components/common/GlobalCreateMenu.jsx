import { useEffect, useRef, useState } from "react";

function PostIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path
        d="M5 5h14v14H5V5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 13h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path
        d="M3.5 20c.8-4 2.8-6 5.5-6s4.7 2 5.5 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 18.5c.7-2.4 2-3.6 3.8-3.6 1.7 0 3 1.2 3.7 3.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <rect
        x="4"
        y="5"
        width="16"
        height="15"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M8 3v4M16 3v4M4 10h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function GlobalCreateMenu({
  onCreatePost,
  onCreateCommunity,
  onCreateEvent,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleAction(callback, fallbackUrl) {
    setIsOpen(false);

    if (callback) {
      callback();
      return;
    }

    window.location.assign(fallbackUrl);
  }

  return (
    <div ref={menuRef} className="relative">
      {isOpen && (
        <div className="absolute bottom-[68px] left-1/2 z-50 w-[210px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-[#e3e3e3] bg-white shadow-xl">
          <button
            type="button"
            onClick={() => handleAction(onCreatePost, "/home?create=post")}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-[#202020] transition hover:bg-[#f1f1f1]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e8f7ef] text-[#089464]">
              <PostIcon />
            </span>
            Novo post
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(onCreateCommunity, "/home?create=community")
            }
            className="flex w-full items-center gap-3 border-t border-[#eeeeee] px-4 py-3 text-left text-sm font-bold text-[#202020] transition hover:bg-[#f1f1f1]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e8f7ef] text-[#089464]">
              <CommunityIcon />
            </span>
            Nova comunidade
          </button>

          <button
            type="button"
            onClick={() => handleAction(onCreateEvent, "/home?create=event")}
            className="flex w-full items-center gap-3 border-t border-[#eeeeee] px-4 py-3 text-left text-sm font-bold text-[#202020] transition hover:bg-[#f1f1f1]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#e8f7ef] text-[#089464]">
              <EventIcon />
            </span>
            Novo evento
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Abrir menu de criação"
        aria-expanded={isOpen}
        className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#089464] text-3xl font-light text-white shadow-lg transition hover:bg-[#067f57]"
      >
        +
      </button>
    </div>
  );
}