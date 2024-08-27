"use client"; // Ensure this component is used in a client-side context

import { useRouter } from 'next/navigation';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locale = e.target.value;

    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(locale);
      router.replace(`${currentPath}?lang=${locale}`);
    } else {
      console.error('changeLanguage method is not available on i18n');
    }
  };

  return (
    <div className="flex justify-end p-4">
      <select
        id="language-switcher" // Added id attribute
        name="language" // Added name attribute
        value={i18n.language}
        onChange={handleChange}
        className="bg-gray-800 text-white border border-gray-600 p-2 rounded"
        autoComplete="off" // Optional: ensures autocomplete is off
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="zh">中文</option>
        <option value="ar">العربية</option>
        <option value="nl">Nederlands</option>
        <option value="vi">Tiếng Việt</option>
        <option value="hu">Magyar</option>
        <option value="bs">Bosanski</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
