import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "../services/auth";

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/connections");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="p-8 w-full max-w-md bg-surface-container-low rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-on-surface font-grotesk mb-6">
          Criar Conta
        </h1>
        {error && (
          <div
            className="bg-error-container text-on-error-container p-3 rounded-md mb-4"
            role="alert"
          >
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            required
            className="w-full px-4 py-2 border border-border-subtle rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full px-4 py-2 border border-border-subtle rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirmar senha"
            required
            className="w-full px-4 py-2 border border-border-subtle rounded-md bg-surface text-on-surface placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary-container font-bold py-2 px-4 rounded-md hover:bg-primary-container-hover disabled:bg-surface-disabled disabled:text-on-surface-disabled"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-on-surface-variant">
          Já tem conta?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-semibold"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
};
