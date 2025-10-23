/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 使用更精确的路径模式，避免匹配node_modules
    "../../apps/web/src/**/*.{js,ts,jsx,tsx}",
    "../../apps/backend/**/*.{js,ts}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../packages/api-client/src/**/*.{js,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}