import { useState, useMemo } from "react";
import { IndianRupee, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import SearchInput from "../components/shared/SearchInput";
import SelectFilter from "../components/shared/SelectFilter";
import DataTable from "../components/shared/DataTable";
import Badge from "../components/shared/Badge";
import type { Column } from "../components/shared/DataTable";
import type { FeeRecord } from "../types";
import { feeRecords } from "../data/fees";

const statusVariant = {
  paid: "success" as const,
  pending: "warning" as const,
  overdue: "danger" as const,
};

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

const columns: Column<FeeRecord>[] = [
  { key: "id", header: "ID" },
  { key: "studentName", header: "Student" },
  { key: "grade", header: "Grade" },
  {
    key: "type",
    header: "Type",
    render: (r) => (
      <span className="capitalize">{r.type}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (r) => (
      <span className="font-medium">{formatCurrency(r.amount)}</span>
    ),
  },
  { key: "dueDate", header: "Due Date" },
  {
    key: "paidDate",
    header: "Paid Date",
    render: (r) => <span>{r.paidDate ?? "—"}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (r) => (
      <Badge
        label={r.status.charAt(0).toUpperCase() + r.status.slice(1)}
        variant={statusVariant[r.status]}
      />
    ),
  },
];

export default function Fees() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filtered = feeRecords.filter((r) => {
    const matchesSearch = r.studentName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = useMemo(() => {
    const paid = feeRecords
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.amount, 0);
    const pending = feeRecords
      .filter((r) => r.status === "pending")
      .reduce((sum, r) => sum + r.amount, 0);
    const overdue = feeRecords
      .filter((r) => r.status === "overdue")
      .reduce((sum, r) => sum + r.amount, 0);
    const total = paid + pending + overdue;
    const rate = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { paid, pending, overdue, rate };
  }, []);

  const summaryCards = [
    { label: "Total Collected", value: formatCurrency(stats.paid), icon: CheckCircle, color: "text-emerald-600 bg-emerald-100" },
    { label: "Pending", value: formatCurrency(stats.pending), icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Overdue", value: formatCurrency(stats.overdue), icon: AlertTriangle, color: "text-red-600 bg-red-100" },
    { label: "Collection Rate", value: `${stats.rate}%`, icon: IndianRupee, color: "text-blue-600 bg-blue-100" },
  ];

  return (
    <div>
      <PageHeader
        title="Fee Management"
        subtitle="Track and manage student fee payments"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-card"
          >
            <div className={`rounded-lg p-2.5 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by student name..."
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
            { value: "overdue", label: "Overdue" },
          ]}
        />
        <SelectFilter
          value={typeFilter}
          onChange={setTypeFilter}
          options={[
            { value: "all", label: "All Types" },
            { value: "tuition", label: "Tuition" },
            { value: "transport", label: "Transport" },
            { value: "library", label: "Library" },
            { value: "lab", label: "Lab" },
            { value: "exam", label: "Exam" },
          ]}
        />
      </div>

      <DataTable
        key={`${search}-${statusFilter}-${typeFilter}`}
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        paginationVariant="centered"
      />
    </div>
  );
}
