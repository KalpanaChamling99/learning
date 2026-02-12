import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  BookOpen,
  Building2,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData, nextId, randomAvatarColor } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const departments = [
  "Science",
  "Languages",
  "Humanities",
  "Technology",
  "Sports",
  "Arts",
  "Commerce",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  qualification: string;
  joinDate: string;
  status: "active" | "on-leave" | "inactive";
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Full name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[+\d][\d\s\-()]{7,}$/.test(form.phone)) {
    errors.phone = "Enter a valid phone number";
  }
  if (!form.subject.trim()) errors.subject = "Subject is required";
  if (!form.department) errors.department = "Please select a department";
  if (!form.qualification.trim())
    errors.qualification = "Qualification is required";
  if (!form.joinDate) errors.joinDate = "Join date is required";
  return errors;
}

export default function TeacherCreate() {
  const navigate = useNavigate();
  const { teachers, addTeacher } = useData();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    department: "",
    qualification: "",
    joinDate: "",
    status: "active",
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
    addTeacher({
      ...form,
      id: nextId("TCH", teachers),
      avatarColor: randomAvatarColor(),
    });
    addToast("Teacher added successfully", "success");
    navigate("/teachers");
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
        title="Add New Teacher"
        subtitle="Fill in the details to add a new teacher"
        action={
          <button
            onClick={() => navigate("/teachers")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Personal Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Personal Information
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Full Name <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Sita Sharma"
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

            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Email Address <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. sita@school.edu"
                  className={inputCls("email")}
                />
              </div>
              {errorMsg("email") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("email")}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Phone Number <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. +977 9841 234510"
                  className={inputCls("phone")}
                />
              </div>
              {errorMsg("phone") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("phone")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Professional Details */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Professional Details
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Subject */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Subject <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Mathematics"
                  className={inputCls("subject")}
                />
              </div>
              {errorMsg("subject") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("subject")}
                </p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Department <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("department")}
                >
                  <option value="" disabled>
                    Select department
                  </option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {errorMsg("department") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("department")}
                </p>
              )}
            </div>

            {/* Qualification */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Qualification <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. M.Sc. Mathematics"
                  className={inputCls("qualification")}
                />
              </div>
              {errorMsg("qualification") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("qualification")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 — Employment */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Employment
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Join Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Join Date <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="joinDate"
                  value={form.joinDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("joinDate")}
                />
              </div>
              {errorMsg("joinDate") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("joinDate")}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={selectCls("status")}
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
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
              onClick={() => navigate("/teachers")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Teacher
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
