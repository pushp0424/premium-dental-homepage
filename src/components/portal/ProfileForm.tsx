"use client";

import { useActionState, useEffect } from "react";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateProfileAction, type ProfileState } from "@/app/portal/profile/actions";

export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  insuranceProvider: string | null;
  insuranceMemberId: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}

export function ProfileForm({ patient }: { patient: ProfileData }) {
  const { push } = useToast();
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(updateProfileAction, undefined);

  useEffect(() => {
    if (state?.success) push({ title: "Profile updated", tone: "success" });
  }, [state, push]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Personal Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" name="firstName" defaultValue={patient.firstName} required />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" name="lastName" defaultValue={patient.lastName} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={patient.email} disabled />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={patient.phone} required />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" value={patient.dateOfBirth} disabled />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Address</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Label htmlFor="addressLine">Street address</Label>
            <Input id="addressLine" name="addressLine" defaultValue={patient.addressLine ?? ""} />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={patient.city ?? ""} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" defaultValue={patient.state ?? ""} />
            </div>
            <div>
              <Label htmlFor="zip">ZIP</Label>
              <Input id="zip" name="zip" defaultValue={patient.zip ?? ""} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Insurance</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="insuranceProvider">Provider</Label>
            <Input id="insuranceProvider" name="insuranceProvider" defaultValue={patient.insuranceProvider ?? ""} />
          </div>
          <div>
            <Label htmlFor="insuranceMemberId">Member ID</Label>
            <Input id="insuranceMemberId" name="insuranceMemberId" defaultValue={patient.insuranceMemberId ?? ""} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-bold text-ink-900 mb-4">Emergency Contact</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyContactName">Name</Label>
            <Input id="emergencyContactName" name="emergencyContactName" defaultValue={patient.emergencyContactName ?? ""} />
          </div>
          <div>
            <Label htmlFor="emergencyContactPhone">Phone</Label>
            <Input id="emergencyContactPhone" name="emergencyContactPhone" defaultValue={patient.emergencyContactPhone ?? ""} />
          </div>
        </div>
      </section>

      {state?.error && <FieldError>{state.error}</FieldError>}
      <Button type="submit" size="lg" loading={pending}>
        Save Changes
      </Button>
    </form>
  );
}
