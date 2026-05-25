/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#030712',
        'cyber-green': '#00FF88',
        'cyber-cyan': '#00D4FF',
        'cyber-card': 'rgba(17, 24, 39, 0.7)',
        'accent-warning': '#EF4444',
        'accent-ai': '#A855F7',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
