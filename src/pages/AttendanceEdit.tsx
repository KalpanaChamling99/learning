import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const grades = ["8", "9", "10", "11", "12"];
const statuses = ["present", "absent", "late", "excused"] as const;

interface FormData {
  studentName: string;
  grade: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.studentName.trim()) errors.studentName = "Student name is required";
  if (!form.grade) errors.grade = "Please select a grade";
  if (!form.date) errors.date = "Date is required";
  if (!form.status) errors.status = "Please select a status";
  return errors;
}

export default function AttendanceEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAttendanceRecordById, updateAttendanceRecord } = useData();
  const { addToast } = useToast();
  const record = getAttendanceRecordById(id!);

  const [form, setForm] = useState<FormData>(() => {
    if (!record) return { studentName: "", grade: "", date: "", status: "" as FormData["status"] };
    return {
      studentName: record.studentName,
      grade: record.grade,
      date: record.date,
      status: record.status,
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-600">Attendance record not found</p>
        <button onClick={() => navigate("/attendance")} className="mt-4 text-sm text-primary-600 hover:underline">
          Back to Attendance
        </button>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (submitted || touched[name as keyof FormData]) {
      const nextErrors = validate(next);
      setErrors((prev) => ({ ...prev, [name]: nextErrors[name as keyof FormData] }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name as keyof FormData] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    updateAttendanceRecord(id!, form);
    addToast("Attendance record updated successfully", "success");
    navigate("/attendance");
  }

  const hasError = (field: keyof FormData) => !!(errors[field] && (touched[field] || submitted));
  const errorMsg = (field: keyof FormData) => (hasError(field) ? errors[field] : null);

  const inputBase = "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:ring-2";
  const inputOk = "border-gray-200 focus:border-primary-500 focus:ring-primary-500/20";
  const inputErr = "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20";
  const selectBase = "h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white pl-10 pr-9 text-sm text-gray-700 outline-none transition-all focus:ring-2";

  function inputCls(field: keyof FormData) {
    return `${inputBase} ${hasError(field) ? inputErr : inputOk}`;
  }
  function selectCls(field: keyof FormData) {
    return `${selectBase} ${hasError(field) ? inputErr : inputOk}`;
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Edit Attendance Record"
        subtitle="Update attendance information"
        action={
          <button
            onClick={() => navigate("/attendance")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Student Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">1</span>
            <h2 className="text-sm font-semibold text-gray-800">Student Details</h2>
          </div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Student Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Student Name <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="studentName"
                  value={form.studentName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Aarav Adhikari"
                  className={inputCls("studentName")}
                />
              </div>
              {errorMsg("studentName") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("studentName")}
                </p>
              )}
            </div>

            {/* Grade */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Grade <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("grade")}
                >
                  <option value="" disabled>
                    Select grade
                  </option>
                  {grades.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
              {errorMsg("grade") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("grade")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Attendance Details */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">2</span>
            <h2 className="text-sm font-semibold text-gray-800">Attendance Details</h2>
          </div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Date <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("date")}
                />
              </div>
              {errorMsg("date") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("date")}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Status <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("status")}
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errorMsg("status") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("status")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400"><span className="text-danger-500">*</span> Required fields</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/attendance")} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
              <Save className="h-4 w-4" />
              Update Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
