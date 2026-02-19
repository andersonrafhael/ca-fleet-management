/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // ───── Campo Alegre brand ─────
                brand: {
                    blue: '#0000FF', // Azul institucional principal
                    'blue-mid': '#0099DD', // Azul médio (arco do coração)
                    'blue-light': '#66CCFF', // Azul claro (arco externo)
                    red: '#DD1111', // Vermelho coração
                    orange: '#EE6600', // Laranja coração
                    yellow: '#FFCC00', // Amarelo coração
                    green: '#00AA44', // Verde coração
                },
                // ───── Semantic (admin UI) ─────
                primary: {
                    DEFAULT: '#0000FF',
                    foreground: '#FFFFFF',
                    hover: '#0000CC',
                    muted: '#E8E8FF',
                },
                sidebar: {
                    DEFAULT: '#0F172A',
                    foreground: '#F1F5F9',
                    accent: '#1E293B',
                    border: '#1E293B',
                },
                // ───── shadcn/ui overrides ─────
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
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
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
