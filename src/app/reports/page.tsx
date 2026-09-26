"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  FileText,
  Download,
  Filter,
  Search,
  Building,
  Layers,
  Coins,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";

export default function ReportsMisPage() {
  const { t, locale } = useLanguage();

  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [showBriefingPreview, setShowBriefingPreview] = useState(false);

  const reportRows = [
    {
      code: "NH-2026-084",
      name: "Nashik-Pune Industrial Expressway (Sinnar Bypass)",
      sector: "HIGHWAY",
      district: "Nashik",
      status: "SEC_11",
      targetHa: 142.5,
      acquiredHa: 42.0,
      budgetCr: 480.0,
      disbursedCr: 84.5,
      parcels: 280,
    },
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      sector: "HIGHWAY",
      district: "Nashik",
      status: "AWARD",
      targetHa: 96.0,
      acquiredHa: 68.0,
      budgetCr: 320.0,
      disbursedCr: 120.0,
      parcels: 190,
    },
    {
      code: "RL-2026-019",
      name: "Pune-Nashik Semi High-Speed Rail Corridor",
      sector: "RAILWAY",
      district: "Pune",
      status: "SIA",
      targetHa: 280.0,
      acquiredHa: 0.0,
      budgetCr: 1250.0,
      disbursedCr: 0.0,
      parcels: 420,
    },
    {
      code: "IR-2026-007",
      name: "Upper Godavari Left Bank Canal Modernization",
      sector: "IRRIGATION",
      district: "Nashik",
      status: "SEC_19",
      targetHa: 64.0,
      acquiredHa: 38.0,
      budgetCr: 190.0,
      disbursedCr: 45.0,
      parcels: 130,
    },
    {
      code: "IN-2026-031",
      name: "Sinnar-MIDC Phase IV Industrial Growth Centre",
      sector: "INDUSTRIAL",
      district: "Nashik",
      status: "COMPENSATION",
      targetHa: 210.0,
      acquiredHa: 195.0,
      budgetCr: 540.0,
      disbursedCr: 442.8,
      parcels: 210,
    },
    {
      code: "TR-2026-055",
      name: "400kV Western Green Energy Power Evacuation",
      sector: "TRANSMISSION",
      district: "Pune",
      status: "POSSESSION",
      targetHa: 32.0,
      acquiredHa: 30.5,
      budgetCr: 110.0,
      disbursedCr: 98.0,
      parcels: 75,
    },
  ];

  const filteredRows = reportRows.filter((r) => {
    const matchSec = selectedSector === "ALL" || r.sector === selectedSector;
    const matchStat = selectedStatus === "ALL" || r.status === selectedStatus;
    return matchSec && matchStat;
  });

  const handleExportExcel = () => {
    // Generate CSV content
    const headers = "Project Code,Project Name,Sector,District,Status,Target Ha,Acquired Ha,Budget Cr,Disbursed Cr,Parcels\n";
    const body = filteredRows
      .map(
        (r) =>
          `"${r.code}","${r.name}","${r.sector}","${r.district}","${r.status}",${r.targetHa},${r.acquiredHa},${r.budgetCr},${r.disbursedCr},${r.parcels}`
      )
      .join("\n");

    const blob = new Blob([headers + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LAMS_National_MIS_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <FileText className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "राष्ट्रीय रिपोर्ट एवं प्रबंधन सूचना प्रणाली (MIS)"
                : "National Land Acquisition MIS & Analytical Reports"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate executive briefings, statutory progress statements, and raw data exports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{t.actions.exportExcel}</span>
          </button>

          <button
            onClick={() => setShowBriefingPreview(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>{t.actions.downloadBriefing}</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Sector:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-gov-navy"
          >
            <option value="ALL">All Sectors</option>
            <option value="HIGHWAY">Highway</option>
            <option value="RAILWAY">Railway</option>
            <option value="IRRIGATION">Irrigation</option>
            <option value="INDUSTRIAL">Industrial</option>
            <option value="TRANSMISSION">Transmission</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Acquisition Stage:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-gov-navy"
          >
            <option value="ALL">All Stages</option>
            <option value="PROPOSAL">Proposal Scrutiny</option>
            <option value="SIA">SIA Appraisal</option>
            <option value="SEC_11">Section 11 Preliminary</option>
            <option value="SEC_19">Section 19 Declaration</option>
            <option value="AWARD">Award Enquiry</option>
            <option value="COMPENSATION">Compensation DBT</option>
            <option value="POSSESSION">Possession</option>
          </select>
        </div>
      </div>

      {/* Tabular MIS Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Project Name</th>
                <th className="py-3 px-4">Sector</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4 text-right">Target Ha</th>
                <th className="py-3 px-4 text-right">Acquired Ha</th>
                <th className="py-3 px-4 text-right">Budget (₹ Cr)</th>
                <th className="py-3 px-4 text-right">Disbursed (₹ Cr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((r) => (
                <tr key={r.code} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-gov-navy">{r.code}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{r.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700">
                      {r.sector}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.district}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 font-bold text-[10px]">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">{r.targetHa}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">{r.acquiredHa}</td>
                  <td className="py-3 px-4 text-right font-mono">₹{r.budgetCr}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-gov-navy">₹{r.disbursedCr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ministerial Briefing Modal Preview */}
      {showBriefingPreview && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-100">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b-2 border-amber-500 pb-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Government of India • Ministry of Rural Development
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  CONFIDENTIAL EXECUTIVE BRIEFING MEMORANDUM
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Subject: National Land Acquisition Performance & Statutory Compliance Report (September 2026)
                </p>
              </div>
              <button
                onClick={() => setShowBriefingPreview(false)}
                className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900">1. Macro Overview:</p>
                <p>
                  Across the 6 monitored priority corridors, 373.5 Hectares (51.5% of statutory target) have been successfully possessed. Total compensation disbursed via PFMS direct benefit transfer stands at ₹745.3 Crores.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 space-y-1">
                <p className="font-bold text-amber-950">2. Critical Bottlenecks & Statutory SLA Breaches:</p>
                <p>
                  Two projects require immediate inter-ministerial intervention: (a) Samruddhi Feeder Corridor (NH-2026-102) is delayed by 12 days past the Section 25 statutory award deadline due to High Court writ petitions; (b) Upper Godavari Canal (IR-2026-007) requires Stage-1 Forest Clearance approval on PARIVESH.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                <p className="font-bold text-emerald-950">3. R&R Entitlements & Vulnerable Beneficiaries:</p>
                <p>
                  185 project-displaced families have been enrolled under Second Schedule entitlements. 124 constructed housing units have been handed over, and 100% of SC/ST families have received designated livelihood support grants under Section 41.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-gov-navy text-white font-bold text-xs flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Print Official PDF Briefing</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
