import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "Kadrianos",
  description: "Moje osobiste narzędzie AI do pracy nad sobą i poszukiwania pracy",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="bg-[#202123] text-white font-sans">
        {children}
      </body>
    </html>
  );
}

