import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, UserX, Clock, Percent, Plus, Pencil } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import DataTable from "../components/shared/DataTable";
import Badge from "../components/shared/Badge";
import type { Column } from "../components/shared/DataTable";
import type { AttendanceRecord } from "../types";
import { useData } from "../context/DataContext";

const statusVariant = {
  present: "success" as const,
  absent: "danger" as const,
  late: "warning" as const,
  excused: "info" as const,
};

export default function Attendance() {
  const navigate = useNavigate();
  const { attendanceRecords } = useData();
  const [dateFilter, setDateFilter] = useState("2026-02-10");

  const filtered = attendanceRecords.filter((r) => r.date === dateFilter);

  const stats = useMemo(() => {
    const present = filtered.filter((r) => r.status === "present").length;
    const absent = filtered.filter((r) => r.status === "absent").length;
    const late = filtered.filter((r) => r.status === "late").length;
    const total = filtered.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { present, absent, late, rate };
  }, [filtered]);

  const columns: Column<AttendanceRecord>[] = [
    { key: "studentName", header: "Student" },
    { key: "grade", header: "Grade" },
    { key: "date", header: "Date" },
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
    {
      key: "actions",
      header: "Actions",
      render: (r) => (
        <button
          onClick={() => navigate(`/attendance/edit/${r.id}`)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-600"
          title="Edit attendance record"
        >
          <Pencil className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const summaryCards = [
    { label: "Present", value: stats.present, icon: UserCheck, color: "text-emerald-600 bg-emerald-100" },
    { label: "Absent", value: stats.absent, icon: UserX, color: "text-red-600 bg-red-100" },
    { label: "Late", value: stats.late, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Attendance Rate", value: `${stats.rate}%`, icon: Percent, color: "text-blue-600 bg-blue-100" },
  ];

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle="Track daily student attendance"
        action={
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              onClick={() => navigate("/attendance/create")}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add Record
            </button>
          </div>
        }
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
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <DataTable
        key={dateFilter}
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        paginationVariant="pill"
      />
    </div>
  );
}
