import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#020202] text-foreground antialiased selection:bg-primary/20">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#050505] via-[#020202] to-[#050505]">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
