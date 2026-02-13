import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Astra - Cloud Architecture Design Platform',
    description: 'Design and visualize cloud architectures with AI-powered assistance',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
