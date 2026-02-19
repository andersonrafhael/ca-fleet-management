import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { MSWProvider } from '@/components/MSWProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Gestão de Transporte | Prefeitura Campo Alegre',
    template: '%s | Transporte Campo Alegre',
  },
  description:
    'Sistema municipal de gestão do transporte universitário de Campo Alegre (AL).',
  robots: 'noindex',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body>
        <MSWProvider>{children}</MSWProvider>
      </body>
    </html>
  )
}
