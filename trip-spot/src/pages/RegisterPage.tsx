import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormAlert, FormField } from "../components/common/FormField";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import { validateRegister } from "../utils/validators";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const form = useForm(
    { username: "", email: "", password: "", rePassword: "" },
    validateRegister,
    async ({ username, email, password }) => {
      await register({ username, email, password });
      toast.success("Профилът е създаден!");
      navigate("/places", { replace: true });
    },
  );

  const f = (name: "username" | "email" | "password" | "rePassword") => ({
    id: name,
    name,
    value: form.values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  });

  return (
    <>
      <h1 className="text-3xl">Регистрация</h1>

      <form onSubmit={form.handleSubmit} noValidate className="mt-6 space-y-4">
        <FormAlert message={form.submitError} />

        <FormField
          id="username"
          label="Потребителско име"
          error={form.errors.username}
        >
          <Input {...f("username")} />
        </FormField>

        <FormField id="email" label="Имейл" error={form.errors.email}>
          <Input type="email" autoComplete="email" {...f("email")} />
        </FormField>

        <FormField id="password" label="Парола" error={form.errors.password}>
          <Input
            type="password"
            autoComplete="new-password"
            {...f("password")}
          />
        </FormField>

        <FormField
          id="rePassword"
          label="Повтори паролата"
          error={form.errors.rePassword}
        >
          <Input
            type="password"
            autoComplete="new-password"
            {...f("rePassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={form.isSubmitting}>
          {form.isSubmitting ? "Създаване…" : "Създай профил"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        Имаш профил?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Влез
        </Link>
      </p>
    </>
  );
}
