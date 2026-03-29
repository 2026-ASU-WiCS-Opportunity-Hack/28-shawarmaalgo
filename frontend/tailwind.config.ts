import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0c3f63",
          teal: "#1aa3a8",
          gold: "#d6ad3a",
          sand: "#f7f3ea",
          ink: "#18364d"
        }
      },
      boxShadow: {
        soft: "0 12px 28px rgba(12, 63, 99, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
