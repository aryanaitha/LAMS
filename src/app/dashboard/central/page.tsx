"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { StatCard } from "@/components/ui/StatCard";
import Link from "next/link";
import {
  Building2,
  Layers,
  Coins,
  Users2,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingDown,
  FileText,
  Filter,
  Download,
  BarChart3,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Home,
  Hourglass,
  MapPin,
} from "lucide-react";

export default function CentralMinistryDashboard() {
  const { t, locale } = useLanguage();
  const [selectedSector, setSelectedSector] = useState<string>("ALL");

  // State Comparison Data
  const stateComparisonData = [
    {
      state: "Maharashtra",
      stateHi: "महाराष्ट्र",
      notifiedHa: 512.5,
      acquiredHa: 343.0,
      compensationCr: 647.3,
      families: 680,
      delayedProjects: 1,
      adherenceRate: "83%",
    },
    {
      state: "Gujarat",
      stateHi: "गुजरात",
      notifiedHa: 380.0,
      acquiredHa: 260.0,
      compensationCr: 520.0,
      families: 420,
      delayedProjects: 0,
      adherenceRate: "92%",
    },
    {
      state: "Karnataka",
      stateHi: "कर्नाटक",
      notifiedHa: 290.0,
      acquiredHa: 185.0,
      compensationCr: 390.0,
      families: 310,
      delayedProjects: 1,
      adherenceRate: "79%",
    },
    {
      state: "Madhya Pradesh",
      stateHi: "मध्य प्रदेश",
      notifiedHa: 240.0,
      acquiredHa: 140.0,
      compensationCr: 280.0,
      families: 240,
      delayedProjects: 0,
      adherenceRate: "88%",
    },
    {
      state: "Uttar Pradesh",
      stateHi: "उत्तर प्रदेश",
      notifiedHa: 410.0,
      acquiredHa: 220.0,
      compensationCr: 490.0,
      families: 580,
      delayedProjects: 1,
      adherenceRate: "74%",
    },
  ];

  const delayedProjects = [
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      nameHi: "समृद्धि महामार्ग फीडर कॉरिडोर (निफाड लिंक)",
      sector: "HIGHWAY",
      state: "Maharashtra",
      district: "Nashik",
      stage: "Award Enquiry & Valuation under Section 23",
      daysDelayed: 12,
      riskScore: 78,
      delayReasons: [
        "14 High Court writ petitions challenging rural valuation multiplier",
        "Tree & structure compensation re-verification ordered by CALA",
      ],
    },
    {
      code: "IR-2026-007",
      name: "Upper Godavari Left Bank Canal Modernization",
      nameHi: "ऊपरी गोदावरी डांवा तट नहर आधुनिकीकरण",
      sector: "IRRIGATION",
      state: "Maharashtra",
      district: "Nashik",
      stage: "Section 19 Final Declaration & R&R Publication",
      daysDelayed: 5,
      riskScore: 64,
      delayReasons: [
        "Delayed Stage-1 Forest Diversion clearance via PARIVESH portal (4.2 Ha)",
        "Objections pending in 3 villages regarding canal alignment siphon crossing",
      ],
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Building2 className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "राष्ट्रीय भू-अर्जन निगरानी डैशबोर्ड (केंद्रीय मंत्रालय)"
                : "National Land Acquisition Monitoring Dashboard"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ministry of Rural Development • Department of Land Resources (DoLR), Government of India
            <span className="ml-2 font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {locale === "hi" ? "केवल पठन अधिकार" : "Read-Only National Scope"}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{t.actions.downloadBriefing}</span>
          </Link>
        </div>
      </div>

      {/* 6 Comprehensive National Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Area Notified vs. Acquired */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "अर्जित / अधिसूचित क्षेत्र" : "Area Notified / Acquired"}
            </span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">373.5 Ha</div>
          <div className="text-[11px] text-slate-500">
            Target: <span className="font-semibold text-slate-700 font-mono">724.5 Ha</span> (51.5%)
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "51.5%" }}></div>
          </div>
        </div>

        {/* 2. Compensation Assessed vs. Paid */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "मुआवजा भुगतान (DBT)" : "Compensation Assessed / Paid"}
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">₹745.3 Cr</div>
          <div className="text-[11px] text-slate-500">
            Assessed: <span className="font-semibold text-slate-700 font-mono">₹2,890 Cr</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "25.8%" }}></div>
          </div>
        </div>

        {/* 3. Affected & Displaced Families */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "प्रभावित परिवार" : "Affected Families"}
            </span>
            <Users2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">1,240</div>
          <div className="text-[11px] text-slate-500">
            Displaced: <span className="font-semibold text-purple-700 font-mono">890 Families</span>
          </div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-800">
            Census Enumerated
          </span>
        </div>

        {/* 4. R&R Status */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "पुनर्वास (R&R) स्थिति" : "R&R Settlement"}
            </span>
            <Home className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">71.8%</div>
          <div className="text-[11px] text-slate-500">
            890 / 1,240 Resettled
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "71.8%" }}></div>
          </div>
        </div>

        {/* 5. Physical Possession Status */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "भौतिक कब्जा स्थिति" : "Possession Status"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">373.5 Ha</div>
          <div className="text-[11px] text-slate-500">
            Delivered to Project Authorities
          </div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800">
            Sec 38 Vested
          </span>
        </div>

        {/* 6. Timeline Adherence */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "समय-सीमा अनुपालन" : "Timeline Adherence"}
            </span>
            <Hourglass className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">78.0%</div>
          <div className="text-[11px] text-rose-600 font-semibold">
            2 Projects Delayed
          </div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800">
            SLA Escalated
          </span>
        </div>
      </div>

      {/* State Comparison Table & Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gov-navy" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "अन्तर-राज्यीय भू-अर्जन तुलना (State Comparison Chart)" : "Inter-State Land Acquisition Performance Matrix"}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">5 Major States Monitored</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-2.5 px-3">State Name</th>
                <th className="py-2.5 px-3">Notified Area</th>
                <th className="py-2.5 px-3">Acquired Area</th>
                <th className="py-2.5 px-3">Compensation Disbursed</th>
                <th className="py-2.5 px-3">Affected Families</th>
                <th className="py-2.5 px-3">SLA Adherence</th>
                <th className="py-2.5 px-3 text-center">Delayed Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stateComparisonData.map((row) => (
                <tr key={row.state} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {locale === "hi" ? row.stateHi : row.state}
                  </td>
                  <td className="py-3 px-3 font-mono">{row.notifiedHa} Ha</td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                    {row.acquiredHa} Ha
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                    ₹{row.compensationCr} Cr
                  </td>
                  <td className="py-3 px-3 font-mono">{row.families}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-slate-800">{row.adherenceRate}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.delayedProjects > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold font-mono text-[10px]">
                        {row.delayedProjects} Delayed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono text-[10px]">
                        On Schedule
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delayed Projects Section with Rule-Based Explanations */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {locale === "hi" ? "विलंबित परियोजनाएं एवं कारण (Delayed Projects List)" : "Delayed Projects List & Root-Cause Explanations"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {delayedProjects.map((p) => (
            <div
              key={p.code}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-rose-900 bg-rose-200/60 px-2 py-0.5 rounded">
                  {p.code}
                </span>
                <span className="font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900">
                  Delay Risk Score: {p.riskScore} / 100
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">
                {locale === "hi" ? p.nameHi : p.name}
              </h3>
              <p className="text-[11px] text-slate-600 font-mono">
                Jurisdiction: {p.state} • Stage: {p.stage}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-rose-200/60">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Identified Statutory Bottlenecks:
                </p>
                <ul className="space-y-1 text-[11px] text-slate-700">
                  {p.delayReasons.map((r, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
