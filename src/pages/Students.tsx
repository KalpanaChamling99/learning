import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import SearchInput from "../components/shared/SearchInput";
import SelectFilter from "../components/shared/SelectFilter";
import DataTable from "../components/shared/DataTable";
import Badge from "../components/shared/Badge";
import type { Column } from "../components/shared/DataTable";
import type { Student } from "../types";
import { students } from "../data/students";

const statusVariant = {
  active: "success" as const,
  inactive: "danger" as const,
  graduated: "info" as const,
};

const columns: Column<Student>[] = [
  {
    key: "name",
    header: "Student",
    render: (s) => (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white ${s.avatarColor}`}
        >
          {s.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="font-medium text-gray-900">{s.name}</p>
          <p className="text-xs text-gray-500">{s.email}</p>
        </div>
      </div>
    ),
  },
  { key: "id", header: "ID" },
  { key: "grade", header: "Grade" },
  { key: "section", header: "Section" },
  {
    key: "status",
    header: "Status",
    render: (s) => (
      <Badge
        label={s.status.charAt(0).toUpperCase() + s.status.slice(1)}
        variant={statusVariant[s.status]}
      />
    ),
  },
  { key: "parentName", header: "Parent" },
  { key: "enrollmentDate", header: "Enrolled" },
];

export default function Students() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage student records and enrollment"
        action={
          <button
            onClick={() => navigate("/students/create")}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Student
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search students..."
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "graduated", label: "Graduated" },
          ]}
        />
      </div>

      <DataTable
        key={`${search}-${statusFilter}`}
        columns={columns}
        data={filtered}
        keyExtractor={(s) => s.id}
      />
    </div>
  );
}
