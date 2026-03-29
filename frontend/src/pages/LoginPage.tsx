import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getErrorMessage } from "../lib/errors";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("user@primetrade.ai");
  const [password, setPassword] = useState("User@1234");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
      navigate("/");
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Login failed"));
    }
  };

  return (
    <section className="auth-card">
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          required
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign in</button>
      </form>
      {error && <p className="error">{error}</p>}
      <p>
        New user? <a href="/register">Register</a>
      </p>
    </section>
  );
};

export default LoginPage;
