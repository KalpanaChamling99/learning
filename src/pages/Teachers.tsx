import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import SearchInput from "../components/shared/SearchInput";
import SelectFilter from "../components/shared/SelectFilter";
import DataTable from "../components/shared/DataTable";
import Badge from "../components/shared/Badge";
import type { Column } from "../components/shared/DataTable";
import type { Teacher } from "../types";
import { teachers } from "../data/teachers";

const statusVariant = {
  active: "success" as const,
  "on-leave": "warning" as const,
  inactive: "danger" as const,
};

const columns: Column<Teacher>[] = [
  {
    key: "name",
    header: "Teacher",
    render: (t) => (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${t.avatarColor}`}
        >
          {t.name
            .split(" ")
            .filter((n) => !n.endsWith("."))
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-500">{t.email}</p>
        </div>
      </div>
    ),
  },
  { key: "subject", header: "Subject" },
  { key: "department", header: "Department" },
  { key: "qualification", header: "Qualification" },
  {
    key: "status",
    header: "Status",
    render: (t) => (
      <Badge
        label={t.status === "on-leave" ? "On Leave" : t.status.charAt(0).toUpperCase() + t.status.slice(1)}
        variant={statusVariant[t.status]}
      />
    ),
  },
  { key: "phone", header: "Phone" },
  { key: "joinDate", header: "Joined" },
];

export default function Teachers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Teachers"
        subtitle="Manage teaching staff and assignments"
        action={
          <button className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            Add Teacher
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search teachers..."
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "on-leave", label: "On Leave" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
      </div>

      <DataTable
        key={`${search}-${statusFilter}`}
        columns={columns}
        data={filtered}
        keyExtractor={(t) => t.id}
        paginationVariant="minimal"
      />
    </div>
  );
}
