import RankingCard from "./RankingCard";

export default function RankingModal({
  isOpen,
  ranking = [],
  isLoading = false,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-6">
      <div className="w-full max-w-[460px] rounded-[18px] bg-[#f1f1f1] p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-[#202020]">
            Ranking completo
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-bold text-[#343434] shadow-sm transition hover:bg-[#e8e8e8]"
            aria-label="Fechar ranking"
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-[8px] bg-white p-5 text-sm text-[#777]">
            Carregando ranking...
          </div>
        ) : (
          <RankingCard ranking={ranking} variant="full" />
        )}
      </div>
    </div>
  );
}