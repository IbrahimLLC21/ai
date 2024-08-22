// app/page.tsx
"use client"; // Ensure this is a client component if it uses hooks like useTranslation

import React from "react";
import LandingHero from "@/components/landing-hero";
import LandingNavbar from "@/components/landing-navbar";
import LandingContent from "@/components/landing-content";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Import LanguageSwitcher
import { useTranslation } from 'next-i18next';

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="h-full">
      <LandingNavbar />
      <LanguageSwitcher /> {/* Add LanguageSwitcher here */}
      <LandingHero />
      <LandingContent />
    </div>
  );
}
