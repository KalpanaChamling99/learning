import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Type,
  FileText,
  CalendarDays,
  Clock,
  Tag,
  MapPin,
  AlertCircle,
} from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData, nextId } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

const eventTypes = ["academic", "sports", "cultural", "holiday", "meeting"] as const;

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.title.trim()) errors.title = "Event title is required";
  if (!form.description.trim()) errors.description = "Description is required";
  if (!form.date) errors.date = "Date is required";
  if (!form.time) errors.time = "Time is required";
  if (!form.type) errors.type = "Please select an event type";
  if (!form.location.trim()) errors.location = "Location is required";
  return errors;
}

export default function EventCreate() {
  const navigate = useNavigate();
  const { events, addEvent } = useData();
  const { addToast } = useToast();
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "09:00",
    type: "",
    location: "",
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
    addEvent({
      ...form,
      id: nextId("EVT", events),
      type: form.type as FormData["type"],
    } as any);
    addToast("Event created successfully", "success");
    navigate("/events");
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
        title="Add New Event"
        subtitle="Create a new school event"
        action={
          <button
            onClick={() => navigate("/events")}
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} noValidate>
        {/* Section 1 — Event Details */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Event Details
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Title */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Title <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Type className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Annual Science Fair"
                  className={inputCls("title")}
                />
              </div>
              {errorMsg("title") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("title")}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Description <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <FileText className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Annual science exhibition for all grades"
                  className={inputCls("description")}
                />
              </div>
              {errorMsg("description") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("description")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2 — Schedule */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Schedule
            </h2>
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

            {/* Time */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Time <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputCls("time")}
                />
              </div>
              {errorMsg("time") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("time")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3 — Details */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              3
            </span>
            <h2 className="text-sm font-semibold text-gray-800">
              Details
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
            {/* Type */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Event Type <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectCls("type")}
                >
                  <option value="" disabled>
                    Select event type
                  </option>
                  {eventTypes.map((t) => (
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

            {/* Location */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-sm font-medium text-gray-700">
                Location <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="e.g. Main Auditorium"
                  className={inputCls("location")}
                />
              </div>
              {errorMsg("location") && (
                <p className="mt-1 flex items-center gap-1 text-xs text-danger-500">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errorMsg("location")}
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
              onClick={() => navigate("/events")}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
