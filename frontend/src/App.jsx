import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ScanPage      from "./pages/ScanPage";
import ResultsPage   from "./pages/ResultsPage";
import Navbar        from "./components/Navbar";

function PrivateRoute({ children }) {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/"            element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/scan"        element={<PrivateRoute><ScanPage /></PrivateRoute>} />
        <Route path="/results/:id" element={<PrivateRoute><ResultsPage /></PrivateRoute>} />
      </Routes>
    </AuthProvider>
  );
}
