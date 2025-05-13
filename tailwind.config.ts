import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        orbitron: ["var(--font-orbitron)", "sans-serif"],
      },
      colors: {
        'chat-bg': '#202123',
        'chat-input-bg': '#40414f',
        'chat-bubble-user': '#343541',
        'chat-bubble-assistant': '#444654',
        'button-bg': '#343541',
        'button-hover-bg': '#40414f',
      },
      maxWidth: {
        '900': '900px',
      },
      padding: {
        '4': '1rem', // Corresponds to p-4 in Tailwind default scale (1rem = 16px)
      }
    },
  },
  plugins: [],
};
export default config;

