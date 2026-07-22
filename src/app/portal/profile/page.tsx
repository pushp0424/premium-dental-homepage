import { getSession } from "@/lib/auth";
import { getPatientById } from "@/lib/queries/patient";
import { ProfileForm } from "@/components/portal/ProfileForm";
import { formatDateShort } from "@/lib/utils";

export const metadata = { title: "Profile" };

export default async function PortalProfilePage() {
  const session = await getSession();
  const patient = await getPatientById(session!.patientId!);
  if (!patient) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Profile</h1>
        <p className="text-ink-500 mt-1">Keep your information up to date.</p>
      </div>
      <ProfileForm
        patient={{
          firstName: patient.firstName,
          lastName: patient.lastName,
          email: patient.user.email,
          phone: patient.phone,
          dateOfBirth: formatDateShort(patient.dateOfBirth),
          addressLine: patient.addressLine,
          city: patient.city,
          state: patient.state,
          zip: patient.zip,
          insuranceProvider: patient.insuranceProvider,
          insuranceMemberId: patient.insuranceMemberId,
          emergencyContactName: patient.emergencyContactName,
          emergencyContactPhone: patient.emergencyContactPhone,
        }}
      />
    </div>
  );
}
