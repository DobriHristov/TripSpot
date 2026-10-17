import type { Category } from "../types";

export const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: "mountain", label: "Планини", emoji: "⛰️" },
  { value: "beach", label: "Плажове", emoji: "🏖️" },
  { value: "city", label: "Градове", emoji: "🏙️" },
  { value: "lake", label: "Езера", emoji: "💧" },
  { value: "nature", label: "Природа", emoji: "🌲" },
  { value: "historic", label: "История", emoji: "🏛️" },
];

export const categoryLabel = (value: string) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value;

export const isCategory = (value: unknown): value is Category =>
  CATEGORIES.some((c) => c.value === value);
