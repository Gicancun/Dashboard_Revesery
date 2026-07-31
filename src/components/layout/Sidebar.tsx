// Sidebar kiri: brand + navigasi berkelompok. Responsif: menjadi drawer di mobile.
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { navItems } from "@/data/navigation";

// Kelompokkan menu berdasarkan section, mempertahankan urutan kemunculan.
const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
  const key = item.section ?? "Lainnya";
  (acc[key] ??= []).push(item);
  return acc;
}, {});

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-brand-fg shadow-sm">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
          <path d="M6 18v-5M12 18V7M18 18v-8" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className="font-display text-sm font-bold text-fg">Revesery</div>
        <div className="text-[11px] text-muted">Churn Analytics</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-6 space-y-6 px-2">
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section}>
          <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70">{section}</p>
          <div className="space-y-0.5">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-brand/10 text-brand" : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-brand" : "text-muted group-hover:text-fg"}`} strokeWidth={2.1} />
                    <span className="truncate">{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Desktop: sidebar tetap */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto py-5">
          <Brand />
          <NavList />
          <div className="mt-auto px-4 pt-6">
            <p className="rounded-lg bg-surface-2 p-3 text-[11px] leading-relaxed text-muted">
              Dashboard akademik. Seluruh data dimuat dari file JSON hasil analisis Google Colab.
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile: drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-border bg-surface py-5 lg:hidden"
            >
              <div className="flex items-center justify-between pr-3">
                <Brand />
                <button onClick={onClose} aria-label="Tutup menu" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2">
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <NavList onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
