import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './providers/AuthProvider'
import { ConfirmationProvider } from './providers/ConfirmationProvider'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EventEase - Event Management Platform',
  description: 'Discover and manage amazing events with EventEase',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConfirmationProvider>
            {children}
            <Toaster position="top-right" />
          </ConfirmationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
