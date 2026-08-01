// Topbar: tombol menu (mobile), judul halaman aktif, dan aksi (tema & status backend).
import { Menu, Server } from "lucide-react";
import { useLocation } from "react-router-dom";
import { navItems } from "@/data/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useApiData } from "@/hooks/useJsonData";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const active = navItems.find((n) => (n.to === "/" ? pathname === "/" : pathname.startsWith(n.to)));
  const { isLive } = useApiData("status");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/80 bg-bg/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        aria-label="Buka menu"
        className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted hover:text-fg lg:hidden"
      >
        <Menu className="h-4.5 w-4.5" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-soft">
          <span>Revesery</span>
          <span>/</span>
          <span>{active?.section ?? "Dashboard"}</span>
        </div>
        <p className="truncate font-display text-sm font-bold text-fg sm:text-base">
          {active?.label ?? "Dashboard"}
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        {isLive ? (
          <span className="chip bg-retain/15 text-retain border border-retain/20 hidden sm:inline-flex" title="Terhubung ke Backend FastAPI">
            <span className="status-dot-live" /> Live FastAPI Engine
          </span>
        ) : (
          <span className="chip bg-warn/15 text-warn border border-warn/20 hidden sm:inline-flex" title="Menggunakan Data Static JSON">
            <Server className="h-3 w-3" /> Data Statis
          </span>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}

