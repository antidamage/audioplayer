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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        '7xl': '3800px',
        '6xl': '3200px',
        '5xl': '2600px',
        '4xl': '2200px',
        '3xl': '1800px',
        'xs': '600px',
        '2xs': '550px',
        '3xs': '500px',
        '4xs': '450px',
        '5xs': '400px',
        '6xs': '350px',
        '7xs': '300px',
      },
    },
  },
  plugins: [],
  darkMode: 'selector',
}
export default config;  