import { getSession } from "@/lib/auth";
import { getPatientInvoices } from "@/lib/queries/patient";
import { BillingClient } from "@/components/portal/BillingClient";

export const metadata = { title: "Billing" };

export default async function PortalBillingPage() {
  const session = await getSession();
  const invoices = await getPatientInvoices(session!.patientId!);

  const serialized = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    status: inv.status,
    subtotal: inv.subtotal,
    insuranceAdjustment: inv.insuranceAdjustment,
    total: inv.total,
    dueDate: inv.dueDate.toISOString(),
    createdAt: inv.createdAt.toISOString(),
    serviceName: inv.appointment?.service.name ?? null,
    items: inv.items.map((it) => ({ description: it.description, amount: it.amount, quantity: it.quantity })),
    payments: inv.payments.map((p) => ({ method: p.method, amount: p.amount, createdAt: p.createdAt.toISOString() })),
  }));

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Billing</h1>
        <p className="text-ink-500 mt-1">Review invoices and make payments.</p>
      </div>
      <BillingClient invoices={serialized} />
    </div>
  );
}
