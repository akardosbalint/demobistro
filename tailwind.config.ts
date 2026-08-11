import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Zöld Sarok brand palette
        avocado: {
          50: "#f2f6ec",
          100: "#e1ebd2",
          200: "#c5d8a9",
          300: "#a2c078",
          400: "#82a952",
          500: "#5f7f3a",
          600: "#49632c",
          700: "#394d24",
          800: "#2e3d20",
          900: "#26331d",
          950: "#131c0d",
        },
        clay: {
          50: "#faf5f0",
          100: "#f2e6d8",
          200: "#e3c9ae",
          300: "#d1a67c",
          400: "#c08554",
          500: "#a86a3c",
          600: "#8a5330",
          700: "#6d4029",
          800: "#573425",
          900: "#472c21",
          950: "#261610",
        },
        cream: {
          DEFAULT: "#f8f3e9",
          50: "#fffdf9",
          100: "#f8f3e9",
          200: "#f0e6d2",
          300: "#e6d5b3",
        },
        gold: {
          DEFAULT: "#c19a4b",
          50: "#faf5ea",
          100: "#f1e2bd",
          200: "#e2c583",
          300: "#d3aa5a",
          400: "#c19a4b",
          500: "#a67f3a",
          600: "#82632c",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        organic: "63% 37% 54% 46% / 43% 41% 59% 57%",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "gentle-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gentle-pulse": "gentle-pulse 2.2s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
      backgroundImage: {
        "leaf-texture":
          "radial-gradient(circle at 20% 20%, rgba(95,127,58,0.06) 0%, transparent 45%), radial-gradient(circle at 80% 60%, rgba(193,154,75,0.08) 0%, transparent 45%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
