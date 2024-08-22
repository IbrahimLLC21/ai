"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, FileText, Pencil, Plus, Minus } from 'lucide-react';
import { useTranslation } from 'next-i18next';

const features = [
  {
    label: "interviewLabel",
    icon: <MessageSquare className="h-6 w-6 text-violet-500" />,
    description: "interviewDescription",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "resumeLabel",
    icon: <FileText className="h-6 w-6 text-emerald-500" />,
    description: "resumeDescription",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "coverLetterLabel",
    icon: <Pencil className="h-6 w-6 text-pink-700" />,
    description: "coverLetterDescription",
    bgColor: "bg-pink-700/10",
  },
];

const faqs = [
  {
    question: "faq1Question",
    answer: "faq1Answer",
  },
  {
    question: "faq2Question",
    answer: "faq2Answer",
  },
  {
    question: "faq3Question",
    answer: "faq3Answer",
  }
];

export default function LandingContent() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        {t('featuresTitle')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-center mx-auto">
        {features.map((item) => (
          <Card
            key={item.label}
            className={`border-none text-white ${item.bgColor}`}
          >
            <CardHeader>
              <div className="flex flex-row items-center">
                <div className="mr-4">
                  {item.icon}
                </div>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{t(item.label)}</p>
                  </div>
                </CardTitle>
              </div>
              <CardContent className="pt-4 px-0">
                {t(item.description)}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <h2 className="text-center text-4xl text-white font-extrabold mb-10">
          {t('faqsTitle')}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800 text-white p-4 rounded-lg border border-gray-700 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{t(faq.question)}</h3>
                <div className="text-2xl">
                  {openIndex === index ? <Minus /> : <Plus />}
                </div>
              </div>
              {openIndex === index && (
                <p className="mt-4 text-gray-300">{t(faq.answer)}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Privacy Policy, Terms of Use, and Support Email */}
      <div className="mt-10 text-center text-gray-400">
        <p className="mb-2">
          <a href="/privacy-policy.html" className="hover:underline">
            {t('privacyPolicy')}
          </a>
        </p>
        <p>
          <a href="/terms-of-use.html" className="hover:underline">
            {t('termsAndConditions')}
          </a>
        </p>
        <p className="mt-4">
          Support Email: <a href="mailto:support@stellarai.net" className="hover:underline">support@stellarai.net</a>
        </p>
      </div>
    </div>
  );
}
