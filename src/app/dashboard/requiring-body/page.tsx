"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  FilePlus,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building,
  Layers,
  FileCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  FolderOpen,
  Map,
} from "lucide-react";

function RequiringBodyContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "projects";
  const [activeTab, setActiveTab] = useState<"projects" | "new-proposal">(
    tabParam === "new-proposal" ? "new-proposal" : "projects"
  );

  useEffect(() => {
    if (tabParam === "new-proposal") setActiveTab("new-proposal");
    else if (tabParam === "projects") setActiveTab("projects");
  }, [tabParam]);

  // Proposal form state
  const [projectName, setProjectName] = useState("");
  const [sector, setSector] = useState("HIGHWAY");
  const [state, setState] = useState("Maharashtra");
  const [district, setDistrict] = useState("Nashik");
  const [tehsils, setTehsils] = useState("Sinnar, Niphad");
  const [targetAreaHa, setTargetAreaHa] = useState("120.0");
  const [budgetCr, setBudgetCr] = useState("380.0");

  const [submittedProject, setSubmittedProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          sector,
          state,
          district,
          tehsils,
          targetAreaHa: parseFloat(targetAreaHa),
          budgetCr: parseFloat(budgetCr),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit proposal");
      }

      setSubmittedProject(data.project);
      setIsSubmitting(false);
    } catch (err: any) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  // Strictly NHAI Western Region Projects ONLY (no railway, irrigation, or power projects)
  const nhaiProjects = [
    {
      code: "NH-2026-084",
      name: "Nashik-Pune Industrial Expressway (Sinnar Bypass)",
      nameHi: "नासिक-पुणे औद्योगिक एक्सप्रेसवे (सिन्नर बाईपास)",
      status: "SEC_11",
      submittedOn: "15 Jan 2026",
      area: "142.5 Ha",
      budget: "₹480.0 Cr",
      disbursed: "₹84.5 Cr",
      currentStage: "Section 11 Preliminary Notification & Objections",
      parcelsCount: 280,
      checklist: [
        { item: "Feasibility DPR Clearance (MoRTH)", status: "VERIFIED" },
        { item: "PARIVESH Forest Clearance Stage-1", status: "VERIFIED" },
        { item: "Joint Measurement Survey (JMS)", status: "VERIFIED" },
        { item: "Competent Authority Sanction", status: "IN_PROGRESS" },
      ],
    },
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      nameHi: "समृद्धि महामार्ग फीडर कॉरिडोर (निफाड लिंक)",
      status: "AWARD",
      submittedOn: "10 Oct 2025",
      area: "96.0 Ha",
      budget: "₹320.0 Cr",
      disbursed: "₹120.0 Cr",
      currentStage: "Section 23 Award Valuation & Verification",
      parcelsCount: 190,
      checklist: [
        { item: "Feasibility DPR Clearance", status: "VERIFIED" },
        { item: "PARIVESH Forest Clearance Stage-2", status: "VERIFIED" },
        { item: "Joint Measurement Survey", status: "VERIFIED" },
        { item: "Section 19 Final Declaration", status: "VERIFIED" },
      ],
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Building className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "परियोजना क्रियान्वयन निकाय पोर्टल (NHAI)"
                : "Project Implementing Body Portal (NHAI Western PIU)"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            National Highways Authority of India • Section 4 Proposal Submissions & Progress Tracking
          </p>
        </div>

        {/* Agency Isolation Badge */}
        <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Agency Scope: NHAI Corridors Only</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("projects")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "projects"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{locale === "hi" ? "मेरी परियोजनाएं" : "My Projects"}</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full font-mono">
            {nhaiProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("new-proposal")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "new-proposal"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FilePlus className="w-4 h-4" />
          <span>{locale === "hi" ? "नया प्रस्ताव प्रस्तुत करें" : "New Proposal (Sec 4)"}</span>
        </button>
      </div>

      {/* 1. My Projects View */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nhaiProjects.map((project) => (
              <div
                key={project.code}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-gov-navy text-white">
                      {project.code}
                    </span>
                    <h2 className="text-base font-bold text-slate-900 mt-1">
                      {locale === "hi" ? project.nameHi : project.name}
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                    {project.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Target Area</span>
                    <p className="font-mono font-bold text-slate-900">{project.area}</p>
                    <span className="text-[10px] text-slate-500">{project.parcelsCount} Parcels</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Budget</span>
                    <p className="font-mono font-bold text-slate-900">{project.budget}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">{project.disbursed} Paid</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Stage</span>
                    <p className="text-[11px] font-bold text-gov-navy truncate">{project.currentStage.split(" ")[0]}</p>
                    <span className="text-[10px] text-slate-500">Active</span>
                  </div>
                </div>

                {/* Statutory Document Checklist */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Statutory Submission Checklist
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    {project.checklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <span className="text-slate-700">{item.item}</span>
                        <span
                          className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === "VERIFIED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/gis?project=${project.code}`}
                    className="text-xs text-gov-navy hover:underline font-bold flex items-center gap-1"
                  >
                    <span>View Corridor on Satellite GIS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/documents"
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                  >
                    <span>Uploaded Documents</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. New Proposal Submission Form */}
      {activeTab === "new-proposal" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi"
                ? "नया भू-अर्जन प्रस्ताव प्रस्तुत करें (धारा 4, RFCTLARR Act 2013)"
                : "Submit New Land Acquisition Proposal (Section 4, RFCTLARR Act 2013)"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Initiate formal acquisition proposal with DPR annexure for Competent Authority (CALA) scrutiny.
            </p>
          </div>

          {submitError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2">
              <span className="font-bold">Submission Error:</span>
              <span>{submitError}</span>
            </div>
          )}

          {submittedProject && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Proposal Submitted Successfully for Scrutiny!</span>
              </div>
              <p>
                Generated Project Reference Code: <strong>{submittedProject.code}</strong>.
                Forwarded to District Collector & CALA Nashik for Rule 4 Scrutiny.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Project Title / Alignment Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NH-60 Niphad-Sinnar Greenfield Link Corridor"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Infrastructure Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                >
                  <option value="HIGHWAY">National Highway / Expressway</option>
                  <option value="RAILWAY">Railway Line</option>
                  <option value="INDUSTRIAL">Industrial Corridor</option>
                  <option value="IRRIGATION">Irrigation Canal</option>
                  <option value="TRANSMISSION">Power Transmission Line</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tehsils</label>
                <input
                  type="text"
                  required
                  value={tehsils}
                  onChange={(e) => setTehsils(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Estimated Target Land Area (Hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={targetAreaHa}
                  onChange={(e) => setTargetAreaHa(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Estimated Land Acquisition Budget (₹ Crores)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={budgetCr}
                  onChange={(e) => setBudgetCr(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-1 bg-slate-50">
              <Upload className="w-6 h-6 text-slate-400 mx-auto" />
              <p className="font-semibold text-slate-700">Detailed Project Report (DPR) & Alignment KML File</p>
              <p className="text-[10px] text-slate-400">PDF, ZIP or GeoJSON (Max 100MB)</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-gov-navy text-white font-bold hover:bg-slate-800 transition flex items-center gap-2 shadow"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{isSubmitting ? "Submitting..." : "Submit Section 4 Proposal"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function RequiringBodyPortalPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Requiring Body Console...</div>}>
      <RequiringBodyContent />
    </Suspense>
  );
}
