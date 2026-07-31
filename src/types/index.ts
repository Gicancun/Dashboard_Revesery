/**
 * Kontrak data (schema) untuk seluruh file JSON hasil export dari Google Colab.
 *
 * Prinsip modularitas: selama file JSON di /public/data mengikuti bentuk
 * interface di bawah ini, website akan otomatis menampilkannya tanpa perlu
 * mengubah kode. Setiap file punya interface-nya sendiri.
 */

/* ----------------------------- metrics.json ----------------------------- */
export interface Metrics {
  total_customers: number;
  churned_customers: number;
  churn_rate: number; // 0..1
  active_customers: number;
  model: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
    roc_auc: number;
  };
  // Tren jumlah customer per periode (mis. bulan)
  customer_trend: { label: string; total: number; churned: number }[];
  // Kurva ROC
  roc_curve: { fpr: number[]; tpr: number[] };
  // Kurva Precision-Recall
  pr_curve: { recall: number[]; precision: number[] };
  // Confusion matrix [[TN, FP], [FN, TP]]
  confusion_matrix: number[][];
  confusion_labels?: string[];
  // Learning curve (opsional)
  learning_curve?: {
    train_sizes: number[];
    train_scores: number[];
    val_scores: number[];
  };
}

/* ----------------------------- dataset.json ----------------------------- */
export interface DatasetInfo {
  n_rows: number;
  n_features: number;
  missing_values: number;
  duplicates: number;
  target: string;
  class_distribution: { label: string; count: number }[];
  columns: { name: string; dtype: string; description?: string }[];
  // Baris preview mentah — key mengikuti nama kolom.
  preview: Record<string, string | number>[];
}

/* ------------------------------- eda.json ------------------------------- */
export interface HistogramData {
  feature: string;
  bins: string[]; // label bin, mis. "20-29"
  counts: number[];
  by_class?: { churn: number[]; retain: number[] }; // opsional bertumpuk
}
export interface CategoricalDist {
  feature: string;
  categories: string[];
  churn: number[];
  retain: number[];
}
export interface BoxplotData {
  feature: string;
  groups: { label: string; min: number; q1: number; median: number; q3: number; max: number }[];
}
export interface Heatmap {
  labels: string[];
  matrix: number[][]; // korelasi -1..1
}
export interface EdaData {
  churn_distribution: { label: string; count: number }[];
  categorical: CategoricalDist[];
  histograms: HistogramData[];
  boxplots: BoxplotData[];
  correlation: Heatmap;
  missing_matrix?: { columns: string[]; missing_pct: number[] };
}

/* ------------------------ feature_importance.json ----------------------- */
export interface FeatureImportance {
  features: { name: string; importance: number }[];
  method?: string;
}

/* ------------------------------- shap.json ------------------------------ */
export interface ShapData {
  // Rata-rata |SHAP| per fitur untuk bar plot global
  global_importance: { feature: string; value: number }[];
  // Titik-titik summary (beeswarm): per fitur, nilai shap & nilai fitur ternormalisasi
  summary: {
    feature: string;
    shap_values: number[];
    feature_values: number[]; // 0..1 (untuk warna)
  }[];
  // Waterfall untuk satu prediksi lokal
  waterfall: {
    base_value: number;
    prediction: number;
    contributions: { feature: string; value: number; feature_value?: string | number }[];
  };
  // Force plot (representasi ringkas berbasis kontribusi)
  force?: {
    base_value: number;
    prediction: number;
    features: { feature: string; value: number; feature_value?: string | number }[];
  };
  // Decision plot: jalur akumulasi beberapa sampel
  decision?: {
    base_value: number;
    features: string[];
    paths: { label: string; cumulative: number[] }[];
  };
  // Dependence plot untuk satu fitur
  dependence?: {
    feature: string;
    x: number[];
    shap: number[];
    color_feature?: string;
    color?: number[];
  };
  // Alternatif: HTML mentah hasil export shap.save_html() dari Colab
  html?: {
    summary?: string;
    force?: string;
    [key: string]: string | undefined;
  };
}

/* ----------------------------- insight.json ----------------------------- */
export interface InsightData {
  top_factors: {
    feature: string;
    impact: number; // besar pengaruh
    direction: "increase" | "decrease"; // menaikkan/menurunkan risiko churn
    description: string;
  }[];
  dominant_factor: { feature: string; description: string };
  narrative: string[];
}

/* ---------------------------- retention.json ---------------------------- */
export interface RetentionStrategy {
  id: string;
  title: string;
  icon: string; // nama ikon lucide (mis. "Gift")
  target_segment: string;
  description: string;
  linked_factors: string[]; // fitur SHAP terkait
  priority: "Tinggi" | "Sedang" | "Rendah";
  expected_impact: string;
}
export interface RetentionData {
  segments?: { name: string; size: number; churn_risk: number }[];
  strategies: RetentionStrategy[];
}

/* --------------------------- meta penelitian ---------------------------- */
export interface ResearchMeta {
  title: string;
  researcher: string;
  student_id?: string;
  advisor?: string;
  university: string;
  faculty?: string;
  program?: string;
  year: number;
  method: string;
  algorithm: string;
  xai: string;
  dataset_source: string;
  flow: { step: string; detail: string }[];
}
