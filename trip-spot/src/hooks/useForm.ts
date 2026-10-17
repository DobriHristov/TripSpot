import {
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";
import { getErrorMessage } from "../utils/errors";
import { hasErrors, type FormErrors } from "../utils/validators";

type FieldElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export function useForm<T extends object>(
  initialValues: T,
  validate: (values: T) => FormErrors<T>,
  onSubmit: (values: T) => Promise<void> | void,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const errors = validate(values);
  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([k]) => touched[k as keyof T]),
  ) as FormErrors<T>;

  const handleChange = (e: ChangeEvent<FieldElement>) => {
    const { name, value, type } = e.target;
    setValues((v) => ({
      ...v,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleBlur = (e: FocusEvent<FieldElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const setField = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((v) => ({ ...v, [name]: value }));
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(
      Object.fromEntries(Object.keys(values).map((k) => [k, true])) as Partial<
        Record<keyof T, boolean>
      >,
    );
    if (hasErrors(errors)) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = (next: T = initialValues) => {
    setValues(next);
    setTouched({});
    setSubmitError(null);
  };

  return {
    values,
    errors: visibleErrors,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    setField,
    reset,
    setValues,
  };
}
