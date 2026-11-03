import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#D34A43", dark: "#B33C36", soft: "#FBEDEC" },
        charcoal: { DEFAULT: "#333333", soft: "#6B6B6B" },
        line: "#E8E6E3",
      },
      fontFamily: { sans: ["var(--font-montserrat)", "system-ui", "sans-serif"] },
      maxWidth: { page: "76rem" },
    },
  },
  plugins: [],
};

export default config;
