import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import type {
  Student,
  Teacher,
  ClassInfo,
  AttendanceRecord,
  FeeRecord,
  SchoolEvent,
} from "../types";
import { students as initialStudents } from "../data/students";
import { teachers as initialTeachers } from "../data/teachers";
import { classes as initialClasses } from "../data/classes";
import { attendanceRecords as initialAttendance } from "../data/attendance";
import { feeRecords as initialFees } from "../data/fees";
import { events as initialEvents } from "../data/events";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-pink-500",
  "bg-amber-500", "bg-cyan-500", "bg-red-500", "bg-teal-500",
  "bg-indigo-500", "bg-orange-500", "bg-rose-500", "bg-violet-500",
];

export function randomAvatarColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function nextId(prefix: string, items: { id: string }[]) {
  const max = Math.max(0, ...items.map((i) => parseInt(i.id.replace(/\D/g, ""), 10)));
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

interface DataContextValue {
  students: Student[];
  addStudent: (s: Student) => void;
  updateStudent: (id: string, s: Partial<Student>) => void;
  getStudentById: (id: string) => Student | undefined;

  teachers: Teacher[];
  addTeacher: (t: Teacher) => void;
  updateTeacher: (id: string, t: Partial<Teacher>) => void;
  getTeacherById: (id: string) => Teacher | undefined;

  classes: ClassInfo[];
  addClass: (c: ClassInfo) => void;
  updateClass: (id: string, c: Partial<ClassInfo>) => void;
  getClassById: (id: string) => ClassInfo | undefined;

  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (a: AttendanceRecord) => void;
  updateAttendanceRecord: (id: string, a: Partial<AttendanceRecord>) => void;
  getAttendanceRecordById: (id: string) => AttendanceRecord | undefined;

  feeRecords: FeeRecord[];
  addFeeRecord: (f: FeeRecord) => void;
  updateFeeRecord: (id: string, f: Partial<FeeRecord>) => void;
  getFeeRecordById: (id: string) => FeeRecord | undefined;

  events: SchoolEvent[];
  addEvent: (e: SchoolEvent) => void;
  updateEvent: (id: string, e: Partial<SchoolEvent>) => void;
  getEventById: (id: string) => SchoolEvent | undefined;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes, setClasses] = useState<ClassInfo[]>(initialClasses);
  const [attendanceRecords, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [feeRecords, setFees] = useState<FeeRecord[]>(initialFees);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);

  // Students
  const addStudent = useCallback((s: Student) => setStudents((p) => [...p, s]), []);
  const updateStudent = useCallback(
    (id: string, data: Partial<Student>) =>
      setStudents((p) => p.map((s) => (s.id === id ? { ...s, ...data } : s))),
    [],
  );
  const getStudentById = useCallback(
    (id: string) => students.find((s) => s.id === id),
    [students],
  );

  // Teachers
  const addTeacher = useCallback((t: Teacher) => setTeachers((p) => [...p, t]), []);
  const updateTeacher = useCallback(
    (id: string, data: Partial<Teacher>) =>
      setTeachers((p) => p.map((t) => (t.id === id ? { ...t, ...data } : t))),
    [],
  );
  const getTeacherById = useCallback(
    (id: string) => teachers.find((t) => t.id === id),
    [teachers],
  );

  // Classes
  const addClass = useCallback((c: ClassInfo) => setClasses((p) => [...p, c]), []);
  const updateClass = useCallback(
    (id: string, data: Partial<ClassInfo>) =>
      setClasses((p) => p.map((c) => (c.id === id ? { ...c, ...data } : c))),
    [],
  );
  const getClassById = useCallback(
    (id: string) => classes.find((c) => c.id === id),
    [classes],
  );

  // Attendance
  const addAttendanceRecord = useCallback(
    (a: AttendanceRecord) => setAttendance((p) => [...p, a]),
    [],
  );
  const updateAttendanceRecord = useCallback(
    (id: string, data: Partial<AttendanceRecord>) =>
      setAttendance((p) => p.map((a) => (a.id === id ? { ...a, ...data } : a))),
    [],
  );
  const getAttendanceRecordById = useCallback(
    (id: string) => attendanceRecords.find((a) => a.id === id),
    [attendanceRecords],
  );

  // Fees
  const addFeeRecord = useCallback(
    (f: FeeRecord) => setFees((p) => [...p, f]),
    [],
  );
  const updateFeeRecord = useCallback(
    (id: string, data: Partial<FeeRecord>) =>
      setFees((p) => p.map((f) => (f.id === id ? { ...f, ...data } : f))),
    [],
  );
  const getFeeRecordById = useCallback(
    (id: string) => feeRecords.find((f) => f.id === id),
    [feeRecords],
  );

  // Events
  const addEvent = useCallback(
    (e: SchoolEvent) => setEvents((p) => [...p, e]),
    [],
  );
  const updateEvent = useCallback(
    (id: string, data: Partial<SchoolEvent>) =>
      setEvents((p) => p.map((e) => (e.id === id ? { ...e, ...data } : e))),
    [],
  );
  const getEventById = useCallback(
    (id: string) => events.find((e) => e.id === id),
    [events],
  );

  return (
    <DataContext.Provider
      value={{
        students, addStudent, updateStudent, getStudentById,
        teachers, addTeacher, updateTeacher, getTeacherById,
        classes, addClass, updateClass, getClassById,
        attendanceRecords, addAttendanceRecord, updateAttendanceRecord, getAttendanceRecordById,
        feeRecords, addFeeRecord, updateFeeRecord, getFeeRecordById,
        events, addEvent, updateEvent, getEventById,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
