// Definisi routing. Menambah halaman: buat komponen page → daftarkan route di sini
// → tambahkan entri menu di src/data/navigation.ts.
import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Dataset from "@/pages/Dataset";
import Eda from "@/pages/Eda";
import RandomForest from "@/pages/RandomForest";
import Shap from "@/pages/Shap";
import BusinessInsight from "@/pages/BusinessInsight";
import Retention from "@/pages/Retention";
import About from "@/pages/About";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dataset" element={<Dataset />} />
        <Route path="eda" element={<Eda />} />
        <Route path="random-forest" element={<RandomForest />} />
        <Route path="shap" element={<Shap />} />
        <Route path="insight" element={<BusinessInsight />} />
        <Route path="retention" element={<Retention />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}
