"use client";

import { AuthLayoutWrapper } from "@/components/auth/auth-layout-wrapper";
import { LoginForm } from "@/components/auth/login-form";
import { AUTH_TEXT } from "@/lib/constants/auth-text";

export default function LoginPage() {
  return (
    <AuthLayoutWrapper
      title={AUTH_TEXT.login.title}
      description={AUTH_TEXT.login.description}
    >
      <LoginForm />
    </AuthLayoutWrapper>
  );
}
