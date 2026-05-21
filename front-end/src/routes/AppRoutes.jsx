import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/public/LandingPage";
import Register from "../pages/public/Register";
import Login from "../pages/public/Login";

import Dashboard22 from "../pages/private/Dashboard22";
import ProfileEdit from "../pages/private/ProfileEdit";
import ProfileEdit22 from "../pages/private/ProfileEdit22";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard22" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/dashboard22"
          element={
            <PrivateRoute>
              <Dashboard22 />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Navigate to="/dashboard22" replace />
            </PrivateRoute>
          }
        />

        <Route
          path="/profileedit"
          element={
            <PrivateRoute>
              <ProfileEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/profileedit22"
          element={
            <PrivateRoute>
              <ProfileEdit22 />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
