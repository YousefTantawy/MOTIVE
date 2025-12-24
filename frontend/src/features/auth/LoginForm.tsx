import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button>{isLoading ? "Logging in..." : "Login"}</Button>
    </form>
  );
};
