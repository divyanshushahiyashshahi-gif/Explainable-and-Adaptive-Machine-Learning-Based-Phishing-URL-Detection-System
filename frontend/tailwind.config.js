/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#080c14",
          card: "#0f172a",
          cardHover: "#131e36",
          border: "#1e293b",
          borderLight: "#334155",
          accent: "#06b6d4", // cyan
          accentHover: "#0891b2",
          emerald: "#10b981",
          emeraldDark: "#064e3b",
          crimson: "#ef4444",
          crimsonDark: "#450a0a",
          warning: "#f59e0b",
          muted: "#94a3b8",
          subtle: "#64748b"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'cyber-sm': '0 0 15px -3px rgba(6, 182, 212, 0.15)',
        'cyber-md': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'danger-glow': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'safe-glow': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
