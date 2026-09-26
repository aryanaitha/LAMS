"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
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
} from "lucide-react";

export default function RequiringBodyPortalPage() {
  const { t, locale } = useLanguage();

  const [activeTab, setActiveTab] = useState<"submit" | "tracked">("submit");
  const [step, setStep] = useState(1);

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

  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      alert(err.message);
      setIsSubmitting(false);
    }
  };

  const trackedProposals = [
    {
      code: "NH-2026-084",
      name: "Nashik-Pune Industrial Expressway (Sinnar Bypass)",
      status: "SEC_11",
      submittedOn: "15 Jan 2026",
      area: "142.5 Ha",
      budget: "₹480.0 Cr",
      currentStage: "Section 11 Preliminary Notification & Objections",
      checklist: [
        { item: "Feasibility DPR Clearance", status: "VERIFIED" },
        { item: "PARIVESH Forest Clearance", status: "VERIFIED" },
        { item: "Joint Measurement Survey (JMS)", status: "VERIFIED" },
        { item: "Competent Authority Sanction", status: "IN_PROGRESS" },
      ],
    },
    {
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      status: "AWARD",
      submittedOn: "10 Oct 2025",
      area: "96.0 Ha",
      budget: "₹320.0 Cr",
      currentStage: "Section 23 Award Valuation & Verification",
      checklist: [
        { item: "Feasibility DPR Clearance", status: "VERIFIED" },
        { item: "PARIVESH Forest Clearance", status: "VERIFIED" },
        { item: "Joint Measurement Survey", status: "VERIFIED" },
        { item: "Section 19 Final Declaration", status: "VERIFIED" },
      ],
    },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Building className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "अध्येक्षी निकाय पोर्टल (प्रस्ताव प्रबंधन)"
                : "Requiring Body Portal (Proposal Management)"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Submit new land acquisition proposals, upload alignment shapefiles, and track scrutiny checklists.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("submit")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "submit" ? "bg-white text-gov-navy shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "hi" ? "नया प्रस्ताव प्रस्तुत करें" : "Submit New Proposal"}
          </button>
          <button
            onClick={() => setActiveTab("tracked")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "tracked" ? "bg-white text-gov-navy shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "hi" ? "संवीक्षाधीन प्रस्ताव (2)" : "Track Submitted Proposals (2)"}
          </button>
        </div>
      </div>

      {activeTab === "submit" ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-3xl space-y-6">
          {submittedProject ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h2 className="text-lg font-bold text-slate-900">
                Proposal Submitted Successfully!
              </h2>
              <p className="text-xs text-slate-600">
                Your proposal has been assigned a unique national acquisition tracking code:
              </p>
              <div className="inline-block p-3 rounded-lg bg-gov-navy text-amber-400 font-mono font-black text-xl tracking-wider">
                {submittedProject.code}
              </div>
              <p className="text-[11px] text-slate-500">
                Routed to District Collector / CALA Nashik for statutory scrutiny under Rule 4 of RFCTLARR Rules.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setSubmittedProject(null);
                    setProjectName("");
                  }}
                  className="px-4 py-2 rounded-lg bg-gov-navy text-white text-xs font-semibold"
                >
                  Submit Another Proposal
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitProposal} className="space-y-4 text-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                Land Acquisition Proposal Requisition Form
              </h2>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Infrastructure Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Pune-Nashik Greenfield Expressway Bypass"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy bg-white"
                  >
                    <option value="HIGHWAY">Highway / Road Transport</option>
                    <option value="RAILWAY">Railway / Dedicated Freight</option>
                    <option value="IRRIGATION">Irrigation / Water Resources</option>
                    <option value="INDUSTRIAL">Industrial Corridor (MIDC)</option>
                    <option value="TRANSMISSION">Power Transmission Line</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Area (Hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={targetAreaHa}
                    onChange={(e) => setTargetAreaHa(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg text-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-100 rounded-lg text-slate-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget Sanction (₹ Cr)</label>
                  <input
                    type="number"
                    required
                    value={budgetCr}
                    onChange={(e) => setBudgetCr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                  />
                </div>
              </div>

              {/* Document Upload Mock */}
              <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 text-center space-y-2">
                <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-slate-600 font-semibold">
                  Upload Project Alignment Shapefile (.zip) & DPR Feasibility Report
                </p>
                <p className="text-[11px] text-slate-400">ESRI Shapefile or GeoJSON format</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-bold transition shadow flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? "Generating Project ID & Routing..." : "Submit Proposal for Scrutiny"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Tracked Proposals List */
        <div className="space-y-4">
          {trackedProposals.map((p) => (
            <div
              key={p.code}
              className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {p.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{p.name}</h3>
                  <p className="text-xs text-slate-500">
                    Submitted: {p.submittedOn} • Area: {p.area} • Budget: {p.budget}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                  {p.currentStage}
                </span>
              </div>

              {/* Scrutiny Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {p.checklist.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between"
                  >
                    <span className="text-slate-700 font-semibold">{c.item}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        c.status === "VERIFIED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
