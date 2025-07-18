import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css" // Corrected import path
import { Providers } from "@/components/providers" // Corrected import path

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NextGen Food Court - African Cuisine",
  description: "Discover authentic African cuisines from various outlets",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {" "}
          {/* Wrap all children with the Providers component */}
          <div className="min-h-screen bg-background">{children}</div>
        </Providers>
      </body>
    </html>
  )
}
