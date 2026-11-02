import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "var(--bg-main)",
        sidebar: "var(--bg-sidebar)",
        panel: "var(--bg-card)",
        code: "var(--bg-code)",
        accent: "var(--accent)",
        border: "var(--border)",
        foreground: "var(--text-primary)",
        muted: "var(--text-secondary)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
