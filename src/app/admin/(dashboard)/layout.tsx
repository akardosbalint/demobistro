import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminMobileNav } from "@/components/admin/mobile-nav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminMobileNav />
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
