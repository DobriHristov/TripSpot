import type { User } from "../types";

export const safeRedirect = (target: unknown, fallback = "/places") =>
  typeof target === "string" &&
  target.startsWith("/") &&
  !target.startsWith("//")
    ? target
    : fallback;

export const isOwner = (
  user: User | null | undefined,
  record: { authorId: string } | null | undefined,
) => !!user && !!record && user.id === record.authorId;
