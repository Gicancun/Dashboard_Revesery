// Definisi menu sidebar. Menambah halaman baru cukup tambahkan entri di sini
// dan daftarkan route di App.tsx.
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, Database, ScatterChart, Trees,
  Sparkles, Lightbulb, Target, GraduationCap,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, section: "Ringkasan" },
  { to: "/dataset", label: "Dataset", icon: Database, section: "Data" },
  { to: "/eda", label: "Exploratory Data Analysis", icon: ScatterChart, section: "Data" },
  { to: "/random-forest", label: "Random Forest", icon: Trees, section: "Pemodelan" },
  { to: "/shap", label: "Explainable AI (SHAP)", icon: Sparkles, section: "Pemodelan" },
  { to: "/insight", label: "Business Insight", icon: Lightbulb, section: "Bisnis" },
  { to: "/retention", label: "Strategi Retensi", icon: Target, section: "Bisnis" },
  { to: "/about", label: "Tentang Penelitian", icon: GraduationCap, section: "Info" },
];
