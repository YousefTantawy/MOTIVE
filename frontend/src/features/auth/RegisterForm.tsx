import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    await onSubmit(name, email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <Input
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button>{isLoading ? "Registering..." : "Register"}</Button>
    </form>
  );
};
