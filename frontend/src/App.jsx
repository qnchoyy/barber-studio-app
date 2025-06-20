import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import AdminLayout from "./components/admin/layout/AdminLayout";

// Public pages
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Services from "./pages/Services";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminSchedule from "./pages/admin/AdminSchedule";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes with main Navbar */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <Navbar />
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Navbar />
              <Register />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/services"
          element={
            <>
              <Navbar />
              <Services />
            </>
          }
        />
        <Route
          path="/booking-confirmation"
          element={
            <>
              <Navbar />
              <BookingConfirmation />
            </>
          }
        />
        <Route
          path="/bookings"
          element={
            <>
              <Navbar />
              <MyBookings />
            </>
          }
        />

        {/* Admin routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          }
        />

        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/schedule" element={<AdminSchedule />} />
      </Routes>
    </>
  );
}

export default App;
