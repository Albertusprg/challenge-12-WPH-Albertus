import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const textSizes = {
  'display-3xl': '3.75rem', // 60px
  'display-2xl': '3rem', // 48px
  'display-xl': '2.5rem', // 40px
  'display-lg': '2.25rem', // 36px
  'display-md': '2rem', // 32px
  'display-sm': '1.75rem', // 28px
  'display-xs': '1.5rem', // 24px
  'text-xl': '1.25rem', // 20px
  'text-lg': '1.125rem', // 18px
  'text-md': '1rem', // 16px
  'text-sm': '0.875rem', // 14px
  'text-xs': '0.75rem', // 12px
} as const;

const lineHeights = {
  'display-3xl': '4.5rem', // 72px
  'display-2xl': '3.75rem', // 60px
  'display-xl': '3.5rem', // 56px
  'display-lg': '3rem', // 48px
  'display-md': '2.875rem', // 46px
  'display-sm': '2.375rem', // 38px
  'display-xs': '2.25rem', // 36px
  'text-xl': '2.125rem', // 34px
  'text-lg': '2rem', // 32px
  'text-md': '1.875rem', // 30px
  'text-sm': '1.75rem', // 28px
  'text-xs': '1.5rem', // 24px
} as const;

const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

type TextSizeKey = keyof typeof textSizes;

const customTextPlugin = plugin(({ addUtilities }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newUtilities: Record<string, any> = {};

  for (const [sizeName, fontSize] of Object.entries(textSizes)) {
    for (const [weightName, weightVal] of Object.entries(fontWeights)) {
      const className = `.${sizeName}-${weightName}`;
      const sizeKey = sizeName as TextSizeKey;
      newUtilities[className] = {
        fontSize: fontSize,
        lineHeight: lineHeights[sizeKey],
        fontWeight: weightVal,
      };
    }
  }

  addUtilities(newUtilities);
});

const customSpacing = {
  none: '0rem',
  xxs: '0.125rem', // 2px
  xs: '0.25rem', // 4px
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.75rem', // 12px
  xl: '1rem', // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem', // 24px
  '4xl': '2rem', // 32px
  '5xl': '2.5rem', // 40px
  '6xl': '3rem', // 48px
  '7xl': '4rem', // 64px
  '8xl': '5rem', // 80px
  '9xl': '6rem', // 96px
  '10xl': '8rem', // 128px
  '11xl': '8.75rem', // 140px
};

const customRadius = {
  none: '0rem',
  xxs: '0.125rem', // 2px
  xs: '0.25rem', // 4px
  sm: '0.375rem', // 6px
  md: '0.5rem', // 8px
  lg: '0.625rem', // 10px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.25rem', // 20px
  '4xl': '1.5rem', // 24px
  full: '9999px',
};

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: customSpacing,
      borderRadius: customRadius,
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          100: '#E5F4FB',
          200: '#96FCFF',
          300: '#0093DD',
          400: '#050A1B',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neutral: {
          25: '#FDFDFD',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E9EAEB',
          300: '#D5D7DA',
          400: '#A4A7AE',
          500: '#717680',
          600: '#535862',
          700: '#414651',
          800: '#252B37',
          900: '#181D27',
          950: '#0A0D12',
        },
        white: '#FFFFFF',
        black: '#000000',
      },
    },
  },
  plugins: [customTextPlugin],
} satisfies Config;
