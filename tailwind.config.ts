import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: "#1e1e1e",
          sidebar: "#252526",
          activeTab: "#1e1e1e",
          inactiveTab: "#2d2d2d",
          border: "#333333",
          status: "#007acc",
          text: "#cccccc",
          textBright: "#ffffff",
        },
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.4)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 25px rgba(59, 130, 246, 1), 0 0 50px rgba(59, 130, 246, 0.7)",
            transform: "scale(1.03)",
          },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
