import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // compatible con handleChange(event)
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  disabled?: boolean;
};

export function SecurePasswordField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required,
  autoComplete = "new-password",
  className,
  disabled,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`pr-10 ${className || ''}`}
          disabled={disabled}
        />
        <button
          type="button"
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
          disabled={disabled}
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}