"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Key, 
  BarChart2, 
  CreditCard, 
  Settings, 
  BookOpen, 
  Activity,
  LogOut,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Key, label: "API Keys", href: "/dashboard/keys" },
  { icon: BarChart2, label: "Usage", href: "/dashboard/usage" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

const resourceItems = [
  { icon: BookOpen, label: "Documentation", href: "/docs" },
  { icon: Activity, label: "API Status", href: "/status" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
    }
    window.location.href = "/";
  };

  return (
    <div className="w-64 h-screen border-r border-white/5 flex flex-col bg-card/30 backdrop-blur-xl">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <span className="text-primary font-bold">P</span>
          </div>
          <span className="glow-text tracking-tight">PathGen</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2 opacity-50">Main Menu</div>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group text-sm font-medium",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}

        <div className="mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2 opacity-50">Resources</div>
        {resourceItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group text-sm font-medium",
              pathname === item.href 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
            <ChevronRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        {/* Upgrade Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/20 blur-2xl group-hover:bg-primary/40 transition-all duration-700" />
           <div className="relative z-10">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Scale your tools</div>
              <div className="text-sm font-bold text-foreground mb-1">Upgrade to Pro</div>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-3 opacity-70">Unlock Gemini AI coaching and 100+ req/min rate limits.</p>
              <Link href="/dashboard/billing">
                <Button size="sm" className="w-full h-8 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                  Go Pro Now
                </Button>
              </Link>
           </div>
        </div>

        <div className="px-3 py-4 glass-card bg-white/[0.02] border-white/5">
           <div className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">Available Credits</div>
           <div className="text-xl font-bold tracking-tight">54,020</div>
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 rounded-xl hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
