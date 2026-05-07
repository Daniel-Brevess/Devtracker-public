import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import Register from "../pages/public/Register";
import Login from "../pages/public/Login";
import Dashboard from "../pages/private/Dashboard";
import Profile from "../pages/private/Profile";
import ProfileEdit from "../pages/private/ProfileEdit";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/profileedit"
          element={<ProfileEdit />}
        />
      </Routes>
    </BrowserRouter>
  );
}