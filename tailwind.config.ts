// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        'gutter': '12px',       // gutter 12px
      },
      fontFamily: {
        sans: ["SUIT", "Arial", "Helvetica", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: {
          DEFAULT: "#ffffff",
          25: "rgba(255, 255, 255, 0.25)", // 25% 투명도 적용된 white
        },
        black: {
          DEFAULT: "#121212",
          70: "rgba(18, 18, 18, 0.7)", // 70% 투명도 적용된 black
        },
        gray: {
          1: "#F3F6F9",
          2: "#EDF0F4",
          3: "#DEE3EA",
          4: "#CBD3DC",
          5: "#B1BAC5",
          6: "#98A4B1",
          7: "#828D9A",
          8: "#6B7785",
          9: "#535D68",
          10: "#373F48",
          11: "#272D34",
          12: "#1A1E22",
        },
        main: {
          pink: {
            DEFAULT: "#FF006A",
            15: "rgba(255, 0, 106, 0.15)", // 15% 투명도 적용된 main pink
          },    
        },
        sub: {
          palePink: {
            DEFAULT: "#FFCCE1",
            55: "rgba(255, 204, 225, 0.55)", // 55% 투명도 적용된 sub pale pink
          },
          pink: {
            DEFAULT: "#FF80B4",
            40: "rgba(255, 128, 180, 0.4)", // 40% 투명도 적용된 sub pink
            55: "rgba(255, 128, 180, 0.55)", // 55% 투명도 적용된 sub pink
          },
          yellow: {
            DEFAULT: "#FDD853",
            55: "rgba(253, 216, 83, 0.55)", // 55% 투명도 적용된 sub yellow
            20: "rgba(253, 216, 83, 0.2)", // 20% 투명도 적용된 sub yellow
          },
          mint: {
            DEFAULT: "#11EBC5",
            55: "rgba(17, 235, 197, 0.55)", // 55% 투명도 적용된 sub mint
            15: "rgba(17, 235, 197, 0.15)", // 15% 투명도 적용된 sub mint
          },
          blue: {
            DEFAULT: "#3D5BF5",
            40: "rgba(61, 91, 245, 0.4)", // 40% 투명도 적용된 sub blue
            15: "rgba(61, 91, 245, 0.15)", // 15% 투명도 적용된 sub blue
          },
        },
      },
      boxShadow: {
        DEFAULT: "0px 0px 12px 0px rgba(0, 0, 0, 0.08)",
      },
      fontSize: {
        // Headline styles
        "headline-1": [
          "32px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "headline-2": [
          "28px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "headline-3": [
          "24px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "headline-4": [
          "24px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "600" },
        ], // SemiBold
        "headline-5": [
          "20px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "600" },
        ], // SemiBold

        // Subhead styles
        "subhead-bold": [
          "18px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "subhead-med": [
          "18px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "500" },
        ], // Medium

        // Body styles
        "body-1-bold": [
          "16px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "body-1-med": [
          "16px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "500" },
        ], // Medium
        "body-2-bold": [
          "14px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "700" },
        ], // Bold
        "body-2-med": [
          "14px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "500" },
        ], // Medium
        "body-2-reg": [
          "14px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "400" },
        ], // Regular

        // Caption styles
        "caption-bold": [
          "12px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "600" },
        ], // SemiBold
        "caption-med": [
          "12px",
          { lineHeight: "145%", letterSpacing: "-0.001em", fontWeight: "500" },
        ], // Medium
      },
      // Gradient
      backgroundImage: {
        'gradient-35-pink': "linear-gradient(180deg, rgba(255, 204, 225, 0.35) 0%, rgba(255, 0, 106, 0.35) 100%))",
      }
    },
  },
  plugins: [],
};

export default config;
