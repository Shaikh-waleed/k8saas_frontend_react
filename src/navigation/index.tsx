import "../App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "../context/AuthContext";
import PrivateRoute from "../components/privateRoute";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Dashboard from "../screens/Dashboard";
import CloudProfiles from "../screens/CloudProfiles";
import NotFound from "../screens/NotFound";

function Navigator() {
  return (
    <CookiesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFound />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/" element={<PrivateRoute ChildComponent={<Dashboard />} />} />
            <Route path="/cloud-profiles" element={<PrivateRoute ChildComponent={<CloudProfiles />} />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default Navigator;
