"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
import { register } from "@/action/register/register";
import { registerSchema } from "@/lib/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { AUTH_TEXT } from "@/lib/constants/auth-text";
import { User, Mail, Lock, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";

export function RegisterForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("username", values.value.username);
      formData.append("name", values.value.name);
      formData.append("email", values.value.email);
      formData.append("password", values.value.password);
      formData.append("confirmPassword", values.value.confirmPassword);
      register(formData);
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
        <FieldGroup className="grid gap-4 sm:grid-cols-2">
          {/* Username - Full width on mobile/single col if needed, but let's try 2 cols */}
          <form.Field name="username">
            {(field) => (
              <Field className="space-y-2 sm:col-span-1">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.register.usernameLabel}
                </FieldLabel>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.register.usernamePlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          {/* Name */}
          <form.Field name="name">
            {(field) => (
              <Field className="space-y-2 sm:col-span-1">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.register.nameLabel}
                </FieldLabel>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.register.namePlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <Field className="space-y-2 sm:col-span-2">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.register.emailLabel}
                </FieldLabel>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.register.emailPlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <Field className="space-y-2">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.register.passwordLabel}
                </FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.register.passwordPlaceholder}
                    className="pl-10 h-11 border-muted-foreground/20 bg-muted/30 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {field.state.meta.errors && (
                  <FieldError errors={field.state.meta.errors} />
                )}
              </Field>
            )}
          </form.Field>

          {/* Confirm Password */}
          <form.Field name="confirmPassword">
            {(field) => (
              <Field className="space-y-2">
                <FieldLabel htmlFor={field.name} className="text-sm font-medium">
                  {AUTH_TEXT.register.confirmPasswordLabel}
                </FieldLabel>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id={field.name}
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.setValue(e.target.value)}
                    placeholder={AUTH_TEXT.register.confirmPasswordPlaceholder}
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
          className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-[0.98] mt-2"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {AUTH_TEXT.register.submitButton}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        {AUTH_TEXT.register.alreadyHaveAccount}{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          {AUTH_TEXT.register.loginLink}
        </Link>
      </div>
    </div>
  );
}
