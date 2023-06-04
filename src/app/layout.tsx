import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

export const metadata = {
    title: "Risk-Viz",
    description: "Risk visualization application designed and developed by Hin Tong, for Riskthinking.ai.",
    other: { "google-site-verification": "2LN9DEDc4V6MxSyl_z25KsXjm-D39d8SWmubhBCW9Vc" }
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
