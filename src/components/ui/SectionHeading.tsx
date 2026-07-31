// Judul halaman dengan eyebrow (label kategori) — konsisten di setiap page.
import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow, title, description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <span className="chip bg-brand/10 text-brand">{eyebrow}</span>
      <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        {title}
      </h1>
      {description && <p className="mt-2 max-w-3xl text-sm text-muted sm:text-base">{description}</p>}
    </motion.header>
  );
}
