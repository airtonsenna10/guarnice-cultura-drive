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
import {
  LayoutDashboard,
  FileText,
  BadgeCheck,
  Car,
  Wrench,
  Bell,
  Users,
  IdCard,
  UserCog,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  title: string;
  url: string;
  role?: "admin" | "gestorOrAdmin";
  icon: LucideIcon;
};

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Solicitações", url: "/solicitacoes", icon: FileText },
  { title: "Autorizações", url: "/aprovacoes", role: "gestorOrAdmin" as const, icon: BadgeCheck },
  { title: "Veículos", url: "/veiculos", icon: Car },
  { title: "Manutenções", url: "/manutencoes", icon: Wrench },
  { title: "Alertas", url: "/alertas", icon: Bell },
  { title: "Servidores", url: "/servidores", icon: Users },
  { title: "Motoristas", url: "/motoristas", icon: IdCard },
  { title: "Usuários", url: "/usuarios", role: "admin" as const, icon: UserCog },
  { title: "Setores", url: "/setores", icon: Building2 },
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
    (isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50") + " flex items-center gap-3 py-3 text-base";

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
                      <item.icon className="h-5 w-5 text-current" aria-hidden="true" />
                      {!collapsed && <span>{item.title}</span>}
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
