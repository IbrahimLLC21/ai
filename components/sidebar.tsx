"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";
import { Montserrat } from "next/font/google";
import { useTranslation } from "next-i18next";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Pencil,
  Settings
} from "lucide-react";

import { cn } from "@/lib/utils";
import FreeCounter from "@/components/free-counter";
import LanguageSwitcher from "@/components/LanguageSwitcher"; // Import the LanguageSwitcher

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

export default function Sidebar({
  apiLimitCount = 0,
  isPro = false
}: {
  apiLimitCount: number;
  isPro: boolean;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-sky-500"
    },
    {
      label: t("interview_assistant"),
      icon: MessageSquare,
      href: "/interview",
      color: "text-violet-500"
    },
    {
      label: t("cover_letter_generator"),
      icon: Pencil,
      href: "/cover",
      color: "text-pink-700"
    },
    {
      label: t("resume_generator"),
      icon: FileText,
      href: "/resume",
      color: "text-emerald-500"
    },
    {
      label: t("settings"),
      icon: Settings,
      href: "/settings"
    }
  ];

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-4">
          <div className="relative w-12 h-12 mr-4">
            <Image fill alt="Logo" src="/logo1.png" />
          </div>
          <h1 className={cn("text-2xl font-bold", montserrat.className)}>
            Stellar.AI
          </h1>
        </Link>
        <LanguageSwitcher /> {/* Language switcher added here */}
        <div className="space-y-1 mt-4">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter isPro={isPro} apiLimitCount={apiLimitCount} />
    </div>
  );
}
