import hero from "../assets/hero.jpg";
import beach from "../assets/beach.jpg";
import oldtown from "../assets/oldtown.jpg";
import lake from "../assets/lake.jpg";
import monastery from "../assets/monastery.jpg";
import waterfall from "../assets/waterfall.jpg";
import rocks from "../assets/rocks.jpg";
import seatown from "../assets/seatown.jpg";

const SEED_IMAGES: Record<string, string> = {
  hero,
  beach,
  oldtown,
  lake,
  monastery,
  waterfall,
  rocks,
  seatown,
};

export const FALLBACK_IMAGE = hero;

export const resolveImage = (url: string) => {
  if (url.startsWith("seed:"))
    return SEED_IMAGES[url.slice(5)] ?? FALLBACK_IMAGE;
  return url || FALLBACK_IMAGE;
};

export const placeImages = (p: {
  imageUrl: string;
  images?: string[] | undefined;
}): string[] => {
  const list = p.images?.length ? p.images : p.imageUrl ? [p.imageUrl] : [];
  return list.length ? list.map(resolveImage) : [FALLBACK_IMAGE];
};
