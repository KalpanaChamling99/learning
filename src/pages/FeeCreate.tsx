import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  IndianRupee,
  Receipt,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData, nextId } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const grades = ["8", "9", "10", "11", "12"];
const feeTypes = ["tuition", "transport", "library", "lab", "exam"] as const;
const statuses = ["paid", "pending", "overdue"] as const;

interface FormData {
  studentName: string;
  grade: string;
  type: string;
  amount: string;
  dueDate: string;
  paidDate: string;
  status: "paid" | "pending" | "overdue";
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.studentName.trim()) errors.studentName = "Student name is required";
  if (!form.grade) errors.grade = "Please select a grade";
  if (!form.type) errors.type = "Please select a fee type";
  if (!form.amount.trim()) {
    errors.amount = "Amount is required";
  } else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
    errors.amount = "Amount must be a positive number";
  }
  if (!form.dueDate) errors.dueDate = "Due date is required";
  if (!form.status) errors.status = "Please select a status";
  return errors;
}

export default function FeeCreate() {
  const navigate = useNavigate();
  const { feeRecords, addFeeRecord } = useData();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData>({
    studentName: "",
    grade: "",
    type: "",
    amount: "",
    dueDate: "",
    paidDate: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (submitted || touched[name as keyof FormData]) {
      const nextErrors = validate(next);
      setErrors((prev) => ({
        ...prev,
        [name]: nextErrors[name as keyof FormData],
      }));
    }
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(form);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors[name as keyof FormData],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    addFeeRecord({
      ...form,
      id: nextId("FEE", feeRecords),
      amount: Number(form.amount),
      paidDate: form.paidDate || null,
    });
    addToast("Fee record added successfully", "success");
    navigate("/fees");
  }

  const hasError = (field: keyof FormData) =>
    !!(errors[field] && (touched[field] || submitted));

  const errorMsg = (field: keyof FormData) =>
    hasError(field) ? errors[field] : null;

  const inputBase =
    "h-11 w-full rounded-lg border bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:ring-2";
  const inputOk =
    "border-gray-200 focus:border-primary-500 focus:ring-primary-500/20";
  const inputErr =
    "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20";
  const selectBase =
    "h-11 w-full cursor-pointer appearance-none rounded-lg border bg-white pl-10 pr-9 text-sm text-gray-700 outline-none transition-all focus:ring-2";

  function inputCls(field: keyof FormData) {
    return `${inputBase} ${hasError(field) ? inputErr : inputOk}`;
  }
  function selectCls(field: keyof FormData) {
    return `${selectBase} ${hasError(field) ? inputErr : inputOk}`;
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add Fee Record"
        subtitle="Record a new fee entry"
        action={
          <button
            onClick={() => navigate("/fees")}
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
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Student Details
            </h2>
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

        {/* Section 2 — Fee Details */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Fee Details
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Fee Type */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Fee Type <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Receipt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("type")}
                >
                  <option value="" disabled>
                    Select fee type
                  </option>
                  {feeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              {errorMsg("type") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("type")}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Amount <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 25000"
                  className={inputCls("amount")}
                />
              </div>
              {errorMsg("amount") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("amount")}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Due Date <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("dueDate")}
                />
              </div>
              {errorMsg("dueDate") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("dueDate")}
                </p>
              )}
            </div>

            {/* Paid Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Paid Date
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="paidDate"
                  value={form.paidDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("paidDate")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — Status */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Status
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Status */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Payment Status <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectCls("status")}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            <span className="text-danger-500">*</span> Required fields
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/fees")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Record
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
