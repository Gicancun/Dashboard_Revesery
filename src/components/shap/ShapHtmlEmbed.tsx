// Menampilkan HTML SHAP hasil export dari Google Colab (mis. force plot
// interaktif). Dirender di dalam iframe (srcDoc) agar terisolasi & aman.
export function ShapHtmlEmbed({ html, height = 220 }: { html: string; height?: number }) {
  return (
    <iframe
      title="SHAP HTML export"
      srcDoc={html}
      className="w-full rounded-xl border border-border bg-white"
      style={{ height }}
      sandbox="allow-scripts"
    />
  );
}
