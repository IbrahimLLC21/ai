// app/layout.tsx
"use client"; // Add this to mark the component as a client component

import React from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n'; 

export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <I18nextProvider i18n={i18n}>
      <main className="h-full bg-[#111827] overflow-auto">
        <div className="mx-auto max-w-screen-xl h-full w-full">{children}</div>
      </main>
    </I18nextProvider>
  );
}
