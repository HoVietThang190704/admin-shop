import React from "react";
import { cn } from "@/lib/utils";

interface AuthLayoutWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthLayoutWrapper({
  children,
  title,
  description,
  className,
}: AuthLayoutWrapperProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4 md:p-8">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 h-[80vh] w-[80vw] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[80vh] w-[80vw] rounded-full bg-secondary/10 blur-[120px]" />
      </div>

      <div className={cn("w-full max-w-md space-y-6", className)}>
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="relative rounded-2xl border bg-card p-4 shadow-xl shadow-foreground/5 backdrop-blur-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
