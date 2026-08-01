// Sidebar kiri: brand + navigasi berkelompok. Responsif: menjadi drawer di mobile.
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { navItems } from "@/data/navigation";

// Kelompokkan menu berdasarkan section, mempertahankan urutan kemunculan.
const grouped = navItems.reduce<Record<string, typeof navItems>>((acc, item) => {
  const key = item.section ?? "Lainnya";
  (acc[key] ??= []).push(item);
  return acc;
}, {});

function Brand() {
  return (
    <div className="flex items-center gap-3 px-3 py-1">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-brand to-accent text-white shadow-lg shadow-brand/25">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
          <path d="M6 18v-5M12 18V7M18 18v-8" />
        </svg>
        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
      </div>
      <div className="leading-tight">
        <div className="font-display text-base font-extrabold text-fg tracking-tight">Revesery</div>
        <div className="text-[11px] font-medium text-brand-soft">Churn Intelligence</div>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="mt-6 space-y-6 px-2">
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section}>
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-muted/60">{section}</p>
          <div className="space-y-1">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-brand/15 text-brand-soft shadow-sm border border-brand/20 font-semibold"
                      : "text-muted hover:bg-surface-2 hover:text-fg"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-brand-soft" : "text-muted group-hover:text-fg"}`} strokeWidth={2.1} />
                    <span className="truncate">{label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="activePill"
                        className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
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
      <aside className="hidden w-64 shrink-0 border-r border-border/80 bg-surface/70 backdrop-blur-xl lg:block">
        <div className="sticky top-0 flex h-screen flex-col overflow-y-auto py-5">
          <Brand />
          <NavList />
          <div className="mt-auto px-3 pt-6">
            <div className="rounded-xl border border-brand/15 bg-brand/5 p-3.5 text-[11px] leading-relaxed text-muted">
              <div className="mb-1 flex items-center gap-1.5 font-semibold text-brand-soft">
                <Sparkles className="h-3.5 w-3.5" /> Fast API + Random Forest
              </div>
              Data diproses menggunakan Machine Learning & Explainable AI (SHAP).
            </div>
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
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

