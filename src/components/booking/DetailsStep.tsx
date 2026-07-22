"use client";

import { CheckCircle2 } from "lucide-react";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { PatientSummary } from "@/lib/types/booking";

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  password: string;
}

export function DetailsStep({
  patient,
  guestInfo,
  onGuestInfoChange,
  reasonNote,
  onReasonNoteChange,
}: {
  patient: PatientSummary | null;
  guestInfo: GuestInfo;
  onGuestInfoChange: (info: GuestInfo) => void;
  reasonNote: string;
  onReasonNoteChange: (note: string) => void;
}) {
  const set = (key: keyof GuestInfo, val: string) => onGuestInfoChange({ ...guestInfo, [key]: val });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900">Your information</h2>
        <p className="text-sm text-ink-500 mt-1">
          {patient ? "We'll use the details on your account." : "Create a quick account so you can manage this booking anytime."}
        </p>
      </div>

      {patient ? (
        <div className="flex items-center gap-3 rounded-2xl border border-success-500/30 bg-success-50 p-4">
          <CheckCircle2 className="size-5 text-success-600 shrink-0" />
          <div>
            <p className="font-semibold text-ink-900">
              {patient.firstName} {patient.lastName}
            </p>
            <p className="text-sm text-ink-500">{patient.email}</p>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" value={guestInfo.firstName} onChange={(e) => set("firstName", e.target.value)} autoComplete="given-name" required />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" value={guestInfo.lastName} onChange={(e) => set("lastName", e.target.value)} autoComplete="family-name" required />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={guestInfo.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" value={guestInfo.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="(512) 555-0100" required />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" type="date" value={guestInfo.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} autoComplete="bday" required />
          </div>
          <div>
            <Label htmlFor="password">Create a password</Label>
            <Input id="password" type="password" value={guestInfo.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" minLength={8} required />
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="reasonNote">Anything we should know? (optional)</Label>
        <Textarea
          id="reasonNote"
          value={reasonNote}
          onChange={(e) => onReasonNoteChange(e.target.value)}
          placeholder="e.g. sensitivity on the lower left side, first visit, insurance questions…"
          maxLength={500}
        />
      </div>
    </div>
  );
}
