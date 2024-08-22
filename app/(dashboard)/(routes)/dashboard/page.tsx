// components/DashboardPage.tsx
"use client";

import React from "react";
import {
  ArrowRight,
  MessageSquare,
  Pencil,
  FileText
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';

const tools = [
  {
    key: "interview",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    href: "/interview"
  },
  {
    key: "resume_generation",
    icon: FileText,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    href: "/resume"
  },
  {
    key: "cover_letter_generator",
    icon: Pencil,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: "/cover"
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation(); // useTranslation hook

  return (
    <div>
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center">
          {t('app_name')} 🤖
        </h2>
        <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
          {t('tagline')}
        </p>
      </div>

      <div className="px-4 md:px-20 lg:px-32 space-y-4">
        {tools.map((tool) => (
          <Card
            onClick={() => router.push(tool.href)}
            key={tool.href}
            className="p-4 border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
          >
            <div className="flex items-center gap-x-4">
              <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                <tool.icon className={cn("w-8 h-8", tool.color)} />
              </div>
              <div className="font-semibold">{t(tool.key)}</div>
            </div>
            <ArrowRight className="w-5 h-5" />
          </Card>
        ))}
      </div>
    </div>
  );
}
