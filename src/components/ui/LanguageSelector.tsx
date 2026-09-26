"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageSelector() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center rounded-md border border-slate-300 bg-white p-0.5 shadow-sm">
      <span className="px-1.5 text-slate-400">
        <Languages className="w-3.5 h-3.5" />
      </span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
          locale === "en"
            ? "bg-gov-navy text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLocale("hi")}
        className={`px-2 py-0.5 text-xs font-semibold rounded transition ${
          locale === "hi"
            ? "bg-gov-navy text-white shadow-xs"
            : "text-slate-600 hover:text-slate-900"
        }`}
        aria-label="हिंदी में बदलें"
      >
        हिन्दी
      </button>
    </div>
  );
}
