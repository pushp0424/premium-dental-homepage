"use client";

import { useState, useTransition } from "react";
import { Receipt, CreditCard, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import { payInvoiceAction } from "@/app/portal/billing/actions";

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  status: string;
  subtotal: number;
  insuranceAdjustment: number;
  total: number;
  dueDate: string;
  createdAt: string;
  serviceName: string | null;
  items: { description: string; amount: number; quantity: number }[];
  payments: { method: string; amount: number; createdAt: string }[];
}

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  PAID: "success",
  SENT: "warning",
  OVERDUE: "danger",
  DRAFT: "neutral",
  VOID: "neutral",
};

export function BillingClient({ invoices: initial }: { invoices: InvoiceItem[] }) {
  const { push } = useToast();
  const [invoices, setInvoices] = useState(initial);
  const [target, setTarget] = useState<InvoiceItem | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const outstanding = invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");
  const totalOutstanding = outstanding.reduce((sum, i) => sum + i.total, 0);

  function handlePay() {
    if (!target) return;
    setError(null);
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Enter expiry as MM/YY.");
      return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
      setError("Enter a valid CVC.");
      return;
    }
    startTransition(async () => {
      const result = await payInvoiceAction(target.id, cardNumber);
      if ("error" in result) {
        setError(result.error);
      } else {
        setInvoices((prev) => prev.map((i) => (i.id === target.id ? { ...i, status: "PAID" } : i)));
        setTarget(null);
        setCardNumber("");
        setExpiry("");
        setCvc("");
        push({ title: "Payment successful", description: `${formatCurrency(target.total)} paid`, tone: "success" });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-brand-700">Outstanding Balance</p>
          <p className="text-2xl font-extrabold text-ink-900">{formatCurrency(totalOutstanding)}</p>
        </div>
        <p className="text-sm text-brand-700">{outstanding.length} invoice{outstanding.length !== 1 ? "s" : ""} due</p>
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="No invoices yet" description="Invoices from your visits will appear here." />
      ) : (
        <div className="rounded-2xl border border-ink-200 bg-white divide-y divide-ink-100">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-ink-900">{inv.invoiceNumber}</p>
                  <p className="text-sm text-ink-500">{inv.serviceName ?? "Services rendered"}</p>
                </div>
                <Badge tone={statusTone[inv.status] ?? "neutral"} dot>
                  {inv.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="text-sm text-ink-500 space-y-0.5">
                  <p>Subtotal: {formatCurrency(inv.subtotal)}</p>
                  {inv.insuranceAdjustment > 0 && <p>Insurance adjustment: -{formatCurrency(inv.insuranceAdjustment)}</p>}
                  <p className="font-bold text-ink-900">Total: {formatCurrency(inv.total)}</p>
                  <p>Due {formatDateShort(inv.dueDate)}</p>
                  {inv.payments.length > 0 && (
                    <p className="flex items-center gap-1 text-success-600 font-medium">
                      <CheckCircle2 className="size-3.5" /> Paid via {inv.payments[0].method}
                    </p>
                  )}
                </div>
                {(inv.status === "SENT" || inv.status === "OVERDUE") && (
                  <Button size="sm" onClick={() => setTarget(inv)}>
                    <CreditCard className="size-4" /> Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!target}
        onClose={() => setTarget(null)}
        title="Pay Invoice"
        description={target ? `${target.invoiceNumber} · ${formatCurrency(target.total)}` : undefined}
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-ink-50 border border-ink-200 p-3 text-xs text-ink-500">
            Demo payment form — no real card is charged. Try{" "}
            <button type="button" className="font-mono font-semibold text-brand-600" onClick={() => setCardNumber("4242 4242 4242 4242")}>
              4242 4242 4242 4242
            </button>
            .
          </div>
          <div>
            <Label htmlFor="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
              maxLength={23}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry">Expiry (MM/YY)</Label>
              <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="12/28" maxLength={5} />
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" inputMode="numeric" maxLength={4} />
            </div>
          </div>
          {error && <FieldError>{error}</FieldError>}
          <Button className="w-full" loading={pending} onClick={handlePay}>
            Pay {target ? formatCurrency(target.total) : ""}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
