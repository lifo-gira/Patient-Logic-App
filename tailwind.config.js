/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/react/utils/withMT";
export default withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors:{
      pixelf:'#7f35f8',
      pixele:'#ff0cf5',
      darkblue:'#4D75C9',
      navyblue:'#292F3C',
      blackblue:'#22262F',
      blue1: "#0b263d",
      blue2: "#113d61"
  },
  keyframes: {
    blink: {
      "0%, 100%": { borderWidth: "7px", borderRadius: "150%" },
      "50%": { borderColor: "#7CB9E8", borderRadius: "150%" }, // Replace with the color of your choice
    },
  },
  animation: {
    blink: "blink 1s infinite",
  },
},
  },
  plugins: [],
});