import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-3 py-2 rounded-md text-sm ${isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-accent/30"}`
    }
  >
    {children}
  </NavLink>
);

export default function TopNav() {
  const { user, logout, hasRole } = useAuth();
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between h-16">
        <Link to="/dashboard" className="flex items-center gap-3">
          <img src="/lovable-uploads/93e9ad14-7e94-4cab-950f-8774ac630d1d.png" alt="Logo Guarnicé Frotas" className="h-8 w-auto" />
          <span className="font-semibold">Guarnicé Frotas</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/dashboard">Dashboard</NavItem>
          <NavItem to="/solicitacoes">Solicitações</NavItem>
          {hasRole("gestor", "administrador") && <NavItem to="/aprovacoes">Autorizações</NavItem>}
          <NavItem to="/veiculos">Veículos</NavItem>
          <NavItem to="/manutencoes">Manutenções</NavItem>
          <NavItem to="/alertas">Alertas</NavItem>
          <NavItem to="/servidores">Servidores</NavItem>
          <NavItem to="/motoristas">Motoristas</NavItem>
          {hasRole("administrador") && <NavItem to="/usuarios">Usuários</NavItem>}
          <NavItem to="/setores">Setores</NavItem>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-muted-foreground hidden sm:inline">{user.nome} • {user.perfil}</span>}
          {user ? (
            <Button variant="outline" onClick={logout}>Sair</Button>
          ) : (
            <Link to="/login"><Button variant="brand">Entrar</Button></Link>
          )}
        </div>
      </nav>
    </header>
  );
}
