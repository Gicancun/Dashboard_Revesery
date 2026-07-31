// Topbar: tombol menu (mobile), judul halaman aktif, dan aksi (tema).
import { Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navItems } from "@/data/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const active = navItems.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        aria-label="Buka menu"
        className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted hover:text-fg lg:hidden"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-fg sm:text-base">
          {active?.label ?? "Dashboard"}
        </p>
        <p className="hidden text-xs text-muted sm:block">Analisis Customer Churn Revesery Store</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="chip hidden bg-retain/10 text-retain sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-retain" /> Data JSON aktif
        </span>
        <ThemeToggle />
      </div>
    </header>
  );
}
