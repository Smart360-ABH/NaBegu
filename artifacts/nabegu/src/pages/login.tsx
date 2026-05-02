import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isConfigured } from "@/lib/auth-api";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      setLocation("/profile");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка входа";
      if (msg === "not_configured") {
        setError("Back4App не настроен. Добавьте ключи в переменные окружения.");
      } else if (msg.toLowerCase().includes("invalid")) {
        setError("Неверный логин или пароль.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border rounded-3xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Вход</h1>
            <p className="text-muted-foreground">Войдите в свой аккаунт НаБегу</p>
          </div>

          {!isConfigured && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-6 text-sm">
              Back4App не настроен. Войти можно после добавления ключей API.
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <Label htmlFor="login-username">Логин или email</Label>
              <Input
                id="login-username"
                placeholder="your_login"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-xl h-12"
                data-testid="input-login-username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-12"
                data-testid="input-login-password"
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
              data-testid="button-login-submit"
            >
              {loading ? "Входим..." : "Войти"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
