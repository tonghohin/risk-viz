import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
    title: "Risk-Viz",
    description: "Risk-Viz"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    );
}
