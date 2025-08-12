import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TopNav() {
  const { user, logout, hasRole } = useAuth();
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/lovable-uploads/e44b57e6-caa7-4e2f-943b-435ef2a4b858.png" alt="Guarnicé Frotas - logotipo oficial" className="h-8 w-auto" />
            <span className="font-semibold">Guarnicé Frotas</span>
          </Link>
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
