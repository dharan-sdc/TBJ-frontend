/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"]
    },
    extend: {
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E"
      },
      backgroundImage: {
        'login-bg-img': "url('./src/assets/images/login2.png')",
        'signup-bg-img': "url('./src/assets/images/login3.png')"
      }
    },
  },
  plugins: [],
}

