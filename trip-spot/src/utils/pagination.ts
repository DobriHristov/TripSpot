export const PAGE_SIZE = 6;

export function getPageNumbers(
  page: number,
  totalPages: number,
): (number | "…")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const sorted = [...pages]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];

  sorted.forEach((n, i) => {
    if (i > 0 && n - sorted[i - 1]! > 1) {
      out.push("…");
    }

    out.push(n);
  });

  return out;
}
