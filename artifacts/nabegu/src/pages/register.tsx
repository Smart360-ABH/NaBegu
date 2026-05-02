import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isConfigured } from "@/lib/auth-api";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirm) {
      setError("Пароли не совпадают.");
      return;
    }
    if (form.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.password, form.email, form.phone || undefined);
      setLocation("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка регистрации";
      if (msg === "not_configured") {
        setError("Back4App не настроен. Добавьте ключи в переменные окружения.");
      } else if (msg.toLowerCase().includes("already taken")) {
        setError("Этот логин уже занят. Выберите другой.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Регистрация</h1>
            <p className="text-muted-foreground">Создайте аккаунт и отслеживайте заказы</p>
          </div>

          {!isConfigured && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 text-sm">
              Back4App не настроен. Регистрация будет доступна после добавления ключей API.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="reg-username">Логин</Label>
              <Input
                id="reg-username"
                placeholder="your_login"
                value={form.username}
                onChange={set("username")}
                required
                className="rounded-xl h-12"
                data-testid="input-reg-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set("email")}
                required
                className="rounded-xl h-12"
                data-testid="input-reg-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone">Телефон (необязательно)</Label>
              <Input
                id="reg-phone"
                type="tel"
                placeholder="+7 (XXX) XXX-XX-XX"
                value={form.phone}
                onChange={set("phone")}
                className="rounded-xl h-12"
                data-testid="input-reg-phone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-password">Пароль</Label>
              <Input
                id="reg-password"
                type="password"
                placeholder="Минимум 6 символов"
                value={form.password}
                onChange={set("password")}
                required
                className="rounded-xl h-12"
                data-testid="input-reg-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm">Повторите пароль</Label>
              <Input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set("confirm")}
                required
                className="rounded-xl h-12"
                data-testid="input-reg-confirm"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-full text-base mt-2"
              disabled={loading}
              data-testid="button-reg-submit"
            >
              {loading ? "Создаём аккаунт..." : "Зарегистрироваться"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
