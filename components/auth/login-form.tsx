"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { login } from "@/action/login/login";
import { loginSchema } from "@/lib/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AUTH_TEXT } from "@/lib/constants/auth-text";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async (values) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("username", values.value.username);
      formData.append("password", values.value.password);
      
      try {
        const result = await login(formData);
        
        if (result && result.success) {
          toast.success(result.message);
          router.push("/dashboard");
        } else {
          toast.error(result?.message || "Đăng nhập thất bại");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra trong quá trình đăng nhập");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="username">
            {(field) => (
              <Field className="space-y-2">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.login.usernameLabel}
                </FieldLabel>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.login.usernamePlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="password">
            {(field) => (
              <Field className="space-y-2">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.login.passwordLabel}
                </FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    type="password"
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.login.passwordPlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-[0.98]"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              {AUTH_TEXT.login.submitButton}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
