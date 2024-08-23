"use client";

import React from "react";
import TypewriterComponent from "typewriter-effect";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'next-i18next';

export default function LandingHero() {
  const { isSignedIn } = useAuth();
  const { t } = useTranslation();

  // Type assertion to specify the type of the strings array
  const typewriterStrings: string[] = t('typewriterStrings', { returnObjects: true }) as string[];

  return (
    <div className="text-white font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>{t('heroTitle')}</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          <TypewriterComponent
            options={{
              strings: typewriterStrings, // Use the type assertion here
              autoStart: true,
              loop: true
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400">
        {t('subText')}
      </div>
      <div>
        <Link href={isSignedIn ? "/dashboard" : "/sign-up"}>
          <Button
            variant="premium"
            className="md:text-lg p-4 md:p-6 rounded-full font-semibold"
          >
            {t('buttonText')}
          </Button>
        </Link>
      </div>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        {t('creditCardNotice')}
      </div>
    </div>
  );
}
