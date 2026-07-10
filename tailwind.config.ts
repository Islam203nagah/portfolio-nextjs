import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 20px 80px rgba(15, 23, 42, 0.08)",
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(79, 70, 229, 0.16), transparent 45%)",
      },
    },
  },
  plugins: [],
};

export default config;
