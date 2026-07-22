import { Suspense } from "react";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";

export const metadata = { title: "Create an Account" };

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-ink-50">
      <div className="w-full max-w-md rounded-3xl border border-ink-200 bg-white p-8 shadow-card">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="flex size-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-700 text-white font-extrabold text-base">
            M
          </div>
          <span className="text-lg font-extrabold tracking-tight text-ink-900">Meridian Dental</span>
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Create your patient account</h1>
        <p className="mt-2 text-[15px] text-ink-500">
          Takes about a minute. You&apos;ll be able to book appointments and manage everything from your portal.
        </p>
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
