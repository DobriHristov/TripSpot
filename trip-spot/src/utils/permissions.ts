export const safeRedirect = (target: unknown, fallback = "/places") =>
  typeof target === "string" &&
  target.startsWith("/") &&
  !target.startsWith("//")
    ? target
    : fallback;
