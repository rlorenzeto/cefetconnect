export function normalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function itemMatchesSearch(item, searchTerm, getFields) {
  const normalizedTerm = normalizeSearchText(searchTerm);

  if (!normalizedTerm) return true;

  const fields = getFields(item);

  return fields.some((field) =>
    normalizeSearchText(field).includes(normalizedTerm)
  );
}