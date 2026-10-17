import type { LoginDto, PlaceDto, RegisterDto, ReviewDto } from "../types";
import { isCategory } from "./constants";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^(https?:\/\/\S+|seed:\w+)$/i;

export const isEmail = (v: string) => EMAIL_RE.test(v.trim());

export const hasErrors = (errors: object) =>
  Object.values(errors).some(Boolean);

export const isImageUrl = (v: string) => URL_RE.test(v.trim());

export function validateLogin(v: LoginDto): FormErrors<LoginDto> {
  const e: FormErrors<LoginDto> = {};

  if (!isEmail(v.email)) {
    e.email = "Моля, въведете валиден имейл адрес.";
  }

  if (v.password.length < 6) {
    e.password = "Моля, въведете парола с поне 6 символа.";
  }

  return e;
}

export function validateRegister(v: RegisterDto & { rePassword: string }) {
  const e: FormErrors<RegisterDto & { rePassword: string }> = {
    ...validateLogin(v),
  };
  const name = v.username.trim();

  if (name.length < 3 || name.length > 20) {
    e.username = "Моля, въведете потребителско име между 3 и 20 символа.";
  }

  if (v.rePassword !== v.password) {
    e.rePassword = "Моля, уверете се, че двете пароли съвпадат.";
  }

  return e;
}

export function validatePlace(v: PlaceDto): FormErrors<PlaceDto> {
  const e: FormErrors<PlaceDto> = {};

  const title = v.title.trim();
  const location = v.location.trim();
  const description = v.description.trim();

  if (title.length < 3 || title.length > 60) {
    e.title = "Моля, въведете заглавие между 3 и 60 символа.";
  }

  if (location.length < 2) {
    e.location = "Моля, посочете местоположение.";
  }

  if (!isCategory(v.category)) {
    e.category = "Моля, изберете категория.";
  }

  if (description.length < 20) {
    e.description = "Моля, въведете описание с поне 20 символа.";
  }

  if (v.description.length > 1500) {
    e.description = "Моля, ограничете описанието до 1500 символа.";
  }

  if (!Number.isFinite(v.lat) || v.lat < -90 || v.lat > 90) {
    e.lat = "Моля, въведете географска ширина между -90 и 90.";
  }

  if (!Number.isFinite(v.lng) || v.lng < -180 || v.lng > 180) {
    e.lng = "Моля, въведете географска дължина между -180 и 180.";
  }

  const images = v.images?.length ? v.images : v.imageUrl ? [v.imageUrl] : [];

  if (images.length === 0) {
    e.images = "Моля, добавете поне една снимка чрез линк или качване.";
  } else if (images.length > 10) {
    e.images = "Моля, добавете не повече от 10 снимки.";
  } else if (images.some((url) => !URL_RE.test(url.trim()))) {
    e.images =
      "Моля, проверете линковете към снимките. Използвайте валиден HTTP или HTTPS адрес.";
  }

  return e;
}

export function validateReview(v: ReviewDto): FormErrors<ReviewDto> {
  const e: FormErrors<ReviewDto> = {};

  if (!Number.isInteger(v.rating) || v.rating < 1 || v.rating > 5) {
    e.rating = "Моля, изберете оценка от 1 до 5.";
  }

  if (v.text.trim().length < 5) {
    e.text = "Моля, въведете отзив с поне 5 символа.";
  }

  if (v.text.length > 500) {
    e.text = "Моля, ограничете отзива до 500 символа.";
  }

  return e;
}
