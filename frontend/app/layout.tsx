import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google"; 
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Paggo OCR",
  description: "Sistema de leitura de documentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      {/* 3. Adicione a variável da fonte aqui no body */}
      <body className={`${inter.className} ${montserrat.variable}`}>{children}</body>
    </html>
  );
}