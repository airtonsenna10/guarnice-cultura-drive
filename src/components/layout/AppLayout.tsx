import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopNav from "@/components/layout/TopNav";
import AppSidebar from "@/components/layout/AppSidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="container mx-auto p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
