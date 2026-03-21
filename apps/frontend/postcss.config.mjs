const config = {
  plugins: {
    "@tailwindcss/postcss": {
      theme: {
        extend: {
          fontFamily: {
            // font-sans  → IBM Plex Sans  (body text)
            sans: ["IBM Plex Sans", "sans-serif"],
            // font-serif → Playfair Display  (song titles, headings)
            serif: ["Playfair Display", "serif"],
            // font-mono  → IBM Plex Mono  (metadata, labels, timestamps)
            mono: ["IBM Plex Mono", "monospace"],
          },
        },
      },
    },
  },
};

export default config;
