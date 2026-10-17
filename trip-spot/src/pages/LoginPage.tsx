import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FormAlert, FormField } from "../components/common/FormField";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import type { LoginDto } from "../types";
import { safeRedirect } from "../utils/permissions";
import { validateLogin } from "../utils/validators";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<LoginDto>(
    { email: "", password: "" },
    validateLogin,
    async (values) => {
      await login(values);
      toast.success("Добре дошъл отново!");
      navigate(safeRedirect(redirect), { replace: true });
    },
  );

  return (
    <>
      <h1 className="text-3xl">Вход</h1>

      {/* TODO */}
      <p className="mt-1 text-sm text-muted-foreground">
        Демо: demo@tripspot.bg / demo123
      </p>

      <form onSubmit={form.handleSubmit} noValidate className="mt-6 space-y-4">
        <FormAlert message={form.submitError} />

        <FormField id="email" label="Имейл" error={form.errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <FormField id="password" label="Парола" error={form.errors.password}>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Влизане…" : "Влез"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        Нямаш профил?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Регистрирай се
        </Link>
      </p>
    </>
  );
}
