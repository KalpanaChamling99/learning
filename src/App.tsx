import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentCreate from "./pages/StudentCreate";
import StudentEdit from "./pages/StudentEdit";
import Teachers from "./pages/Teachers";
import TeacherCreate from "./pages/TeacherCreate";
import TeacherEdit from "./pages/TeacherEdit";
import Classes from "./pages/Classes";
import ClassCreate from "./pages/ClassCreate";
import ClassEdit from "./pages/ClassEdit";
import Attendance from "./pages/Attendance";
import AttendanceCreate from "./pages/AttendanceCreate";
import AttendanceEdit from "./pages/AttendanceEdit";
import Fees from "./pages/Fees";
import FeeCreate from "./pages/FeeCreate";
import FeeEdit from "./pages/FeeEdit";
import Events from "./pages/Events";
import EventCreate from "./pages/EventCreate";
import EventEdit from "./pages/EventEdit";

export default function App() {
  return (
    <DataProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="students/create" element={<StudentCreate />} />
              <Route path="students/edit/:id" element={<StudentEdit />} />
              <Route path="teachers" element={<Teachers />} />
              <Route path="teachers/create" element={<TeacherCreate />} />
              <Route path="teachers/edit/:id" element={<TeacherEdit />} />
              <Route path="classes" element={<Classes />} />
              <Route path="classes/create" element={<ClassCreate />} />
              <Route path="classes/edit/:id" element={<ClassEdit />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="attendance/create" element={<AttendanceCreate />} />
              <Route path="attendance/edit/:id" element={<AttendanceEdit />} />
              <Route path="fees" element={<Fees />} />
              <Route path="fees/create" element={<FeeCreate />} />
              <Route path="fees/edit/:id" element={<FeeEdit />} />
              <Route path="events" element={<Events />} />
              <Route path="events/create" element={<EventCreate />} />
              <Route path="events/edit/:id" element={<EventEdit />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </DataProvider>
  );
}
