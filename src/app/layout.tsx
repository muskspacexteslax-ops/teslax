import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TeslaXProvider } from "@/context/TeslaXContext";
import { BootScreen } from "@/components/BootScreen";
import { Toast } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "TeslaX — Everyone should own a Tesla",
  description:
    "TeslaX is a membership platform built on a circular model: lease, recover, refurbish, re-lease. Every model from the Original Roadster to the Cybertruck, split into instalments.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Cg fill='%23fff'%3E%3Cpath d='M12 34C29 19 71 19 88 34L80.5 44.5C65.5 33.4 34.5 33.4 19.5 44.5Z'/%3E%3Cpath d='M49.5 47 56.8 47 55 88C54.9 89.9 53.6 89.9 53.5 88Z'/%3E%3C/g%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body>
        <TeslaXProvider>
          <BootScreen />
          <Navbar />
          {children}
          <Toast />
        </TeslaXProvider>
      </body>
    </html>
  );
}
