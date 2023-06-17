import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
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
                <Script id="clarity" strategy="beforeInteractive">
                    {`(function (c, l, a, r, i, t, y) {
                        c[a] =
                            c[a] ||
                            function () {
                                (c[a].q = c[a].q || []).push(arguments);
                            };
                        t = l.createElement(r);
                        t.async = 1;
                        t.src = "https://www.clarity.ms/tag/" + i;
                        y = l.getElementsByTagName(r)[0];
                        y.parentNode.insertBefore(t, y);
                    })(window, document, "clarity", "script", "hlbulvh8qz")`}
                </Script>
            </body>
        </html>
    );
}
