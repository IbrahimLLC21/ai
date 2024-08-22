"use client"; // Add this directive

import { useEffect } from "react";
import i18n from "@/lib/i18n";

const I18nInitializer = () => {
  useEffect(() => {
    // Ensure i18n is initialized on the client side
    i18n.changeLanguage("en"); // Set default language or use user preference
  }, []);

  return null;
};

export default I18nInitializer;
