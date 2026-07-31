/// <reference types="vite/client" />

// plotly.js-dist-min tidak menyertakan tipe; pinjam tipe dari plotly.js.
declare module "plotly.js-dist-min" {
  import type Plotly from "plotly.js";
  const value: typeof Plotly;
  export default value;
}
