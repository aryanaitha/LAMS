"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/i18n/LanguageContext";
import Link from "next/link";
import {
  Settings,
  Clock,
  UserPlus,
  ShieldCheck,
  Sliders,
  Database,
  CheckCircle2,
  AlertTriangle,
  Users,
  Activity,
  Server,
  Lock,
  ExternalLink,
  ShieldAlert,
  FileText,
} from "lucide-react";

function AdminContent() {
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") || "roles";
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "sla" | "master" | "templates">(
    tabParam === "users"
      ? "users"
      : tabParam === "sla"
      ? "sla"
      : tabParam === "master"
      ? "master"
      : tabParam === "templates"
      ? "templates"
      : "roles"
  );

  useEffect(() => {
    if (tabParam === "roles") setActiveTab("roles");
    else if (tabParam === "sla") setActiveTab("sla");
    else if (tabParam === "master") setActiveTab("master");
    else if (tabParam === "users") setActiveTab("users");
    else if (tabParam === "templates") setActiveTab("templates");
  }, [tabParam]);

  const [templates, setTemplates] = useState([
    {
      id: "sec11",
      name: "Section 11 Preliminary Notification",
      type: "SMS & Email",
      content: "GOI LAMS: Preliminary notification under Section 11(1) issued for Survey No. {{survey_no}} in {{village}}. Objections may be filed within 60 days.",
    },
    {
      id: "sec15",
      name: "Section 15 Hearing Summons",
      type: "SMS & Speed Post",
      content: "CALA Notice: Hearing for objection on Survey No. {{survey_no}} scheduled at Collectorate on {{hearing_date}} at 11:00 AM.",
    },
    {
      id: "award",
      name: "Section 23 Compensation Award Disbursement",
      type: "SMS & Email",
      content: "GOI LAMS: Final compensation of ₹{{amount}} credited to your bank account via PFMS DBT. UTR: {{utr}}.",
    },
  ]);
  const [templateSaveMessage, setTemplateSaveMessage] = useState<string | null>(null);

  // SLA and parameter state
  const [scrutinyDays, setScrutinyDays] = useState(15);
  const [appraisalDays, setAppraisalDays] = useState(60);
  const [hearingDays, setHearingDays] = useState(60);
  const [awardDays, setAwardDays] = useState(90);
  const [slaSaveMessage, setSlaSaveMessage] = useState<string | null>(null);

  // Provisioning form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "DISTRICT_COLLECTOR",
    department: "",
    jurisdiction: "",
  });
  const [provisionMessage, setProvisionMessage] = useState<string | null>(null);

  const handleProvisionUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    setProvisionMessage(
      locale === "hi"
        ? `उपयोगकर्ता '${newUser.name}' (${newUser.role}) सफलतापूर्वक बनाया गया। डिफ़ॉल्ट पासवर्ड 'Demo@123' सेट किया गया।`
        : `User '${newUser.name}' provisioned successfully with role ${newUser.role}. Initial password: Demo@123.`
    );

    setNewUser({
      name: "",
      email: "",
      role: "DISTRICT_COLLECTOR",
      department: "",
      jurisdiction: "",
    });

    setTimeout(() => setProvisionMessage(null), 4000);
  };

  const handleSaveSla = () => {
    setSlaSaveMessage("Statutory SLA configurations committed to system memory.");
    setTimeout(() => setSlaSaveMessage(null), 3000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Settings className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi" ? "राष्ट्रीय प्रशासन एवं एसएलए नियंत्रण कंसोल" : "Admin Console & System Operations"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System Administration • Role RBAC Enforcement, SLA Control, Master Data & Cryptographic Audit
          </p>
        </div>

        {/* Audit Logs Quick Link */}
        <Link
          href="/audit"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold transition shadow-xs"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>View SHA-256 Audit Trail</span>
        </Link>
      </div>

      {/* System Health / Usage Stats ONLY (Strictly zero case data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active System Users
            </span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">9</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Across all 7 roles</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              SLA Watchdog Timers
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">14 Active</div>
          <span className="text-[11px] text-slate-500">Statutory countdown engines</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Cryptographic Audit Blocks
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">42 Blocks</div>
          <span className="text-[11px] text-emerald-600 font-semibold">SHA-256 Hash Chained</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Core Engine Uptime
            </span>
            <Activity className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono">99.98%</div>
          <span className="text-[11px] text-slate-500">Database Connected (Prisma)</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "users"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>{locale === "hi" ? "उपयोगकर्ता प्रबंधन" : "User Management"}</span>
        </button>

        <button
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "roles"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{locale === "hi" ? "भूमिका प्रबंधन" : "Role Management"}</span>
        </button>

        <button
          onClick={() => setActiveTab("sla")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "sla"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>{locale === "hi" ? "कार्यप्रवाह/एसएलए विन्यास" : "Workflow/SLA Config"}</span>
        </button>

        <button
          onClick={() => setActiveTab("master")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "master"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{locale === "hi" ? "मास्टर डेटा" : "Master Data"}</span>
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === "templates"
              ? "bg-gov-navy text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{locale === "hi" ? "अधिसूचना टेम्पलेट्स" : "Notification Templates"}</span>
        </button>
      </div>

      {/* 1. User Management (Provisioning) */}
      {activeTab === "users" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "शासकीय भूमिका प्रावधान (User Provisioning)" : "Provision Official User Account"}
            </h2>
          </div>

          <p className="text-xs text-slate-500">
            Under SIH26016 rules, only Landowners can self-register. All official roles (Collector, Ministry, State, NHAI, Field Officer) are strictly provisioned by the Administrator.
          </p>

          {provisionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{provisionMessage}</span>
            </div>
          )}

          <form onSubmit={handleProvisionUser} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name & Designation</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shri Rajesh Kumar, IAS"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official NIC / Gov Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh.kumar@gov.in"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Statutory Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                >
                  <option value="DISTRICT_COLLECTOR">District Collector / CALA</option>
                  <option value="CENTRAL_MINISTRY">Central Ministry (DoLR/MoRD)</option>
                  <option value="STATE_OFFICER">State Government (Revenue Dept)</option>
                  <option value="REQUIRING_BODY">Requiring Body (NHAI/Railways)</option>
                  <option value="FIELD_OFFICER">Field Revenue Officer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Revenue & CALA Branch"
                  value={newUser.department}
                  onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Jurisdiction Scope</label>
                <input
                  type="text"
                  placeholder="e.g. Alwar District"
                  value={newUser.jurisdiction}
                  onChange={(e) => setNewUser({ ...newUser, jurisdiction: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-gov-navy"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-gov-navy text-white font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow"
            >
              <UserPlus className="w-4 h-4 text-amber-400" />
              <span>Provision Official Account</span>
            </button>
          </form>
        </div>
      )}

      {/* 2. Role Management & Permission Matrix */}
      {activeTab === "roles" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gov-navy" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "केंद्रीकृत भूमिका अधिकार मैट्रिक्स (RBAC)" : "Centralized Role-Permission Matrix"}
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
              Edge Middleware Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                  <th className="py-2.5 px-3">System Role</th>
                  <th className="py-2.5 px-3">Jurisdiction</th>
                  <th className="py-2.5 px-3">Top Ribbon Items</th>
                  <th className="py-2.5 px-3">Case Modification</th>
                  <th className="py-2.5 px-3">Scope Boundary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">Central Ministry</td>
                  <td className="py-3 px-3">National</td>
                  <td className="py-3 px-3 text-slate-600">National Dashboard, GIS Map, Reports</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">Read-Only</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">All India Projects</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">State Government</td>
                  <td className="py-3 px-3">Maharashtra</td>
                  <td className="py-3 px-3 text-slate-600">State Dashboard, GIS Map, Reports</td>
                  <td className="py-3 px-3 text-slate-400 font-mono">Read-Only</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">State Projects Only</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">District Collector (CALA)</td>
                  <td className="py-3 px-3">Nashik District</td>
                  <td className="py-3 px-3 text-slate-600 space-y-1">
                    <div>District Dashboard, Scrutiny, Workflow, GIS, Documents</div>
                    <div className="flex gap-1.5 pt-1">
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        view:gis_explorer
                      </span>
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                        manage:awards
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 font-bold font-mono">Full Judicial Sanction</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">District Cases</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">Requiring Body (NHAI)</td>
                  <td className="py-3 px-3">Western PIU</td>
                  <td className="py-3 px-3 text-slate-600">My Projects, New Proposal, Documents, GIS</td>
                  <td className="py-3 px-3 text-amber-700 font-mono">Submit Proposals</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">Own Projects Only</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">Field Revenue Officer</td>
                  <td className="py-3 px-3">Sinnar Tehsil</td>
                  <td className="py-3 px-3 text-slate-600">My Assigned Tasks, Field Data Capture</td>
                  <td className="py-3 px-3 text-teal-700 font-mono">Log JMS Ground Surveys</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">Assigned Parcels Only</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-900">Landowner / Citizen</td>
                  <td className="py-3 px-3">Musalgaon</td>
                  <td className="py-3 px-3 text-slate-600">My Land, File Objection, Compensation Timeline</td>
                  <td className="py-3 px-3 text-purple-700 font-mono">Lodge Objections</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-rose-700 font-bold">Own Holding Strictly</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-amber-50/30">
                  <td className="py-3 px-3 font-bold text-slate-900">System Administrator</td>
                  <td className="py-3 px-3">System-wide</td>
                  <td className="py-3 px-3 text-slate-600">User Mgmt, Role Mgmt, SLA Config, Master Data, Audit</td>
                  <td className="py-3 px-3 text-rose-700 font-bold font-mono">STRICTLY BLOCKED</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500">System Ops (No Case Data)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Workflow / SLA Timers Config */}
      {activeTab === "sla" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "वैधानिक एसएलए टाइमर विन्यास" : "Statutory SLA Timers Configuration"}
            </h2>
          </div>

          {slaSaveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{slaSaveMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 flex justify-between">
                  <span>Proposal Scrutiny SLA</span>
                  <span className="font-mono font-bold text-gov-navy">{scrutinyDays} Days</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={scrutinyDays}
                  onChange={(e) => setScrutinyDays(parseInt(e.target.value, 10))}
                  className="w-full mt-1.5 accent-gov-navy"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 flex justify-between">
                  <span>SIA & Appraisal Committee SLA</span>
                  <span className="font-mono font-bold text-gov-navy">{appraisalDays} Days</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={appraisalDays}
                  onChange={(e) => setAppraisalDays(parseInt(e.target.value, 10))}
                  className="w-full mt-1.5 accent-gov-navy"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 flex justify-between">
                  <span>Section 15 Objection Hearings SLA</span>
                  <span className="font-mono font-bold text-gov-navy">{hearingDays} Days</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="90"
                  value={hearingDays}
                  onChange={(e) => setHearingDays(parseInt(e.target.value, 10))}
                  className="w-full mt-1.5 accent-gov-navy"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 flex justify-between">
                  <span>Section 23 Award Enquiry SLA</span>
                  <span className="font-mono font-bold text-gov-navy">{awardDays} Days</span>
                </label>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={awardDays}
                  onChange={(e) => setAwardDays(parseInt(e.target.value, 10))}
                  className="w-full mt-1.5 accent-gov-navy"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleSaveSla}
              className="px-5 py-2.5 rounded-lg bg-gov-navy text-white font-bold hover:bg-slate-800 transition"
            >
              Save Statutory SLA Configuration
            </button>
          </div>
        </div>
      )}

      {/* 4. Master Data */}
      {activeTab === "master" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Database className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              System Master Data Reference
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-900 block">RFCTLARR Statutory Multipliers</span>
              <p className="text-slate-600">Rural Multiplier Factor: <strong>1.5x (Factor 2)</strong></p>
              <p className="text-slate-600">Solatium Mandate: <strong>100.0%</strong></p>
              <p className="text-slate-600">Additional Interest Rate: <strong>12.0% p.a.</strong></p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-900 block">Registered Sectors</span>
              <p className="text-slate-600">• HIGHWAY (MoRTH / NHAI)</p>
              <p className="text-slate-600">• RAILWAY (Ministry of Railways)</p>
              <p className="text-slate-600">• INDUSTRIAL (State MIDCs)</p>
              <p className="text-slate-600">• IRRIGATION (Water Resources)</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="font-bold text-slate-900 block">External Integration Gateways</span>
              <p className="text-slate-600">• RoR / MahaBhulekh 7/12</p>
              <p className="text-slate-600">• Bhu-Naksha Vector GIS</p>
              <p className="text-slate-600">• PFMS Direct Benefit Transfer</p>
              <p className="text-slate-600">• PARIVESH Forest Clearance</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. Notification Templates */}
      {activeTab === "templates" && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Statutory Notification & SMS Templates
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Administer standard communication templates dispatched to citizens across acquisition milestones.
              </p>
            </div>
            {templateSaveMessage && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{templateSaveMessage}</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {templates.map((tpl, idx) => (
              <div key={tpl.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {tpl.id.toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{tpl.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold border border-blue-200">
                    {tpl.type}
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Template Content:
                  </label>
                  <textarea
                    value={tpl.content}
                    onChange={(e) => {
                      const newContent = e.target.value;
                      setTemplates((prev) =>
                        prev.map((t, i) => (i === idx ? { ...t, content: newContent } : t))
                      );
                    }}
                    rows={2}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-1 focus:ring-gov-navy focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setTemplateSaveMessage(`Template '${tpl.name}' committed to notification dispatcher.`);
                      setTimeout(() => setTemplateSaveMessage(null), 3500);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0a2240] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Save Template</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminConsolePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Admin Console...</div>}>
      <AdminContent />
    </Suspense>
  );
}
