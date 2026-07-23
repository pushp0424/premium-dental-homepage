import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Log In" };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2.5 mb-10">
            <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-base">
              M
            </div>
            <span className="text-lg font-extrabold tracking-tight text-ink-900">Meridian Dental</span>
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Welcome back</h1>
          <p className="mt-2 text-[15px] text-ink-500">Log in to manage your appointments, records, and billing.</p>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-ink-500 text-balance">
            New to Meridian Dental?{" "}
            <Link href="/register" className="font-semibold text-nowrap text-brand-600 hover:text-brand-700">
              Create a patient account
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 items-center justify-center bg-linear-to-br from-brand-600 via-brand-700 to-ink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] [background-size:32px_32px]" />
        <div className="relative z-10 max-w-md px-10 text-center text-white">
          <div className="flex justify-center gap-1 text-warning-500 text-xl mb-4">★★★★★</div>
          <p className="text-2xl font-semibold leading-snug">
            &ldquo;Booking online took thirty seconds and the reminder texts meant I never missed a
            cleaning again.&rdquo;
          </p>
          <p className="mt-4 text-sm text-brand-100 font-medium">Jordan M. — Meridian Dental patient since 2021</p>
        </div>
      </div>
    </div>
  );
}
