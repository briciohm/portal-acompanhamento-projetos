export function normalizeProjectPrefix(value: string | null | undefined) {
  const normalized = (value ?? "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return normalized || "PROJ";
}

export function formatProjectCode(prefix: string, sequence: number) {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 99999) {
    throw new Error("A sequência do projeto deve estar entre 1 e 99999.");
  }
  return `${normalizeProjectPrefix(prefix)}-${String(sequence).padStart(5, "0")}`;
}

export function nextProjectCode(prefix: string, existingCodes: string[]) {
  const normalizedPrefix = normalizeProjectPrefix(prefix);
  const pattern = new RegExp(`^${normalizedPrefix}-(\\d{5})$`, "i");
  const highest = existingCodes.reduce((max, code) => {
    const match = pattern.exec(code.trim());
    const sequence = match ? Number(match[1]) : 0;
    return Number.isSafeInteger(sequence) ? Math.max(max, sequence) : max;
  }, 0);
  return formatProjectCode(normalizedPrefix, highest + 1);
}
