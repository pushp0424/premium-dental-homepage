"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Stethoscope, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { loginAction, quickLoginPatientAction, quickLoginAdminAction, type LoginState } from "./actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, undefined);

  return (
    <div className="mt-8 space-y-6">
      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required />
        </div>
        {state?.error && <FieldError>{state.error}</FieldError>}
        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Log In
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-ink-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-ink-400 font-medium uppercase tracking-wide">Or try the demo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        <form action={quickLoginPatientAction}>
          <Button type="submit" variant="outline" size="md" className="w-full justify-start">
            <UserRound className="size-4.5 shrink-0 text-brand-600" />
            <span className="shrink-0">Continue as demo patient</span>
            <span className="ml-auto min-w-0 truncate text-xs font-normal text-ink-400">sarah.patient@demo.com</span>
          </Button>
        </form>
        <form action={quickLoginAdminAction}>
          <Button type="submit" variant="outline" size="md" className="w-full justify-start">
            <Stethoscope className="size-4.5 shrink-0 text-brand-600" />
            <span className="shrink-0">Continue as demo admin</span>
            <span className="ml-auto min-w-0 truncate text-xs font-normal text-ink-400">admin@meridiandental.com</span>
          </Button>
        </form>
      </div>
      <p className="text-center text-xs text-ink-400">Demo password for both accounts: Demo1234!</p>
    </div>
  );
}
