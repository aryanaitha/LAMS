"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Home,
  Briefcase,
  Coins,
  ShieldAlert,
  ArrowUpRight,
  Download,
} from "lucide-react";

export default function RrTrackerPage() {
  const { t, locale } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [vulnerabilityFilter, setVulnerabilityFilter] = useState<string>("ALL");

  // Synthetic R&R beneficiary families dataset matching seed
  const families = [
    {
      id: "RR-2026-001",
      headName: "Gangaram Bapu Shinde",
      village: "Musalgaon",
      tehsil: "Sinnar",
      familyMembers: 5,
      vulnerability: "MARGINAL_FARMER",
      project: "NH-2026-084 (Sinnar Bypass)",
      surveyNo: "108/3",
      entitlements: {
        housing: { name: "Indira Awas 50 sq.m Housing Unit", status: "COMPLETED", value: "₹3,50,000" },
        subsistence: { name: "Subsistence Allowance (12 months)", status: "COMPLETED", value: "₹50,000" },
        annuity: { name: "Monthly Annuity Grant (₹2,500/mo)", status: "ACTIVE", value: "₹2,500/mo" },
        resettlement: { name: "Transport & Shifting Grant", status: "COMPLETED", value: "₹50,000" },
      },
      overallProgress: 100,
    },
    {
      id: "RR-2026-002",
      headName: "Savita Shantaram Pawar (Widow)",
      village: "Gonde",
      tehsil: "Sinnar",
      familyMembers: 4,
      vulnerability: "WOMEN_HEADED",
      project: "NH-2026-084 (Sinnar Bypass)",
      surveyNo: "112/1",
      entitlements: {
        housing: { name: "Indira Awas Housing Unit", status: "IN_PROGRESS", value: "₹3,50,000" },
        subsistence: { name: "Subsistence Allowance", status: "COMPLETED", value: "₹50,000" },
        annuity: { name: "Mandatory Job or Annuity", status: "PENDING_VERIFICATION", value: "₹2,500/mo" },
        resettlement: { name: "Petty Shop / Cattle Shed Grant", status: "IN_PROGRESS", value: "₹25,000" },
      },
      overallProgress: 65,
    },
    {
      id: "RR-2026-003",
      headName: "Eknath Kashinath Jadhav",
      village: "Pandhurli",
      tehsil: "Sinnar",
      familyMembers: 6,
      vulnerability: "SC",
      project: "NH-2026-084 (Sinnar Bypass)",
      surveyNo: "115/4",
      entitlements: {
        housing: { name: "Indira Awas Housing Unit", status: "COMPLETED", value: "₹3,50,000" },
        subsistence: { name: "Subsistence Allowance", status: "COMPLETED", value: "₹50,000" },
        annuity: { name: "Monthly Annuity Grant", status: "ACTIVE", value: "₹2,500/mo" },
        resettlement: { name: "Additional SC/ST Special Grant (Sec 41)", status: "COMPLETED", value: "₹50,000" },
      },
      overallProgress: 90,
    },
    {
      id: "RR-2026-004",
      headName: "Dattatray Vitthal Kulkarni",
      village: "Vadgaon Sinnar",
      tehsil: "Sinnar",
      familyMembers: 3,
      vulnerability: "NONE",
      project: "IN-2026-031 (Sinnar MIDC)",
      surveyNo: "124/2",
      entitlements: {
        housing: { name: "Cash in lieu of House (₹4.5L)", status: "COMPLETED", value: "₹4,50,000" },
        subsistence: { name: "Subsistence Allowance", status: "COMPLETED", value: "₹50,000" },
        annuity: { name: "One-time lump sum annuity", status: "COMPLETED", value: "₹5,00,000" },
        resettlement: { name: "Resettlement Allowance", status: "COMPLETED", value: "₹50,000" },
      },
      overallProgress: 100,
    },
    {
      id: "RR-2026-005",
      headName: "Barku Devram Gaikwad",
      village: "Dodi Khurd",
      tehsil: "Sinnar",
      familyMembers: 7,
      vulnerability: "ST",
      project: "NH-2026-084 (Sinnar Bypass)",
      surveyNo: "131/1",
      entitlements: {
        housing: { name: "Forest Settlement Rights Unit", status: "IN_PROGRESS", value: "₹3,50,000" },
        subsistence: { name: "Subsistence Allowance", status: "COMPLETED", value: "₹50,000" },
        annuity: { name: "Tribal Community Livelihood Grant", status: "IN_PROGRESS", value: "₹3,000/mo" },
        resettlement: { name: "Sec 41 Scheduled Tribe Development Grant", status: "IN_PROGRESS", value: "₹75,000" },
      },
      overallProgress: 55,
    },
  ];

  const filteredFamilies = families.filter((f) => {
    const matchesSearch =
      f.headName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.surveyNo.includes(searchTerm);

    const matchesVuln =
      vulnerabilityFilter === "ALL" || f.vulnerability === vulnerabilityFilter;

    return matchesSearch && matchesVuln;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Users className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "परिवार-वार पुनर्वासन एवं पुनर्व्यवस्थापन (R&R) ट्रैकर"
                : "Family-Wise Rehabilitation & Resettlement (R&R) Tracker"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {locale === "hi"
              ? "आरएफसीटीएलएआरआर अधिनियम 2013 की द्वितीय अनुसूची के तहत विस्थापित परिवारों की पात्रता एवं प्रगति ट्रैकिंग।"
              : "Second Schedule statutory entitlements tracking for project-affected displaced families under RFCTLARR Act 2013."}
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold hover:bg-slate-800 transition"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>{locale === "hi" ? "आर&आर रिपोर्ट डाउनलोड करें" : "Export R&R MIS Register"}</span>
        </button>
      </div>

      {/* R&R Macro Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Displaced Families</p>
          <p className="text-2xl font-black text-slate-900 mt-1">185</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 6 projects</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Vulnerable Families</p>
          <p className="text-2xl font-black text-purple-700 mt-1">68 (36.7%)</p>
          <p className="text-[11px] text-purple-600 mt-0.5">SC / ST / Women-Headed</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Housing Units Handed Over</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">124 / 185</p>
          <p className="text-[11px] text-emerald-600 mt-0.5">67% Construction Completed</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total R&R Budget Disbursed</p>
          <p className="text-2xl font-black text-amber-600 mt-1">₹14.8 Cr</p>
          <p className="text-[11px] text-amber-700 mt-0.5">₹19.2 Cr Sanctioned</p>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              locale === "hi"
                ? "परिवार मुखिया का नाम, ग्राम, सर्वे नंबर या आईडी खोजें..."
                : "Search by family head name, village, survey number, or R&R ID..."
            }
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={vulnerabilityFilter}
            onChange={(e) => setVulnerabilityFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700"
          >
            <option value="ALL">{locale === "hi" ? "सभी श्रेणियां" : "All Vulnerability Categories"}</option>
            <option value="WOMEN_HEADED">{locale === "hi" ? "महिला मुखिया परिवार" : "Women-Headed Household"}</option>
            <option value="SC">{locale === "hi" ? "अनुसूचित जाति (SC)" : "Scheduled Caste (SC)"}</option>
            <option value="ST">{locale === "hi" ? "अनुसूचित जनजाति (ST)" : "Scheduled Tribe (ST)"}</option>
            <option value="MARGINAL_FARMER">{locale === "hi" ? "सीमांत कृषक" : "Marginal Farmer (<1 Ha)"}</option>
          </select>
        </div>
      </div>

      {/* Beneficiary Family Dossiers Cards */}
      <div className="space-y-4">
        {filteredFamilies.map((fam) => (
          <div
            key={fam.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 hover:shadow-md transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {fam.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">{fam.headName}</h3>
                  {fam.vulnerability !== "NONE" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                      <ShieldAlert className="w-3 h-3 text-purple-600" />
                      <span>{fam.vulnerability.replace("_", " ")}</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {fam.village} ({fam.tehsil} Tehsil) • Survey No: {fam.surveyNo} • {fam.familyMembers} Family Members • {fam.project}
                </p>
              </div>

              <div className="text-right">
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {locale === "hi" ? "समग्र आर&आर पूर्णता:" : "R&R Settlement:"}
                  </span>
                  <span className="text-sm font-black font-mono text-gov-navy">
                    {fam.overallProgress}%
                  </span>
                </div>
                <div className="w-32 bg-slate-200 h-2 rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      fam.overallProgress === 100 ? "bg-emerald-600" : "bg-amber-500"
                    }`}
                    style={{ width: `${fam.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Statutory Entitlements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Home className="w-4 h-4 text-gov-navy" />
                  <span>{locale === "hi" ? "आवास इकाई" : "Housing Unit"}</span>
                </div>
                <p className="text-[11px] text-slate-500">{fam.entitlements.housing.name}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-slate-800">
                    {fam.entitlements.housing.value}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      fam.entitlements.housing.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {fam.entitlements.housing.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Coins className="w-4 h-4 text-gov-navy" />
                  <span>{locale === "hi" ? "निर्वाह भत्ता" : "Subsistence Allowance"}</span>
                </div>
                <p className="text-[11px] text-slate-500">{fam.entitlements.subsistence.name}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-slate-800">
                    {fam.entitlements.subsistence.value}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    COMPLETED
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <Briefcase className="w-4 h-4 text-gov-navy" />
                  <span>{locale === "hi" ? "मासिक वार्षिकी / रोजगार" : "Monthly Annuity"}</span>
                </div>
                <p className="text-[11px] text-slate-500">{fam.entitlements.annuity.name}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-slate-800">
                    {fam.entitlements.annuity.value}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                    {fam.entitlements.annuity.status}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-gov-navy" />
                  <span>{locale === "hi" ? "पुनर्स्थापन अनुदान" : "Shifting / Special Grant"}</span>
                </div>
                <p className="text-[11px] text-slate-500">{fam.entitlements.resettlement.name}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono font-bold text-slate-800">
                    {fam.entitlements.resettlement.value}
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {fam.entitlements.resettlement.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
