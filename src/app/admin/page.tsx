"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Settings,
  Clock,
  FastForward,
  UserPlus,
  ShieldCheck,
  Sliders,
  Database,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Users,
} from "lucide-react";

export default function AdminConsolePage() {
  const { t, locale } = useLanguage();

  // SLA and parameter state
  const [scrutinyDays, setScrutinyDays] = useState(15);
  const [appraisalDays, setAppraisalDays] = useState(60);
  const [hearingDays, setHearingDays] = useState(60);
  const [awardDays, setAwardDays] = useState(90);
  const [solatiumPct, setSolatiumPct] = useState(100);
  const [ruralMultiplier, setRuralMultiplier] = useState(1.5);

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

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-gov-navy">
          <Settings className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {locale === "hi" ? "राष्ट्रीय प्रशासन एवं एसएलए नियंत्रण कंसोल" : "Admin Console & SLA Control Center"}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {locale === "hi"
            ? "वैधानिक समय-सीमा कॉन्फ़िगरेशन, शासकीय भूमिका प्रावधान, एवं भूमिका अधिकार मैट्रिक्स।"
            : "Statutory SLA timers, official user role provisioning, system master data, and centralized access matrix."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: SLA & Statutory Parameters */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              {locale === "hi" ? "वैधानिक एसएलए टाइमर विन्यास" : "Statutory SLA Timers Configuration"}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
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

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert("SLA parameters saved to database.")}
                className="w-full py-2 rounded-lg bg-gov-navy hover:bg-slate-800 text-white text-xs font-semibold transition"
              >
                {t.actions.save}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Government Role Provisioning */}
        <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <UserPlus className="w-4 h-4 text-amber-600" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "शासकीय भूमिका प्रावधान (Role Provisioning)" : "Official Role Provisioning"}
              </h2>
              <p className="text-[11px] text-slate-400">
                {locale === "hi"
                  ? "विभागीय अधिकारियों के खाते केवल व्यवस्थापक द्वारा बनाए जा सकते हैं।"
                  : "Government officer accounts are strictly provisioned by Admin."}
              </p>
            </div>
          </div>

          {provisionMessage && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{provisionMessage}</span>
            </div>
          )}

          <form onSubmit={handleProvisionUser} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700">Officer Legal Name</label>
              <input
                type="text"
                required
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="e.g. Shri Rajesh Patil, Additional Collector"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700">Official Gov.in Email</label>
              <input
                type="email"
                required
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="rajesh.patil@lams.gov.in"
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700">Authorized Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy bg-white"
                >
                  <option value="CENTRAL_MINISTRY">Central Ministry</option>
                  <option value="STATE_OFFICER">State Revenue Dept</option>
                  <option value="DISTRICT_COLLECTOR">District Collector / CALA</option>
                  <option value="REQUIRING_BODY">Requiring Body (NHAI/Rail)</option>
                  <option value="FIELD_OFFICER">Field Revenue Officer</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Jurisdiction District/Tehsil</label>
                <input
                  type="text"
                  value={newUser.jurisdiction}
                  onChange={(e) => setNewUser({ ...newUser, jurisdiction: e.target.value })}
                  placeholder="e.g. Nashik District"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition shadow-xs"
              >
                Provision Official Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3. Centralized Permission Matrix (Read-Only) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gov-navy" />
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                {locale === "hi" ? "केंद्रीकृत भूमिका अधिकार मैट्रिक्स" : "Centralized Role-Permission Matrix"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Strictly enforced via Edge Middleware &amp; client-side &lt;Can /&gt; components (src/lib/permissions.ts)
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
            Edge Middleware Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <th className="py-2.5 px-3 font-bold">Statutory Permission / Action</th>
                <th className="py-2.5 px-2 text-center font-bold">ADMIN</th>
                <th className="py-2.5 px-2 text-center font-bold">CENTRAL</th>
                <th className="py-2.5 px-2 text-center font-bold">STATE</th>
                <th className="py-2.5 px-2 text-center font-bold">COLLECTOR</th>
                <th className="py-2.5 px-2 text-center font-bold">REQ BODY</th>
                <th className="py-2.5 px-2 text-center font-bold">FIELD OFF.</th>
                <th className="py-2.5 px-2 text-center font-bold">CITIZEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
              {[
                { id: "view:national_dashboard", name: "National Dashboard (Macro Analytics)", roles: ["ADMIN", "CENTRAL_MINISTRY", "STATE_OFFICER"] },
                { id: "view:collector_console", name: "Collector Judicial Console", roles: ["ADMIN", "DISTRICT_COLLECTOR"] },
                { id: "view:gis_explorer", name: "GIS Cadastral Satellite Explorer", roles: ["ADMIN", "CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER"] },
                { id: "view:citizen_portal", name: "Landowner Citizen Tracking Portal", roles: ["ADMIN", "LANDOWNER"] },
                { id: "view:calculator", name: "Schedule I Statutory Calculator", roles: ["ADMIN", "CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "LANDOWNER"] },
                { id: "manage:notices", name: "Sec 11 & Sec 19 Notice Issuance", roles: ["ADMIN", "DISTRICT_COLLECTOR"] },
                { id: "manage:awards", name: "Sec 23 Statutory Award Sanction", roles: ["ADMIN", "DISTRICT_COLLECTOR"] },
                { id: "manage:compensation", name: "PFMS Direct Benefit Transfer Approval", roles: ["ADMIN", "DISTRICT_COLLECTOR"] },
                { id: "manage:proposals", name: "Alignment & Proposal Submission", roles: ["ADMIN", "REQUIRING_BODY"] },
                { id: "manage:field_surveys", name: "Field Cadastral Ground-Truthing", roles: ["ADMIN", "FIELD_OFFICER"] },
                { id: "manage:grievances", name: "Sec 15 Objections & Grievances", roles: ["ADMIN", "DISTRICT_COLLECTOR", "LANDOWNER"] },
                { id: "view:audit_trail", name: "SHA-256 Cryptographic Audit Ledger", roles: ["ADMIN", "CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR"] },
                { id: "manage:users", name: "System User & SLA Admin Control", roles: ["ADMIN"] },
              ].map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80">
                  <td className="py-2 px-3 font-sans font-medium text-slate-800">
                    <div>{row.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{row.id}</div>
                  </td>
                  {["ADMIN", "CENTRAL_MINISTRY", "STATE_OFFICER", "DISTRICT_COLLECTOR", "REQUIRING_BODY", "FIELD_OFFICER", "LANDOWNER"].map((r) => {
                    const allowed = row.roles.includes(r);
                    return (
                      <td key={r} className="py-2 px-2 text-center">
                        {allowed ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-300 text-xs">
                            –
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
