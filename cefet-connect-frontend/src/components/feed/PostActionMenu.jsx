import { useEffect, useRef, useState } from "react";

export default function PostActionMenu({ onEdit, onDelete }) {
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

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold text-[#555] transition hover:bg-[#f1f1f1]"
        aria-label="Abrir opções do post"
      >
        ⋯
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 z-40 w-40 overflow-hidden rounded-2xl border border-[#e3e3e3] bg-white py-2 shadow-lg">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-[#343434] transition hover:bg-[#f7f7f7]"
          >
            <span>✏️</span>
            Editar
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <span>🗑️</span>
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}