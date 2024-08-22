import "./globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import ModalProvider from "@/components/modal-provider";
import ToasterProvider from "@/components/toaster-provider";
import CrispProvider from "@/components/crisp-provider";
import I18nInitializer from "@/components/I18nInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stellar Ai",
  description: "Job Seekers Dream AI Tool."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" />
        </head>
        <CrispProvider />
        <body className={inter.className}>
          <I18nInitializer />
          <ModalProvider />
          <ToasterProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
