import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
] as const;

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      className={`
        rounded-md
        border
        border-${theme.colors.divider}
        bg-${theme.colors.background.paper}
        text-${theme.colors.text.primary}
        px-2
        py-1
        text-sm
        focus:outline-none
        focus:ring-1
        focus:ring-${theme.colors.primary}
      `}
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
} 