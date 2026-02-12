import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  GraduationCap,
  Phone,
  CalendarDays,
  Users,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const grades = ["8", "9", "10", "11", "12"];
const sections = ["A", "B"];

interface FormData {
  name: string;
  email: string;
  grade: string;
  section: string;
  parentName: string;
  phone: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated";
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
  if (!form.grade) errors.grade = "Please select a grade";
  if (!form.section) errors.section = "Please select a section";
  if (!form.parentName.trim())
    errors.parentName = "Guardian name is required";
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!/^[+\d][\d\s\-()]{7,}$/.test(form.phone)) {
    errors.phone = "Enter a valid phone number";
  }
  if (!form.enrollmentDate)
    errors.enrollmentDate = "Enrollment date is required";
  return errors;
}

export default function StudentEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getStudentById, updateStudent } = useData();
  const { addToast } = useToast();
  const student = getStudentById(id!);

  const [form, setForm] = useState<FormData>(() => {
    if (!student) return { name: "", email: "", grade: "", section: "", parentName: "", phone: "", enrollmentDate: "", status: "active" };
    return {
      name: student.name,
      email: student.email,
      grade: student.grade,
      section: student.section,
      parentName: student.parentName,
      phone: student.phone,
      enrollmentDate: student.enrollmentDate,
      status: student.status,
    };
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-gray-600">Student not found</p>
        <button onClick={() => navigate("/students")} className="mt-4 text-sm text-primary-600 hover:underline">
          Back to Students
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
    updateStudent(id!, form);
    addToast("Student updated successfully", "success");
    navigate("/students");
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
        title="Edit Student"
        subtitle="Update student information"
        action={
          <button
            onClick={() => navigate("/students")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Personal */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">1</span>
            <h2 className="text-sm font-semibold text-gray-800">Personal Information</h2>
          </div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Full Name <span className="text-danger-500">*</span></label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Aarav Adhikari" className={inputCls("name")} />
              </div>
              {errorMsg("name") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("name")}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Email Address <span className="text-danger-500">*</span></label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. aarav@school.edu" className={inputCls("email")} />
              </div>
              {errorMsg("email") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("email")}</p>}
            </div>
          </div>
        </div>

        {/* Section 2 — Academic */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">2</span>
            <h2 className="text-sm font-semibold text-gray-800">Academic Details</h2>
          </div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Grade <span className="text-danger-500">*</span></label>
              <div className="relative">
                <GraduationCap className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select name="grade" value={form.grade} onChange={handleChange} onBlur={handleBlur} className={selectCls("grade")}>
                  <option value="" disabled>Select grade</option>
                  {grades.map((g) => <option key={g} value={g}>Grade {g}</option>)}
                </select>
              </div>
              {errorMsg("grade") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("grade")}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Section <span className="text-danger-500">*</span></label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select name="section" value={form.section} onChange={handleChange} onBlur={handleBlur} className={selectCls("section")}>
                  <option value="" disabled>Select section</option>
                  {sections.map((s) => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              {errorMsg("section") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("section")}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Enrollment Date <span className="text-danger-500">*</span></label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="date" name="enrollmentDate" value={form.enrollmentDate} onChange={handleChange} onBlur={handleBlur} className={inputCls("enrollmentDate")} />
              </div>
              {errorMsg("enrollmentDate") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("enrollmentDate")}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Status</label>
              <div className="relative">
                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select name="status" value={form.status} onChange={handleChange} className={selectCls("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — Guardian */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">3</span>
            <h2 className="text-sm font-semibold text-gray-800">Guardian Information</h2>
          </div>
          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Parent / Guardian <span className="text-danger-500">*</span></label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="text" name="parentName" value={form.parentName} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Rajesh Adhikari" className={inputCls("parentName")} />
              </div>
              {errorMsg("parentName") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("parentName")}</p>}
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">Phone Number <span className="text-danger-500">*</span></label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. +977 9841 234510" className={inputCls("phone")} />
              </div>
              {errorMsg("phone") && <p className="mt-1 flex items-center gap-1 text-xs text-danger-500"><AlertCircle className="h-3 w-3 shrink-0" />{errorMsg("phone")}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400"><span className="text-danger-500">*</span> Required fields</p>
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate("/students")} className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">Cancel</button>
            <button type="submit" className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700">
              <Save className="h-4 w-4" />
              Update Student
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
