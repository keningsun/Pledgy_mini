import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'worldcoin-primary': '#000',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#000000',
          secondary: '#F6F6F6',
        },
      },
    ],
  },
  plugins: [daisyui],
};
export default config;
