/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          mabry: ["Mabry", "sans-serif"],
          mabrylight: ["MabryLight", "sans-serif"],
        },
      },
    },
    daisyui: {
      themes: [
        {
          light: {
            "primary": "#003d2d",        // pinegreen
            "secondary": "#95c672",      // mossgreen
            "accent": "#f1e967",         // sunlightyellow
            "neutral": "#eebbca",        // petalpink
            "base-100": "#ffffff",       // white
            "base-200": "#f1f6f5",       // navbargray
            "base-300": "#efefef",       // lightgray
            "base-content": "#003d2d",   // text color (pinegreen)
            "info": "#92afa5",           // breadtext
            "--rounded-btn": "0.5rem",
            
            // Adding extra colors that don't fit in DaisyUI's defaults
            "--color-pinegreen-footer": "#1a4538",
            "--color-midgray": "#cccccc",
          },
          dark: {
            "primary": "#95c672",        // mossgreen (swapped)
            "secondary": "#003d2d",      // pinegreen (swapped)
            "accent": "#f1e967",         // sunlightyellow
            "neutral": "#eebbca",        // petalpink
            "base-100": "#1a1a1a",       // dark background
            "base-200": "#2a2a2a",       // darker gray
            "base-300": "#333333",       // darkest gray
            "base-content": "#ffffff",   // text color (white)
            "info": "#92afa5",           // breadtext
            "--rounded-btn": "0.5rem",
            
            // Extra colors for dark mode
            "--color-pinegreen-footer": "#95c672",
            "--color-midgray": "#555555",
          }
        }
      ],
    },
    plugins: [require("daisyui")],
  }