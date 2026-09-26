"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  User,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Coins,
  MapPin,
  ShieldCheck,
  Calendar,
  Send,
  Upload,
} from "lucide-react";

function CitizenPortalContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "MH24-0891-4402");
  const [activeTab, setActiveTab] = useState<"dossier" | "grievance">("dossier");

  // Grievance form state
  const [grievanceCategory, setGrievanceCategory] = useState("COMPENSATION_AMOUNT");
  const [grievanceDesc, setGrievanceDesc] = useState("");
  const [submittedGrievance, setSubmittedGrievance] = useState<string | null>(null);

  // Ramesh Patil demo dossier (anchored to survey 104/2 in Sinnar)
  const citizenDossier = {
    ulpin: "MH24-0891-4402",
    surveyNo: "104/2",
    subDivision: "2A",
    ownerName: "Ramesh Tukaram Patil",
    village: "Musalgaon",
    tehsil: "Sinnar",
    district: "Nashik",
    areaHa: 1.25,
    landUse: "AGRICULTURAL_IRRIGATED",
    project: "NH-2026-084 (Nashik-Pune Expressway Sinnar Bypass)",
    marketValuePerHa: "₹35,00,000",
    totalAwardEstimate: "₹1,32,50,000",
    solatium: "₹65,62,500 (100%)",
    interestAmount: "₹6,30,000 (12% p.a.)",
    treesStructuresValue: "₹4,50,000",
    bankAccountMasked: "SBIN000****4210",
    dbtStatus: "VERIFIED_PFMS_READY",
    status: "OBJECTIONS",
    milestones: [
      { name: "Proposal Ingestion", date: "15 Jan 2026", status: "COMPLETED" },
      { name: "Section 11 Preliminary Notification", date: "24 Feb 2026", status: "COMPLETED" },
      { name: "Joint Measurement Survey (JMS)", date: "10 Mar 2026", status: "COMPLETED" },
      { name: "Section 15 Objections Hearing", date: "14 Oct 2026", status: "CURRENT" },
      { name: "Section 19 Final Declaration", date: "Nov 2026", status: "UPCOMING" },
      { name: "Award & Direct DBT Disbursement", date: "Dec 2026", status: "UPCOMING" },
    ],
    grievances: [
      {
        trackingNo: "GRV-2026-1001",
        date: "26 Sep 2026",
        category: "Valuation of Horticulture Trees",
        status: "HEARING_SCHEDULED",
        hearingDate: "14 Oct 2026 at CALA Office Sinnar",
        notes: "42 pomegranate trees and micro-irrigation system under re-inspection.",
      },
    ],
  };

  const handleFileGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceDesc.trim()) return;

    const newTracking = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedGrievance(newTracking);
    setGrievanceDesc("");
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <User className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.citizen.title}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.citizen.subtitle}</p>
        </div>

        {/* Search Input for ULPIN */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.citizen.searchPlaceholder}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy font-mono"
          />
        </div>
      </div>

      {/* Dossier Card Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black px-2.5 py-0.5 rounded bg-gov-navy text-white">
                ULPIN: {citizenDossier.ulpin}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                {locale === "hi" ? "आपत्ति एवं सुनवाई चरण" : "Section 15 Objection Stage"}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{citizenDossier.ownerName}</h2>
            <p className="text-xs text-slate-500">
              Survey No: <span className="font-bold text-slate-800">{citizenDossier.surveyNo}</span> • Village: {citizenDossier.village}, Tehsil: {citizenDossier.tehsil}, Dist: {citizenDossier.district}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("dossier")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "dossier" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {locale === "hi" ? "पार्सल एवं पंचाट विवरण" : "Parcel & Award Dossier"}
            </button>
            <button
              onClick={() => setActiveTab("grievance")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "grievance" ? "bg-gov-navy text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {locale === "hi" ? "आपत्ति दर्ज करें" : "File Section 15 Objection"}
            </button>
          </div>
        </div>

        {activeTab === "dossier" ? (
          <div className="space-y-6">
            {/* Financial & Statutory Award Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                <p className="text-xs text-slate-500 font-semibold uppercase">{t.parcel.area}</p>
                <p className="text-2xl font-black text-slate-900 font-mono">{citizenDossier.areaHa} Ha</p>
                <p className="text-[11px] text-slate-400">{citizenDossier.landUse.replace("_", " ")}</p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1">
                <p className="text-xs text-emerald-800 font-semibold uppercase">{t.parcel.estimatedAward}</p>
                <p className="text-2xl font-black text-emerald-700 font-mono">{citizenDossier.totalAwardEstimate}</p>
                <p className="text-[11px] text-emerald-600">Includes 100% Solatium & 12% Int.</p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 space-y-1">
                <p className="text-xs text-amber-800 font-semibold uppercase">Trees & Structures</p>
                <p className="text-2xl font-black text-amber-700 font-mono">{citizenDossier.treesStructuresValue}</p>
                <p className="text-[11px] text-amber-600">42 Pomegranate Trees + Well</p>
              </div>

              <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-200 space-y-1">
                <p className="text-xs text-sky-800 font-semibold uppercase">PFMS Bank DBT Status</p>
                <p className="text-sm font-bold text-sky-900 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Aadhaar Linked</span>
                </p>
                <p className="text-[11px] text-sky-600 font-mono">{citizenDossier.bankAccountMasked}</p>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {t.citizen.compensationTimeline}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {citizenDossier.milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs space-y-1 ${
                      m.status === "COMPLETED"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : m.status === "CURRENT"
                        ? "bg-amber-50 border-amber-300 text-amber-950 ring-2 ring-amber-400"
                        : "bg-slate-50 border-slate-200 text-slate-400"
                    }`}
                  >
                    <span className="font-mono text-[10px] block opacity-60">Step {idx + 1}</span>
                    <p className="font-bold leading-tight line-clamp-2">{m.name}</p>
                    <p className="text-[10px] font-mono mt-1 opacity-75">{m.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Grievances Table */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {t.citizen.myGrievances}
              </h3>
              {citizenDossier.grievances.map((g) => (
                <div
                  key={g.trackingNo}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gov-navy">{g.trackingNo}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                        {g.status}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800">{g.category}</p>
                    <p className="text-slate-500">{g.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-amber-700">{g.hearingDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* File Objection Form */
          <form onSubmit={handleFileGrievance} className="space-y-4 max-w-2xl text-xs">
            {submittedGrievance && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Objection Filed Successfully! Docket Number: {submittedGrievance}</span>
                </p>
                <p className="text-xs">
                  Your objection under Section 15 of RFCTLARR Act 2013 has been docketed. You will receive an SMS hearing notice.
                </p>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.citizen.grievanceType}
              </label>
              <select
                value={grievanceCategory}
                onChange={(e) => setGrievanceCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy bg-white"
              >
                <option value="COMPENSATION_AMOUNT">Dispute on Market Rate / Solatium Calculation</option>
                <option value="TREE_STRUCTURE">Valuation of Fruit Trees / Wells / Buildings</option>
                <option value="MEASUREMENT_ERROR">Discrepancy in Field Boundary / Area Measurement</option>
                <option value="OWNERSHIP_DISPUTE">Name Correction / Joint Title Succession Heir Claim</option>
                <option value="RR_BENEFIT">Omission from R&R Entitlement Package (Second Schedule)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {t.citizen.description}
              </label>
              <textarea
                required
                rows={4}
                value={grievanceDesc}
                onChange={(e) => setGrievanceDesc(e.target.value)}
                placeholder="State your grounds of objection clearly with reference to survey numbers..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
              ></textarea>
            </div>

            <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 text-center space-y-2">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="text-slate-600 font-semibold">
                Attach Supporting Document (7/12 Extract, Horticulture Certificate, Photos)
              </p>
              <p className="text-[11px] text-slate-400">PDF, JPG up to 10MB</p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition shadow flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span>{t.citizen.submitGrievance}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CitizenPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading citizen portal dossier...</div>}>
      <CitizenPortalContent />
    </Suspense>
  );
}

