import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Summary AI",
  description: "HNG stage three frontend task",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="origin-trial"
          content="Ag6CSywx7oLBG41uTH5TneQferGab1JDyLCThlrhKR09x6mmFdGF7IbEhhi9CQ7VMRn/by0Qhp56i0ZYi9GZowUAAAB+eyJvcmlnaW4iOiJodHRwczovL3RleHQtcHJvY2Vzc29yLXRlbi52ZXJjZWwuYXBwOjQ0MyIsImZlYXR1cmUiOiJMYW5ndWFnZURldGVjdGlvbkFQSSIsImV4cGlyeSI6MTc0OTU5OTk5OSwiaXNTdWJkb21haW4iOnRydWV9"
        />
        <meta
          httpEquiv="origin-trial"
          content="AocrHB8wi5US+uLW/2WtzVXrIunntty9OxNH2G5S7IO4fZZDzgXG6eTqw1ywS5qIUd6iXnk9C4Ap3CUqqu4Z6QkAAAB4eyJvcmlnaW4iOiJodHRwczovL3RleHQtcHJvY2Vzc29yLXRlbi52ZXJjZWwuYXBwOjQ0MyIsImZlYXR1cmUiOiJUcmFuc2xhdGlvbkFQSSIsImV4cGlyeSI6MTc1MzE0MjQwMCwiaXNTdWJkb21haW4iOnRydWV9"
        />
        <meta
          httpEquiv="origin-trial"
          content="Ar3P3h+DX4tFswNEoXqNeY34suFaA99KVBdRXPWJ9e0FO1sXlZvH5zberFJ6GJcyvl+MjaD5dtYNqKHcrFGkDAUAAAB8eyJvcmlnaW4iOiJodHRwczovL3RleHQtcHJvY2Vzc29yLXRlbi52ZXJjZWwuYXBwOjQ0MyIsImZlYXR1cmUiOiJBSVN1bW1hcml6YXRpb25BUEkiLCJleHBpcnkiOjE3NTMxNDI0MDAsImlzU3ViZG9tYWluIjp0cnVlfQ=="
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
