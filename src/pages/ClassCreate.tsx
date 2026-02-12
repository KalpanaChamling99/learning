import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  BookOpen,
  GraduationCap,
  Users,
  User,
  MapPin,
  Clock,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData, nextId } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const grades = ["8", "9", "10", "11", "12"];
const sections = ["A", "B"];

interface FormData {
  name: string;
  grade: string;
  section: string;
  teacherName: string;
  studentCount: string;
  room: string;
  schedule: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Class name is required";
  if (!form.grade) errors.grade = "Please select a grade";
  if (!form.section) errors.section = "Please select a section";
  if (!form.teacherName.trim()) errors.teacherName = "Teacher name is required";
  if (!form.studentCount.trim()) {
    errors.studentCount = "Student count is required";
  } else if (isNaN(Number(form.studentCount)) || Number(form.studentCount) <= 0) {
    errors.studentCount = "Enter a valid positive number";
  }
  if (!form.room.trim()) errors.room = "Room is required";
  if (!form.schedule.trim()) errors.schedule = "Schedule is required";
  return errors;
}

export default function ClassCreate() {
  const navigate = useNavigate();
  const { classes, addClass } = useData();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData>({
    name: "",
    grade: "",
    section: "",
    teacherName: "",
    studentCount: "",
    room: "",
    schedule: "",
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
    addClass({
      ...form,
      id: nextId("CLS", classes),
      studentCount: Number(form.studentCount),
    });
    addToast("Class created successfully", "success");
    navigate("/classes");
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
        title="Add New Class"
        subtitle="Fill in the details to create a new class"
        action={
          <button
            onClick={() => navigate("/classes")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Class Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Class Information
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Class Name */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Class Name <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Grade 10 - A"
                  className={inputCls("name")}
                />
              </div>
              {errorMsg("name") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("name")}
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

            {/* Section */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Section <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("section")}
                >
                  <option value="" disabled>
                    Select section
                  </option>
                  {sections.map((s) => (
                    <option key={s} value={s}>
                      Section {s}
                    </option>
                  ))}
                </select>
              </div>
              {errorMsg("section") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("section")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Assignment */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Assignment
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Teacher Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Teacher Name <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="teacherName"
                  value={form.teacherName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Dr. Sunita Sharma"
                  className={inputCls("teacherName")}
                />
              </div>
              {errorMsg("teacherName") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("teacherName")}
                </p>
              )}
            </div>

            {/* Student Count */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Student Count <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  name="studentCount"
                  value={form.studentCount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. 35"
                  className={inputCls("studentCount")}
                />
              </div>
              {errorMsg("studentCount") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("studentCount")}
                </p>
              )}
            </div>

            {/* Room */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Room <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="room"
                  value={form.room}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Room 101"
                  className={inputCls("room")}
                />
              </div>
              {errorMsg("room") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("room")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 — Schedule */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Schedule
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Schedule */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Schedule <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="schedule"
                  value={form.schedule}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Mon-Fri, 8:00-2:30"
                  className={inputCls("schedule")}
                />
              </div>
              {errorMsg("schedule") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("schedule")}
                </p>
              )}
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
              onClick={() => navigate("/classes")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Class
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
