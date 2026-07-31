// Kartu dasar dengan shadow lembut + animasi masuk (Framer Motion).
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function Card({ children, className = "", delay = 0, hover = false }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`card p-5 ${hover ? "transition-shadow hover:shadow-card-hover" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/** Header kecil di dalam kartu: judul + subjudul opsional + aksi kanan. */
export function CardHeader({
  title, subtitle, right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}
