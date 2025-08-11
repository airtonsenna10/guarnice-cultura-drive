import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Requests from "@/pages/Requests";
import Approvals from "@/pages/Approvals";
import VehiclesPage from "@/pages/entities/Vehicles";
import ServersPage from "@/pages/entities/Servers";
import UsersPage from "@/pages/entities/Users";
import SectorsPage from "@/pages/entities/Sectors";
import DriversPage from "@/pages/entities/Drivers";
import MaintenancePage from "@/pages/entities/Maintenance";
import AlertsPage from "@/pages/entities/Alerts";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/routes/ProtectedRoute";
import RoleRoute from "@/routes/RoleRoute";
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/solicitacoes" element={<Requests />} />
              <Route path="/aprovacoes" element={<RoleRoute allow={["gestor", "administrador"]}><Approvals /></RoleRoute>} />
              <Route path="/veiculos" element={<VehiclesPage />} />
              <Route path="/servidores" element={<ServersPage />} />
              <Route path="/usuarios" element={<RoleRoute allow={["administrador"]}><UsersPage /></RoleRoute>} />
              <Route path="/setores" element={<SectorsPage />} />
              <Route path="/motoristas" element={<DriversPage />} />
              <Route path="/manutencoes" element={<MaintenancePage />} />
              <Route path="/alertas" element={<AlertsPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
