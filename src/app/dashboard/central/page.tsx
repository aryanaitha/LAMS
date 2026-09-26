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
} from "lucide-react";

export default function CentralMinistryDashboard() {
  const { t, locale } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");

  const delayedProjects = [
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      nameHi: "समृद्धि महामार्ग फीडर कॉरिडोर (निफाड लिंक)",
      sector: "HIGHWAY",
      district: "Nashik, Maharashtra",
      stage: "Award Enquiry & Valuation under Section 23",
      daysDelayed: 12,
      riskScore: 78,
      delayReasons: [
        "14 High Court writ petitions challenging valuation multiplier",
        "Tree & structure compensation re-verification ordered by CALA",
      ],
    },
    {
      code: "IR-2026-007",
      name: "Upper Godavari Left Bank Canal Modernization",
      nameHi: "ऊपरी गोदावरी डांवा तट नहर आधुनिकीकरण",
      sector: "IRRIGATION",
      district: "Nashik, Maharashtra",
      stage: "Section 19 Final Declaration & R&R Publication",
      daysDelayed: 5,
      riskScore: 64,
      delayReasons: [
        "Delayed Stage-1 Forest Diversion approval via PARIVESH portal (4.2 Ha)",
        "Objections pending in 3 villages regarding canal alignment siphon crossing",
      ],
    },
  ];

  // Bottleneck Heatmap data (Stage x District/Tehsil)
  const heatmapStages = ["Proposal Scrutiny", "SIA Appraisal", "Sec 11 Preliminary", "Sec 15 Objections", "Sec 23 Award", "Compensation DBT"];
  const heatmapOffices = [
    { office: "Sinnar Tehsil, Nashik", days: [4, 18, 12, 45, 22, 8] },
    { office: "Niphad Tehsil, Nashik", days: [6, 24, 15, 68, 85, 14] }, // Red bottleneck at Sec 23!
    { office: "Khed Tehsil, Pune", days: [5, 32, 10, 20, 18, 5] },
    { office: "Shirur Tehsil, Pune", days: [3, 15, 8, 18, 14, 6] },
  ];

  const getHeatmapColor = (days: number) => {
    if (days > 60) return "bg-rose-500 text-white font-bold";
    if (days > 30) return "bg-amber-400 text-slate-950 font-bold";
    if (days > 15) return "bg-amber-100 text-amber-900";
    return "bg-emerald-50 text-emerald-800";
  };

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

      {/* National Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t.metrics.totalProjects}
          value="6"
          subtitle="All Sectors Active"
          icon={Building2}
          variant="info"
        />
        <StatCard
          title={t.metrics.totalAreaAcquired}
          value="373.5 Ha"
          subtitle="Target: 724.5 Ha"
          trend={{ value: "51.5% Progress", isPositive: true }}
          icon={Layers}
          variant="success"
        />
        <StatCard
          title={t.metrics.compensationDisbursed}
          value="₹745.3 Cr"
          subtitle="Sanctioned: ₹2,890 Cr"
          trend={{ value: "Direct Benefit Transfer", isPositive: true }}
          icon={Coins}
          variant="warning"
        />
        <StatCard
          title={t.metrics.delayedProjects}
          value="2"
          subtitle="SLA Breached"
          trend={{ value: "Urgent Review", isPositive: false }}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Delay Risk & Bottleneck Heatmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bottleneck Heatmap */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "दौड़/चरण अनुसार विलंब हीटमैप (Days Pending)" : "Acquisition Stage Bottleneck Heatmap"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Average pending days per revenue tehsil across statutory acquisition milestones.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              Rule-Based
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-2 pr-2">Revenue Office</th>
                  {heatmapStages.map((s, idx) => (
                    <th key={idx} className="py-2 px-1 text-center font-mono text-[10px]">
                      {s.split(" ")[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {heatmapOffices.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 pr-2 font-semibold text-slate-800 text-[11px] whitespace-nowrap">
                      {row.office}
                    </td>
                    {row.days.map((d, dIdx) => (
                      <td key={dIdx} className="py-1 px-1 text-center">
                        <span className={`inline-block w-8 py-1 rounded text-[11px] font-mono ${getHeatmapColor(d)}`}>
                          {d}d
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span>Legend: Green (&lt;15d) → Yellow (15-30d) → Orange (30-60d) → Red (&gt;60d Breached)</span>
          </div>
        </div>

        {/* Right: Delayed Projects with Explainable Reasons */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "विलंबित परियोजनाएं एवं कारण" : "Explainable Delay Risk Factors"}
            </h2>
          </div>

          <div className="space-y-3">
            {delayedProjects.map((p) => (
              <div
                key={p.code}
                className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-900">{p.code}</span>
                  <span className="font-bold text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-900">
                    Delay Risk Score: {p.riskScore} / 100
                  </span>
                </div>
                <h3 className="font-bold text-slate-900">{locale === "hi" ? p.nameHi : p.name}</h3>
                <p className="text-[11px] text-slate-600 font-mono">Stage: {p.stage}</p>

                <div className="space-y-1 pt-1 border-t border-rose-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Top Delay Contributors:</p>
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
    </div>
  );
}
