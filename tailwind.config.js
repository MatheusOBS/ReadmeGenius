/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#a1a1aa', // zinc-400
            a: {
              color: '#6366f1', // indigo-500
              '&:hover': {
                color: '#818cf8', // indigo-400
              },
            },
            h1: { color: '#f4f4f5' },
            h2: { color: '#f4f4f5' },
            h3: { color: '#f4f4f5' },
            h4: { color: '#f4f4f5' },
            code: { color: '#f4f4f5' },
            strong: { color: '#f4f4f5' },
            blockquote: { color: '#f4f4f5' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
