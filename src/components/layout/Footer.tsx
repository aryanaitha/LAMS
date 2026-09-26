"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { ShieldCheck, Mail, Landmark } from "lucide-react";

export function Footer() {
  const { t, locale } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t-2 border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Col 1: System Identification & Disclaimer */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏛️</span>
            <div>
              <p className="font-bold text-white tracking-wide">{t.appShortName}</p>
              <p className="text-[11px] text-slate-400">{t.appName}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {locale === "hi"
              ? "स्मार्ट इंडिया हैकाथॉन 2026 (समस्या SIH26016, ग्रामीण विकास मंत्रालय, भूमि संसाधन विभाग) हेतु विकसित प्रोटोटाइप।"
              : "Prototype developed for Smart India Hackathon 2026 (Problem SIH26016, Ministry of Rural Development, Dept. of Land Resources)."}
          </p>
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-[10px] text-amber-300 leading-tight">
            ⚠️ Demonstration prototype with synthetic data. Not an official government record.
          </div>
        </div>

        {/* Col 2: Statutory References */}
        <div>
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {locale === "hi" ? "वैधानिक संदर्भ" : "Statutory Framework"}
          </h4>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>RFCTLARR Act, 2013</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>National Highways Act, 1956 (Sec 3A/3D)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Unique Land Parcel Identification Number (ULPIN / Bhu-Aadhaar)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Public Financial Management System (PFMS / DBT)</span>
            </li>
          </ul>
        </div>

        {/* Col 3: About & Contact */}
        <div>
          <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">
            {locale === "hi" ? "संपर्क एवं सहायता" : "About & Contact"}
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Department of Land Resources, Ministry of Rural Development, Government of India.
          </p>
          <div className="space-y-1.5 text-[11px] text-slate-400">
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>support@lams.gov.in (Simulated Helpdesk)</span>
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>GIGW 3.0 &amp; ISO 27001 Security Standards</span>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-4 px-6 bg-slate-950 text-center text-[11px] text-slate-500">
        <p>
          © 2026 {t.governmentOfIndia} • {t.ministryTitle}. Built for Smart India Hackathon 2026.
        </p>
      </div>
    </footer>
  );
}
