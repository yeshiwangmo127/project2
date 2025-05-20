import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import FooterWrapper from './components/FooterWrapper'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hospital Management System',
  description: 'A modern hospital management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const noBgPages = ['/login', '/register', '/select-user-type'];
  const isNoBgPage = noBgPages.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" />
      </head>
      <body className={inter.className} style={isNoBgPage ? {} : { backgroundColor: '#7ea6f7' }}>
        <Navbar />
        {children}
        <FooterWrapper />
      </body>
    </html>
  )
}