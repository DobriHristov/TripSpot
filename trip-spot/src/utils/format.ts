export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatRating = (rating: number) =>
  rating > 0 ? rating.toFixed(1) : "—";

export const pluralize = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

export const truncate = (text: string, max = 120) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
