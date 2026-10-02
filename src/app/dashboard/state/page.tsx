"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  Building,
  Layers,
  Coins,
  Users2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Download,
  BarChart3,
  Home,
  CheckCircle2,
  Hourglass,
  MapPin,
  ChevronDown,
} from "lucide-react";

export default function StateDashboardPage() {
  const { t, locale } = useLanguage();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role as string | undefined;

  const [selectedState, setSelectedState] = useState("Maharashtra");

  const districtComparison = [
    {
      district: "Nashik District",
      districtHi: "नासिक जिला",
      projectsCount: 4,
      notifiedHa: 512.5,
      acquiredHa: 343.0,
      disbursedCr: 647.3,
      families: 680,
      adherence: "83%",
      delayedCount: 1,
    },
    {
      district: "Pune District",
      districtHi: "पुणे जिला",
      projectsCount: 2,
      notifiedHa: 312.0,
      acquiredHa: 30.5,
      disbursedCr: 98.0,
      families: 420,
      adherence: "95%",
      delayedCount: 0,
    },
    {
      district: "Thane District",
      districtHi: "ठाणे जिला",
      projectsCount: 3,
      notifiedHa: 195.0,
      acquiredHa: 140.0,
      disbursedCr: 410.0,
      families: 310,
      adherence: "90%",
      delayedCount: 0,
    },
    {
      district: "Ahmednagar District",
      districtHi: "अहमदनगर जिला",
      projectsCount: 2,
      notifiedHa: 180.0,
      acquiredHa: 85.0,
      disbursedCr: 125.0,
      families: 190,
      adherence: "88%",
      delayedCount: 0,
    },
  ];

  const stateDelayedProjects = [
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      nameHi: "समृद्धि महामार्ग फीडर कॉरिडोर (निफाड लिंक)",
      district: "Nashik",
      tehsil: "Niphad",
      stage: "Section 23 Award Enquiry & Sanction",
      daysDelayed: 12,
      riskScore: 78,
      delayReasons: [
        "14 High Court writ petitions challenging rural multiplier (1.5x vs 2.0x)",
        "Supplementary tree and micro-irrigation valuation underway by District Horticulture Officer",
      ],
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Building className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "राज्य राजस्व एवं वन विभाग डैशबोर्ड (महाराष्ट्र)"
                : "State Revenue & Forest Department Dashboard (Maharashtra)"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Government of Maharashtra • Monitoring of Land Acquisition, CALA Performance, and Gazette Notifications
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {userRole === "CENTRAL_MINISTRY" && (
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-300">
              <span className="text-xs font-semibold text-slate-600">Select State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="Maharashtra">Maharashtra (Western Region)</option>
                <option value="Gujarat">Gujarat (Western Region)</option>
                <option value="Karnataka">Karnataka (Southern Region)</option>
                <option value="Uttar Pradesh">Uttar Pradesh (Northern Region)</option>
              </select>
            </div>
          )}

          {userRole === "STATE_OFFICER" && (
            <span className="font-mono text-xs px-2.5 py-1.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
              State Government: Maharashtra
            </span>
          )}

          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export State Progress Report</span>
          </Link>
        </div>
      </div>

      {/* 6 State Metric Tiles (Scoped to Maharashtra) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. State Area Notified vs. Acquired */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "राज्य अर्जित क्षेत्र" : "State Area Acquired"}
            </span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">343.0 Ha</div>
          <div className="text-[11px] text-slate-500">
            Notified: <span className="font-semibold text-slate-700 font-mono">512.5 Ha</span> (66.9%)
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "66.9%" }}></div>
          </div>
        </div>

        {/* 2. State Compensation Assessed vs. Paid */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "राज्य मुआवजा भुगतान" : "State Compensation (DBT)"}
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono">₹647.3 Cr</div>
          <div className="text-[11px] text-slate-500">
            Assessed: <span className="font-semibold text-slate-700 font-mono">₹1,450 Cr</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "44.6%" }}></div>
          </div>
        </div>

        {/* 3. Affected Families in State */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "राज्य प्रभावित परिवार" : "Affected Families"}
            </span>
            <Users2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">680</div>
          <div className="text-[11px] text-slate-500">Across 40 Villages</div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-800">
            Maharashtra Scope
          </span>
        </div>

        {/* 4. State R&R Progress */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "पुनर्वास संवितरण" : "State R&R Delivery"}
            </span>
            <Home className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">75.0%</div>
          <div className="text-[11px] text-slate-500">510 / 680 Settled</div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "75%" }}></div>
          </div>
        </div>

        {/* 5. Physical Possession Status */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "भौतिक कब्जा हस्तांतरण" : "Possession Delivered"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">343.0 Ha</div>
          <div className="text-[11px] text-slate-500">Vested under Sec 38</div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-800">
            Collector Certified
          </span>
        </div>

        {/* 6. State Timeline Adherence */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {locale === "hi" ? "समय-सीमा अनुपालन" : "Timeline Adherence"}
            </span>
            <Hourglass className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono">83.3%</div>
          <div className="text-[11px] text-rose-600 font-semibold">1 Delayed Project</div>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-800">
            Niphad Tehsil
          </span>
        </div>
      </div>

      {/* District Comparison Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gov-navy" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "महाराष्ट्र जिलावार तुलना चार्ट (District Comparison)" : "Maharashtra District Comparison Performance Matrix"}
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">4 Active Collectorates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                <th className="py-2.5 px-3">District Name</th>
                <th className="py-2.5 px-3">Active Projects</th>
                <th className="py-2.5 px-3">Notified Area</th>
                <th className="py-2.5 px-3">Acquired Area</th>
                <th className="py-2.5 px-3">Disbursed (DBT)</th>
                <th className="py-2.5 px-3">Families</th>
                <th className="py-2.5 px-3">SLA Adherence</th>
                <th className="py-2.5 px-3 text-center">Delayed Projects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtComparison.map((row) => (
                <tr key={row.district} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">
                    {locale === "hi" ? row.districtHi : row.district}
                  </td>
                  <td className="py-3 px-3 font-mono">{row.projectsCount}</td>
                  <td className="py-3 px-3 font-mono">{row.notifiedHa} Ha</td>
                  <td className="py-3 px-3 font-mono font-semibold text-blue-700">
                    {row.acquiredHa} Ha
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-700">
                    ₹{row.disbursedCr} Cr
                  </td>
                  <td className="py-3 px-3 font-mono">{row.families}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {row.adherence}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.delayedCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold font-mono text-[10px]">
                        {row.delayedCount} Delayed
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

      {/* Delayed Projects List for Maharashtra */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            {locale === "hi" ? "महाराष्ट्र में विलंबित परियोजनाएं" : "Delayed Projects in Maharashtra"}
          </h2>
        </div>

        <div className="space-y-3">
          {stateDelayedProjects.map((p) => (
            <div
              key={p.code}
              className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2 text-xs"
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
                Collectorate: {p.district} • Tehsil: {p.tehsil} • Stage: {p.stage}
              </p>

              <div className="space-y-1.5 pt-2 border-t border-rose-200/60">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Identified Delay Factors:
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
