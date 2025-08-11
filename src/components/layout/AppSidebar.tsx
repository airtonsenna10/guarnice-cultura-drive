import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

const items = [
  { title: "Dashboard", url: "/dashboard" },
  { title: "Solicitações", url: "/solicitacoes" },
  { title: "Autorizações", url: "/aprovacoes", role: "gestorOrAdmin" as const },
  { title: "Veículos", url: "/veiculos" },
  { title: "Manutenções", url: "/manutencoes" },
  { title: "Alertas", url: "/alertas" },
  { title: "Servidores", url: "/servidores" },
  { title: "Motoristas", url: "/motoristas" },
  { title: "Usuários", url: "/usuarios", role: "admin" as const },
  { title: "Setores", url: "/setores" },
];

export default function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { hasRole } = useAuth();

  const canShow = (it: typeof items[number]) => {
    if (!it.role) return true;
    if (it.role === "admin") return hasRole("administrador");
    if (it.role === "gestorOrAdmin") return hasRole("gestor", "administrador");
    return true;
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.filter(canShow).map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={linkCls}>
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
