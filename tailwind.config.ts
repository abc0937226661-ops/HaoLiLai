
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
                background: "#020617", // Very dark blue/black
                foreground: "#F8FAFC", // Slate 50
                primary: {
                    DEFAULT: "#F59E0B", // Amber 500 (Gold)
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#1E293B", // Slate 800
                    foreground: "#FFFFFF",
                },
                accent: {
                    DEFAULT: "#06B6D4", // Cyan 500 (Neon)
                    foreground: "#FFFFFF",
                },
                muted: {
                    DEFAULT: "#334155",
                    foreground: "#94A3B8"
                },
                border: "#1E293B",
                card: "#0F172A", // Slate 900
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
            },
            fontFamily: {
                sans: ['"Noto Sans TC"', '"Inter"', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #1e1b4b 0deg, #312e81 180deg, #1e1b4b 360deg)',
            }
        },
    },
    plugins: [],
};
export default config;
