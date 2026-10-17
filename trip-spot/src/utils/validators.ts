import type { LoginDto, RegisterDto } from "../types";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (v: string) => EMAIL_RE.test(v.trim());

export function validateLogin(v: LoginDto): FormErrors<LoginDto> {
  const e: FormErrors<LoginDto> = {};

  if (!isEmail(v.email)) {
    e.email = "Въведи валиден имейл.";
  }

  if (v.password.length < 6) {
    e.password = "Паролата е поне 6 символа.";
  }

  return e;
}

export function validateRegister(v: RegisterDto & { rePassword: string }) {
  const e: FormErrors<RegisterDto & { rePassword: string }> = {
    ...validateLogin(v),
  };
  const name = v.username.trim();

  if (name.length < 3 || name.length > 20) {
    e.username = "Потребителското име е между 3 и 20 символа.";
  }

  if (v.rePassword !== v.password) {
    e.rePassword = "Паролите не съвпадат.";
  }
  return e;
}

export const hasErrors = (errors: object) =>
  Object.values(errors).some(Boolean);
