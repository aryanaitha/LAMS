"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Gavel,
  CheckCircle,
  XCircle,
  RotateCcw,
  Clock,
  Layers,
  FileText,
  AlertTriangle,
  Coins,
  Building2,
  Users2,
  Send,
  CheckCircle2,
} from "lucide-react";

export default function CollectorConsolePage() {
  const { t, locale } = useLanguage();

  const [activeItem, setActiveItem] = useState("CASE-2026-084");
  const [remarks, setRemarks] = useState("");
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);

  const kpis = [
    {
      title: "Active Projects",
      value: "4",
      sub: "Nashik District",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Parcels Under Acquisition",
      value: "854",
      sub: "464.2 Hectares",
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      title: "Disbursed Amount",
      value: "₹284.5 Cr",
      sub: "Via PFMS / DBT",
      icon: Coins,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      title: "Pending Objections",
      value: "18",
      sub: "Sec 15 Hearings",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ];

  const pendingDockets = [
    {
      id: "CASE-2026-084",
      project: "NH-2026-084 (Sinnar Bypass)",
      type: "Section 11 Preliminary Notification Approval",
      village: "Musalgaon (280 Parcels, 142.5 Ha)",
      requiringBody: "NHAI Western PIU",
      slaDaysLeft: 4,
      urgency: "HIGH",
      summary:
        "Draft Section 11 gazette notification submitted with joint measurement survey annexure and SIA clearance certificate. All 280 parcels cross-referenced against MahaBhulekh 7/12 land records.",
    },
    {
      id: "CASE-2026-102",
      project: "NH-2026-102 (Samruddhi Feeder)",
      type: "Section 23 Statutory Award Sanction",
      village: "Ranwad, Niphad (190 Parcels, 96 Ha)",
      requiringBody: "MSRDC",
      slaDaysLeft: -12,
      urgency: "BREACHED",
      summary:
        "Statutory compensation award compilation pending final Collector sanction. 14 High Court writ petitions disposed in favor of public infrastructure with solatium deposited in escrow.",
    },
    {
      id: "CASE-2026-031",
      project: "IN-2026-031 (Sinnar MIDC Phase IV)",
      type: "Section 15 Hearing Summary & Objection Disposal",
      village: "Vadgaon Sinnar (18 Objections)",
      requiringBody: "MIDC",
      slaDaysLeft: 14,
      urgency: "NORMAL",
      summary:
        "18 farmer objections heard regarding fruit tree and micro-irrigation pipe valuation. Supplementary valuation report submitted by District Horticulture Officer for 6 parcels.",
    },
  ];

  const current = pendingDockets.find((d) => d.id === activeItem) || pendingDockets[0];

  const handleDecision = (type: "APPROVE" | "REJECT" | "RETURN") => {
    if (type === "APPROVE") {
      setDecisionNotice(
        locale === "hi"
          ? `डॉकट '${current.id}' को सक्षम प्राधिकारी (CALA) द्वारा विधिवत अनुमोदित किया गया। ई-गजट प्रकाशन एवं नोटिस जारी।`
          : `Docket '${current.id}' has been approved by CALA. Statutory notice issued for official gazette publication.`
      );
    } else if (type === "RETURN") {
      setDecisionNotice(
        locale === "hi"
          ? `डॉकट '${current.id}' को टिप्पणियों के साथ अध्येक्षी निकाय को लौटा दिया गया।`
          : `Docket '${current.id}' returned to Requiring Body with observations: "${remarks || "Rectification needed"}".`
      );
    } else {
      setDecisionNotice(
        locale === "hi"
          ? `डॉकट '${current.id}' को सक्षम प्राधिकारी द्वारा अस्वीकार कर दिया गया।`
          : `Docket '${current.id}' rejected by CALA.`
      );
    }
    setRemarks("");
    setTimeout(() => setDecisionNotice(null), 5000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Header & Minimal KPI Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0a2240] text-amber-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {locale === "hi"
                  ? "सक्षम प्राधिकारी (CALA) / ज़िला कलेक्टर न्यायिक कंसोल"
                  : "District Collector / CALA Judicial Operations Console"}
              </h1>
              <p className="text-xs text-slate-500 font-mono">
                Jurisdiction: Nashik District • Presiding: Shri Jalaj Sharma, IAS
              </p>
            </div>
          </div>

          {/* 4 Focused KPI Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-2xs"
                >
                  <div className={`p-1.5 rounded-lg border ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block leading-tight">
                      {kpi.title}
                    </span>
                    <span className="text-sm font-bold text-slate-900 font-mono leading-tight">
                      {kpi.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Docket Workbench */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Pending Dockets List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {locale === "hi" ? "लंबित न्यायिक कार्यवाहियां" : "Active Review Docket"}
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {pendingDockets.length} Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
            {pendingDockets.map((d) => {
              const isActive = d.id === activeItem;
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveItem(d.id)}
                  className={`w-full p-4 text-left transition flex flex-col space-y-1.5 ${
                    isActive
                      ? "bg-slate-50 border-l-4 border-[#0a2240]"
                      : "hover:bg-slate-50/60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0a2240]">{d.id}</span>
                    <span
                      className={`font-mono px-2 py-0.5 rounded text-[10px] font-bold ${
                        d.urgency === "BREACHED"
                          ? "bg-rose-100 text-rose-800 border border-rose-200"
                          : d.urgency === "HIGH"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {d.slaDaysLeft < 0
                        ? `SLA Breached ${Math.abs(d.slaDaysLeft)}d`
                        : `${d.slaDaysLeft}d SLA Left`}
                    </span>
                  </div>
                  <p className="font-bold text-xs text-slate-900 line-clamp-1">{d.type}</p>
                  <p className="text-[11px] text-slate-500 truncate">{d.project}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Docket Examination & Action Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {decisionNotice && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2.5 animate-in fade-in duration-200 shadow-2xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{decisionNotice}</span>
            </div>
          )}

          {/* Docket Examination Dossier */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-[#0a2240] bg-slate-100 px-2 py-0.5 rounded">
                  {current.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2">{current.type}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {current.project} • {current.village}
                </p>
              </div>

              <div className="text-left sm:text-right font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Requiring Body
                </span>
                <p className="font-bold text-slate-800">{current.requiringBody}</p>
              </div>
            </div>

            {/* Case Summary Description */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 mb-1">Docket Summary & Evidence</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{current.summary}</p>
            </div>

            {/* Statutory Compliance Checklist */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                RFCTLARR 2013 Statutory Compliance Verification
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sec 4 SIA Report formally accepted</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>MahaBhulekh 7/12 Land Title cross-checked</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Solatium & Rural Multiplier verified</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Gram Sabha Consultation Resolution uploaded</span>
                </div>
              </div>
            </div>

            {/* Judicial Order & Remarks Input */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                {locale === "hi"
                  ? "सक्षम प्राधिकारी न्यायिक टिप्पणियां / निर्देश"
                  : "CALA Judicial Determination / Official Order Notes"}
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter formal reasons for sanction, stipulations on compensation escrow, or instructions to District Inspector of Land Records..."
                rows={3}
                className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-1 focus:ring-[#0a2240] focus:outline-none"
              />

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => handleDecision("APPROVE")}
                  className="px-5 py-2.5 rounded-xl bg-[#0a2240] hover:bg-[#081a32] text-white text-xs font-bold shadow-xs transition flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Sanction & Issue Gazette Notice</span>
                </button>

                <button
                  onClick={() => handleDecision("RETURN")}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-amber-800 border border-amber-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Return for Clarification</span>
                </button>

                <button
                  onClick={() => handleDecision("REJECT")}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Disallow Docket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
