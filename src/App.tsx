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
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/solicitacoes" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
            <Route path="/aprovacoes" element={<ProtectedRoute><RoleRoute allow={["gestor", "administrador"]}><Approvals /></RoleRoute></ProtectedRoute>} />
            <Route path="/veiculos" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
            <Route path="/servidores" element={<ProtectedRoute><ServersPage /></ProtectedRoute>} />
            <Route path="/usuarios" element={<ProtectedRoute><RoleRoute allow={["administrador"]}><UsersPage /></RoleRoute></ProtectedRoute>} />
            <Route path="/setores" element={<ProtectedRoute><SectorsPage /></ProtectedRoute>} />
            <Route path="/motoristas" element={<ProtectedRoute><DriversPage /></ProtectedRoute>} />
            <Route path="/manutencoes" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
            <Route path="/alertas" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
