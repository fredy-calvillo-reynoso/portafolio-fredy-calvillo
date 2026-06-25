// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Home from "./pages/Home";
import Tienda from "./pages/Tienda";
import Pago from "./pages/Pago";
import Proceso from "./pages/Proceso";
import Soporte from "./pages/Soporte";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Privacidad from "./pages/Privacidad";
import TerminosServicio from "./pages/TerminosServicio";
import AvisoLegal from "./pages/AvisoLegal";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tienda" element={<Tienda />} />
        <Route path="soporte" element={<Soporte />} />
        <Route path="login" element={<Login />} />
        <Route path="privacidad" element={<Privacidad />} />
        <Route path="terminos" element={<TerminosServicio />} />
        <Route path="aviso-legal" element={<AvisoLegal />} />
        <Route
          path="pago"
          element={
            <ProtectedRoute>
              <Pago />
            </ProtectedRoute>
          }
        />
        <Route
          path="proceso"
          element={
            <ProtectedRoute>
              <Proceso />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
