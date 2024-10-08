/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/svg component/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      xs: "350px",
      sm: "640px",
      md: "768px",
      mod: "920px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      fontFamily: {
        roboto: "Roboto Mono",
      },
      gridTemplateColumns: {
        themesLayout: "repeat(auto-fill, minmax(290px, 1fr))",
        allTimeStatsLayout:
          "repeat(var(--max-col), minmax(var(--min-item-size), 1fr))",
      },
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        tertiary: "var(--tertiary-color)",
        bgColor: "var(--bg-color)",
        bgSecondary: "var(--bg-secondary-color)",
        error: "var(--error-color)",
        extra: "var(--extra-color)",
      },
      animation: {
        blink: "blink 1s linear infinite",
        fadeIn: "fadeIn 100ms linear",
      },
      keyframes: {
        blink: {
          "0%": { opacity: "1" },
          "25%": { opactiy: "0.7" },
          "50%": { opacity: "0" },
          "75%": { opactiy: "0.7" },
          "100%": { opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
