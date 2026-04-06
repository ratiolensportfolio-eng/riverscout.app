import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        river: {
          DEFAULT: '#1D9E75',
          dark: '#085041',
          mid: '#9FE1CB',
          light: '#E1F5EE',
        },
        water: {
          DEFAULT: '#185FA5',
          light: '#E6F1FB',
          mid: '#B5D4F4',
        },
        amount: {
          DEFAULT: '#BA7517',
          light: '#FAEEDA',
        },
        danger: {
          DEFAULT: '#A32D2D',
          light: '#FCEBEB',
        },
        low: {
          DEFAULT: '#533AB7',
          light: '#EEEDFE',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
