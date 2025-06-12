import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./autenticacion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login({ email }); // Guardamos el usuario
    navigate("/"); // Redirigimos al home
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-md"
      >
        <h1 className="text-3xl font-semibold text-center">Iniciar Sesión</h1>

        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
    </div>
  );
};

export default Login;
