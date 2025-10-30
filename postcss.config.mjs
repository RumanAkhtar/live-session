/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ Correct for Tailwind v4+
    autoprefixer: {},
  },
}

export default config
