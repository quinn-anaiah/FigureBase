/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        mainPurple: '#552586',
        lightPurple: '#B589D6',
        extraLightPurple: '#cdafe3',
        titlePurple: '#9969C7',
      },
    },
  },
  plugins: [],
}

