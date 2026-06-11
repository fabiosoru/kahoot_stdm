import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quiz - Journée Santé & Sécurité",
  description: "Quiz interactif Champagne Mobilités",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
