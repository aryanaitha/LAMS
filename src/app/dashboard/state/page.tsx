"use client";

import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { StatCard } from "@/components/ui/StatCard";
import Link from "next/link";
import {
  Building,
  Layers,
  Coins,
  AlertTriangle,
  ArrowRight,
  Download,
  MapPin,
} from "lucide-react";

export default function StateDashboardPage() {
  const { t, locale } = useLanguage();

  const districtComparison = [
    {
      district: "Nashik District",
      projectsCount: 4,
      totalAreaHa: "512.5 Ha",
      acquiredHa: "343.0 Ha",
      disbursedCr: "₹647.3 Cr",
      delayedCount: 2,
    },
    {
      district: "Pune District",
      projectsCount: 2,
      totalAreaHa: "312.0 Ha",
      acquiredHa: "30.5 Ha",
      disbursedCr: "₹98.0 Cr",
      delayedCount: 0,
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
            State-level monitoring of RFCTLARR Act acquisitions, CALA performance, and gazette notifications.
          </p>
        </div>

        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Export State Progress Report</span>
        </Link>
      </div>

      {/* State Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="State Projects"
          value="6"
          subtitle="Across Nashik & Pune"
          icon={Building}
          variant="info"
        />
        <StatCard
          title="Total State Acquired"
          value="373.5 Ha"
          subtitle="Target: 824.5 Ha"
          icon={Layers}
          variant="success"
        />
        <StatCard
          title="DBT Disbursed"
          value="₹745.3 Cr"
          subtitle="Treasury Direct Transfer"
          icon={Coins}
          variant="warning"
        />
        <StatCard
          title="Litigation Parcels"
          value="20"
          subtitle="High Court WP Disposals"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* District Comparison Table */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          District-Wise Land Acquisition Progress
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2.5">District</th>
                <th className="py-2.5">Projects</th>
                <th className="py-2.5">Target Area</th>
                <th className="py-2.5">Acquired Area</th>
                <th className="py-2.5">Compensation Disbursed</th>
                <th className="py-2.5">Delayed Corridors</th>
                <th className="py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {districtComparison.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gov-navy" />
                    <span>{d.district}</span>
                  </td>
                  <td className="py-3 font-mono">{d.projectsCount}</td>
                  <td className="py-3 font-mono">{d.totalAreaHa}</td>
                  <td className="py-3 font-mono font-bold text-emerald-700">{d.acquiredHa}</td>
                  <td className="py-3 font-mono font-bold text-gov-navy">{d.disbursedCr}</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        d.delayedCount > 0
                          ? "bg-rose-100 text-rose-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {d.delayedCount} Delayed
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/gis?district=${d.district.split(" ")[0]}`}
                      className="text-xs font-semibold text-gov-navy hover:text-amber-600 transition"
                    >
                      View on Map →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
