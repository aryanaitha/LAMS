"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Calendar,
  Layers,
  Coins,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function ProjectDetailsPage() {
  const { t, locale } = useLanguage();
  const params = useParams();
  const code = (params?.code as string) || "NH-2026-084";

  const stages = [
    { name: "Proposal Submission", date: "Jan 2026", status: "COMPLETED" },
    { name: "Rule 4 Scrutiny", date: "Feb 2026", status: "COMPLETED" },
    { name: "SIA & Appraisal", date: "Feb 2026", status: "COMPLETED" },
    { name: "Section 11 Preliminary Notification", date: "24 Feb 2026", status: "COMPLETED" },
    { name: "Section 15 Objections & Hearings", date: "Sep 2026", status: "CURRENT" },
    { name: "Section 19 Final Declaration", date: "Oct 2026", status: "UPCOMING" },
    { name: "Section 23 Award Enquiry", date: "Nov 2026", status: "UPCOMING" },
    { name: "PFMS Compensation Disbursement", date: "Dec 2026", status: "UPCOMING" },
    { name: "Physical Possession", date: "Jan 2027", status: "UPCOMING" },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-gov-navy text-white">
                {code}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                Section 11 Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Nashik-Pune Industrial Expressway (Sinnar Bypass Corridor)
            </h1>
            <p className="text-xs text-slate-500">
              National Highways Authority of India (NHAI) • Nashik District, Maharashtra
            </p>
          </div>

          <Link
            href={`/gis?project=${code}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span>View All Parcels on GIS Map</span>
          </Link>
        </div>

        {/* 4 Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Target Area</span>
            <p className="text-lg font-bold text-slate-900 font-mono">142.5 Ha</p>
            <span className="text-[10px] text-slate-500">280 Land Parcels</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Budget</span>
            <p className="text-lg font-bold text-gov-navy font-mono">₹480.0 Cr</p>
            <span className="text-[10px] text-slate-500">₹84.5 Cr Disbursed</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Affected Families</span>
            <p className="text-lg font-bold text-slate-900 font-mono">195 Families</p>
            <span className="text-[10px] text-slate-500">185 R&R Packages</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-0.5">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">SLA Timeline</span>
            <p className="text-lg font-bold text-emerald-700 font-mono">45 Days Left</p>
            <span className="text-[10px] text-slate-500">Sec 15 Hearing Window</span>
          </div>
        </div>
      </div>

      {/* Interactive 9-Step Stage Stepper */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          Statutory Land Acquisition Progression Stepper (RFCTLARR Act, 2013)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {stages.map((stg, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-lg border text-xs space-y-1 ${
                stg.status === "COMPLETED"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                  : stg.status === "CURRENT"
                  ? "bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-400 font-bold"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase">Step {idx + 1}</span>
                {stg.status === "COMPLETED" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                )}
                {stg.status === "CURRENT" && (
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                )}
              </div>
              <p className="leading-tight line-clamp-2">{stg.name}</p>
              <p className="text-[10px] font-mono mt-1 opacity-70">{stg.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
