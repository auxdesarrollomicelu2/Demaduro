/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Demaduro
        primary: {
          DEFAULT: '#FF8C42', // Naranja principal
          light: '#FFB366',
          dark: '#E67A30',
        },
        secondary: {
          DEFAULT: '#0B6E4F', // Verde oscuro
          light: '#0D8A62',
          dark: '#095A40',
        },
        accent: {
          DEFAULT: '#F5EFE6', // Beige/crema fondo
          light: '#FFF5EB',
        },
        dark: {
          DEFAULT: '#2D2318', // Café oscuro
          light: '#3A3226',
        },
        yellow: {
          badge: '#FFD93D', // Amarillo badges
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Poppins', 'sans-serif'], // Títulos y marca: gruesa y redondeada
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}

