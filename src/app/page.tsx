"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Building2,
  Landmark,
  Briefcase,
  Users,
  ArrowRight,
  ShieldCheck,
  Scale,
  Layers,
  Lock,
} from "lucide-react";

export default function LandingPage() {
  const { t, locale } = useLanguage();

  const userSegments = [
    {
      title: locale === "hi" ? "मंत्रालय एवं राज्य सरकारें" : "Ministries & States",
      icon: Landmark,
      line:
        locale === "hi"
          ? "राष्ट्रीय अवसंरचना गलियारों में समेकित वैधानिक निगरानी और नीतिगत निर्णय।"
          : "National oversight, statutory timeline tracking, and policy coordination across multi-district corridors.",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: locale === "hi" ? "ज़िला प्राधिकरण (CALA)" : "District Authorities",
      icon: Scale,
      line:
        locale === "hi"
          ? "धारा 11 प्रारंभिक अधिसूचना से लेकर धारा 23 पंचाट घोषणा तक न्यायिक प्रक्रिया का संचालन।"
          : "Competent authority workflow execution from preliminary Section 11 gazettes to Section 23 award declarations.",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: locale === "hi" ? "परियोजना कार्यान्वयन निकाय" : "Project Agencies",
      icon: Briefcase,
      line:
        locale === "hi"
          ? "संरेखण प्रस्ताव प्रस्तुत करना, परियोजना दस्तावेज़ अपलोड करना और दखल हस्तांतरण की निगरानी।"
          : "Requiring bodies submitting corridor alignments, project documentation, and tracking physical possession.",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      title: locale === "hi" ? "भू-स्वामी एवं प्रभावित नागरिक" : "Landowners",
      icon: Users,
      line:
        locale === "hi"
          ? "पार्सल अधिग्रहण स्थिति की ट्रैकिंग, पारदर्शी मुआवजा सत्यापन और आपत्तियां दर्ज करना।"
          : "Directly track parcel acquisition progress, review statutory compensation assessments, and submit objections.",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white selection:bg-amber-500 selection:text-white">
      {/* 1. Hero Section - Spacious, Editorial & Minimal */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 bg-slate-50/60 border-b border-slate-200/80">
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-medium mb-8 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Department of Land Resources • Ministry of Rural Development</span>
          </div>

          {/* One-Line Mission Statement */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            A Single National Platform for End-to-End Land Acquisition
          </h1>

          {/* 2-3 Sentence Problem Statement Paraphrase */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            LAMS replaces fragmented, state-specific, manual land-acquisition processes with a unified digital lifecycle
            under the <span className="font-semibold text-slate-800">RFCTLARR Act 2013</span>. From initial alignment
            proposal to final compensation disbursement and physical possession, all stakeholders collaborate on a
            single trusted record.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#0a2240] hover:bg-[#081a32] text-white text-sm font-semibold shadow-sm transition hover:-translate-y-0.5"
            >
              <span>{locale === "hi" ? "सिस्टम में प्रवेश करें (लॉगिन)" : "Login to Platform"}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-sm font-semibold border border-slate-300 shadow-2xs transition"
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>{locale === "hi" ? "नागरिक पंजीकरण" : "Register as Citizen"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. "Who it's for" Section - 4 short conceptual cards, no real numbers */}
      <section className="py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Institutional Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              {locale === "hi" ? "किसके लिए है LAMS?" : "Who It's For"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Designed for seamless inter-agency collaboration across the entire land acquisition lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userSegments.map((seg, idx) => {
              const Icon = seg.icon;
              return (
                <div
                  key={idx}
                  className="p-7 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-xl border ${seg.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{seg.title}</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-1">{seg.line}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. About the Platform / Statutory Framework (Anchor #about) */}
      <section id="about" className="py-24 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0a2240] block">
              About the Initiative
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Modernizing Land Governance for Public Infrastructure
            </h2>
            <p>
              In linear infrastructure projects—such as highways, rail corridors, and industrial zones—land acquisition
              delays traditionally account for significant cost escalations. Paper-based revenue records, fragmented
              state procedures, and manual objection hearings often lead to statutory SLA breaches.
            </p>
            <p>
              The Land Acquisition Monitoring System (LAMS) establishes an automated, standardized statutory workflow.
              By linking satellite cadastral GIS, ULPIN revenue boundaries, rule-based delay alerts, and direct bank
              disbursements via PFMS, LAMS provides transparent decision support for district administrators and
              affected families alike.
            </p>

            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900">Statutory Compliance</h4>
                <p className="text-slate-500 mt-1">Full adherence to RFCTLARR 2013 statutory timelines and notices.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Layers className="w-5 h-5 text-blue-600 mb-2" />
                <h4 className="font-bold text-slate-900">Spatial Intelligence</h4>
                <p className="text-slate-500 mt-1">Sub-meter satellite imagery aligned with cadastral revenue parcels.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <Scale className="w-5 h-5 text-amber-600 mb-2" />
                <h4 className="font-bold text-slate-900">Role-Gated Access</h4>
                <p className="text-slate-500 mt-1">Strict server-side permissions across 7 administrative tiers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
