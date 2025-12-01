import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import "./globals.css"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata: Metadata = {
  title: "Proyecto Eléctrico — Agustín Arancibia",
  description: "Propuesta de servicios eléctricos profesionales",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ConvexProvider client={convex}>
          {children}
        </ConvexProvider>
        <Analytics />
      </body>
    </html>
  )
}
