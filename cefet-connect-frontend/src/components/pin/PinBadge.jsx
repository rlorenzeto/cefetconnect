const CATEGORY_STYLES = {
  disciplina: "border-[#7bfae7] bg-[#ecfffb] text-[#0f766e]",
  ic: "border-[#93c5fd] bg-[#eff6ff] text-[#2563eb]",
  projeto: "border-[#c4b5fd] bg-[#f5f3ff] text-[#7c3aed]",
  monitoria: "border-[#fcd34d] bg-[#fffbeb] text-[#b45309]",
  evento: "border-[#fda4af] bg-[#fff1f2] text-[#e11d48]",
  experiencia: "border-[#67e8f9] bg-[#ecfeff] text-[#0891b2]",
  outro: "border-[#d8d8d8] bg-[#f1f1f1] text-[#555]",
};

function normalizeText(value = "") {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isDisciplinePin(pin) {
  const name = normalizeText(pin?.nomePin);

  return (
    name.includes("calculo") ||
    name.includes("programacao") ||
    name.includes("banco de dados") ||
    name.includes("estrutura de dados") ||
    name.includes("praticas profissionais") ||
    name.includes("sistemas") ||
    name.includes("disciplina")
  );
}

function inferPinCategory(pin) {
  const categoria = normalizeText(pin?.categoriaPin);
  const name = normalizeText(pin?.nomePin);

  if (categoria === "disciplina") return "disciplina";
  if (categoria === "ic") return "ic";
  if (categoria === "projeto") return "projeto";
  if (categoria === "monitoria") return "monitoria";
  if (categoria === "evento") return "evento";
  if (categoria === "experiencia") return "experiencia";
  if (categoria === "outro") return "outro";

  if (isDisciplinePin(pin)) return "disciplina";

  if (
    name.includes("ic") ||
    name.includes("iniciacao cientifica") ||
    name.includes("pesquisa")
  ) {
    return "ic";
  }

  if (
    name.includes("projeto") ||
    name.includes("extensao") ||
    name.includes("desenvolvimento")
  ) {
    return "projeto";
  }

  if (name.includes("monitoria") || name.includes("monitor")) {
    return "monitoria";
  }

  if (
    name.includes("evento") ||
    name.includes("semana") ||
    name.includes("palestra") ||
    name.includes("workshop")
  ) {
    return "evento";
  }

  if (
    name.includes("estagio") ||
    name.includes("experiencia") ||
    name.includes("empresa")
  ) {
    return "experiencia";
  }

  return "outro";
}

function getCategoryStyle(pin) {
  const category = inferPinCategory(pin);
  return CATEGORY_STYLES[category] || CATEGORY_STYLES.outro;
}

export default function PinBadge({
  pin,
  onClick,
  onRemove,
  canRemove = false,
  compact = false,
}) {
  const categoryStyle = getCategoryStyle(pin);

  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1">
      <button
        type="button"
        onClick={() => onClick?.(pin)}
        className={`inline-flex min-w-0 max-w-full items-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[11px] font-extrabold transition hover:scale-[1.02] ${categoryStyle} ${
          compact ? "max-w-[105px]" : "max-w-[240px]"
        }`}
        title={pin?.nomePin}
      >
        <span className="min-w-0 max-w-full truncate">
          {pin?.nomePin}
        </span>
      </button>

      {canRemove && (
        <button
          type="button"
          onClick={() => onRemove?.(pin)}
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500 transition hover:bg-red-100"
          aria-label={`Remover pin ${pin?.nomePin}`}
          title="Remover pin"
        >
          ×
        </button>
      )}
    </span>
  );
}