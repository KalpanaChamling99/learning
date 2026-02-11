export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  section: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated";
  parentName: string;
  phone: string;
  avatarColor: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  department: string;
  joinDate: string;
  status: "active" | "on-leave" | "inactive";
  phone: string;
  qualification: string;
  avatarColor: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  teacherName: string;
  studentCount: number;
  room: string;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
}

export interface FeeRecord {
  id: string;
  studentName: string;
  grade: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: "paid" | "pending" | "overdue";
  type: "tuition" | "transport" | "library" | "lab" | "exam";
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "academic" | "sports" | "cultural" | "holiday" | "meeting";
  location: string;
}

export interface DashboardStat {
  title: string;
  value: string | number;
  change: number;
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}
