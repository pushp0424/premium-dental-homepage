import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getPatientsForAdmin } from "@/lib/queries/admin";
import { Table, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { formatDateShort } from "@/lib/utils";

export const metadata = { title: "Patients" };
export const dynamic = "force-dynamic";

export default async function AdminPatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q ?? "";
  const page = Number(params.page ?? "1") || 1;

  const { patients, total, pageSize } = await getPatientsForAdmin(q, page);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Patients</h1>
          <p className="text-ink-500 mt-1">{total} patients on file.</p>
        </div>
        <form action="/admin/patients" method="GET" className="flex gap-2">
          <Input name="q" defaultValue={q} placeholder="Search by name or email…" className="w-64" />
          <Button type="submit" variant="outline">
            <Search className="size-4" />
          </Button>
        </form>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Patient</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Insurance</Th>
            <Th>Visits</Th>
            <Th>Patient Since</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.map((p) => (
            <Tr key={p.id}>
              <Td>
                <Link href={`/admin/patients/${p.id}`} className="flex items-center gap-2.5 hover:text-brand-600">
                  <Avatar firstName={p.firstName} lastName={p.lastName} color={p.avatarColor} size="sm" />
                  <span className="font-semibold text-ink-900">
                    {p.firstName} {p.lastName}
                  </span>
                </Link>
              </Td>
              <Td>{p.user.email}</Td>
              <Td>{p.phone}</Td>
              <Td>{p.insuranceProvider ?? "—"}</Td>
              <Td>{p._count.appointments}</Td>
              <Td>{formatDateShort(p.createdAt)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Link href={`/admin/patients?q=${q}&page=${Math.max(1, page - 1)}`}>
            <Button variant="outline" size="sm" disabled={page <= 1}>
              <ChevronLeft className="size-4" /> Prev
            </Button>
          </Link>
          <Link href={`/admin/patients?q=${q}&page=${Math.min(totalPages, page + 1)}`}>
            <Button variant="outline" size="sm" disabled={page >= totalPages}>
              Next <ChevronRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
