import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Entrar from "./pages/Entrar";
import Registrar from "./pages/Registrar";
import Home from "./pages/Home";
import Conta from "./pages/Conta";
import Agendar from "./pages/Agendar";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const ProtectedRoute = ({ element }) => {
    const { user } = useAuth();
    return user ? element : <Navigate to="/entrar" />;
  };
  
  const AppRoutes = () => {
    return (
      <Router>
        <Routes>
          <Route path="/agendarAqui" element={<Home />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="/registrar" element={<Registrar />} />
          <Route path="/Conta" element={<Conta />} />
          <Route path="/Agendar" element={<Agendar />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/EsqueciSenha" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
        </Routes>
      </Router>
    );
  };
  
  export default AppRoutes;