import Link from "next/link";
import { getBillingOverview } from "@/lib/queries/admin";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Receipt, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { formatCurrency, formatDateShort } from "@/lib/utils";

export const metadata = { title: "Billing" };
export const dynamic = "force-dynamic";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  PAID: "success",
  SENT: "warning",
  OVERDUE: "danger",
  DRAFT: "neutral",
  VOID: "neutral",
};

export default async function AdminBillingPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const params = await searchParams;
  const { invoices, totals } = await getBillingOverview(params.status);

  const paidTotal = totals.find((t) => t.status === "PAID")?._sum.total ?? 0;
  const sentTotal = totals.find((t) => t.status === "SENT")?._sum.total ?? 0;
  const overdueTotal = totals.find((t) => t.status === "OVERDUE")?._sum.total ?? 0;
  const overdueCount = totals.find((t) => t.status === "OVERDUE")?._count.status ?? 0;

  const statusFilters = ["", "SENT", "OVERDUE", "PAID"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Billing</h1>
        <p className="text-ink-500 mt-1">Invoices and payments across the whole practice.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Collected" value={formatCurrency(paidTotal)} icon={CheckCircle2} tone="success" />
        <StatCard label="Awaiting Payment" value={formatCurrency(sentTotal)} icon={Clock} tone="warning" />
        <StatCard label="Overdue" value={formatCurrency(overdueTotal)} icon={AlertTriangle} tone="warning" />
        <StatCard label="Overdue Invoices" value={String(overdueCount)} icon={Receipt} tone="brand" />
      </div>

      <div className="flex gap-2">
        {statusFilters.map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/billing?status=${s}` : "/admin/billing"}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              (params.status ?? "") === s ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Invoice</Th>
            <Th>Patient</Th>
            <Th>Service</Th>
            <Th>Total</Th>
            <Th>Due Date</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {invoices.map((inv) => (
            <Tr key={inv.id}>
              <Td className="font-mono text-xs">{inv.invoiceNumber}</Td>
              <Td>
                <Link href={`/admin/patients/${inv.patientId}`} className="font-semibold text-ink-900 hover:text-brand-600">
                  {inv.patient.firstName} {inv.patient.lastName}
                </Link>
              </Td>
              <Td>{inv.appointment?.service.name ?? "—"}</Td>
              <Td className="font-semibold">{formatCurrency(inv.total)}</Td>
              <Td>{formatDateShort(inv.dueDate)}</Td>
              <Td>
                <Badge tone={statusTone[inv.status] ?? "neutral"} dot>
                  {inv.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}
