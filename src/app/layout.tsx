import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "GTI – General Transport International | Freight & Logistics Portal",
  description: "Portail logistique et calculateur de devis instantané pour le fret maritime, aérien et routier mondial.",
  keywords: "transport international, calcul devis fret, fret maritime, fret aerien, transport routier, GTI maroc, gestion des ports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-[#009FE3]/20 selection:text-[#006FA3]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
