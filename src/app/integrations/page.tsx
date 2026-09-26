"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  Code2,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  Shield,
  Layers,
} from "lucide-react";

export default function IntegrationsPage() {
  const { t, locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"adapters" | "openapi">("adapters");
  const [copied, setCopied] = useState(false);

  const adapters = [
    {
      name: "RoR / MahaBhulekh API",
      sector: "Land Records",
      status: "CONNECTED",
      latency: "142 ms",
      description: "Direct real-time synchronization with State 7/12 extract and Khasra mutation registers.",
      endpoint: "https://api.lams.gov.in/v1/adapters/ror/fetch?surveyNo=104/2",
      badge: "Simulated",
    },
    {
      name: "Bhu-Naksha Spatial Vector Service",
      sector: "Cadastral GIS",
      status: "CONNECTED",
      latency: "210 ms",
      description: "Vector parcel boundary ingestion and automated coordinate projection conversion (EPSG:4326).",
      endpoint: "https://api.lams.gov.in/v1/adapters/bhunaksha/vector?villageId=V-2401",
      badge: "Simulated",
    },
    {
      name: "ULPIN (Bhu-Aadhaar) Generator",
      sector: "National Standard",
      status: "CONNECTED",
      latency: "89 ms",
      description: "Generates 14-digit geo-coded alphanumeric unique land parcel identification numbers.",
      endpoint: "https://api.lams.gov.in/v1/adapters/ulpin/generate",
      badge: "Simulated",
    },
    {
      name: "PFMS Direct Benefit Transfer (DBT)",
      sector: "Treasury & Finance",
      status: "CONNECTED",
      latency: "340 ms",
      description: "Statutory compensation disbursement directly to verified Aadhaar-linked beneficiary bank accounts.",
      endpoint: "https://api.lams.gov.in/v1/adapters/pfms/disburse",
      badge: "Simulated",
    },
    {
      name: "PARIVESH Forest Clearance Portal",
      sector: "Environment & Ecology",
      status: "WARNING",
      latency: "410 ms",
      description: "Stage-1 & Stage-2 forest diversion proposal tracking and wildlife sanctuary buffer alerts.",
      endpoint: "https://api.lams.gov.in/v1/adapters/parivesh/status?proposalId=FC-2026-991",
      badge: "Simulated",
    },
    {
      name: "DigiLocker Citizen Document Vault",
      sector: "Digital Identity",
      status: "CONNECTED",
      latency: "115 ms",
      description: "Instant verification of Aadhaar, PAN, and registered sale deeds without paper submission.",
      endpoint: "https://api.lams.gov.in/v1/adapters/digilocker/verify",
      badge: "Simulated",
    },
    {
      name: "e-Courts NJDG Litigation Ingestion",
      sector: "Judicial Records",
      status: "CONNECTED",
      latency: "280 ms",
      description: "Automated scanning of High Court and District Court land acquisition writ petitions (Section 64/74).",
      endpoint: "https://api.lams.gov.in/v1/adapters/ecourts/litigations?surveyNo=104/2",
      badge: "Simulated",
    },
  ];

  const openApiYaml = `openapi: 3.0.3
info:
  title: LAMS National API Gateway
  description: Land Acquisition Monitoring System (SIH26016) Official Integration Interface
  version: 1.0.0
servers:
  - url: https://api.lams.gov.in/v1
    description: Production National Gateway
paths:
  /parcels/{ulpin}:
    get:
      summary: Retrieve Cadastral Parcel Dossier
      parameters:
        - name: ulpin
          in: path
          required: true
          schema:
            type: string
            example: MH24-0891-4402
      responses:
        '200':
          description: Parcel Dossier with GeoJSON geometry, status and valuation
  /proposals:
    post:
      summary: Submit Requiring Body Acquisition Proposal
      security:
        - BearerAuth: []
      responses:
        '201':
          description: Proposal created with tracking Project ID
  /grievances:
    post:
      summary: File Landowner Section 15 Objection
      responses:
        '201':
          description: Objection registered with hearing docket number`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(openApiYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-gov-navy">
            <Plug className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {locale === "hi"
                ? "राष्ट्रीय एपीआई एकीकरण एवं ओपन-डेटा अनुबंध"
                : "National API Integrations & External Systems"}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {locale === "hi"
              ? "भू-अभिलेख, स्थानिक मानचित्र, पीएफएमएस भुगतान, परिवेश वन मंजूरी एवं ई-कोर्ट्स के साथ अंतःसंचालनीयता।"
              : "Interoperability adapters connecting LAMS with RoR, Bhu-Naksha, PFMS, PARIVESH, and e-Courts."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("adapters")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "adapters" ? "bg-white text-gov-navy shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "hi" ? "सक्रिय एडेप्टर्स (7)" : "Live Adapters (7)"}
          </button>
          <button
            onClick={() => setActiveTab("openapi")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "openapi" ? "bg-white text-gov-navy shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {locale === "hi" ? "ओपन-एपीआई 3.0 अनुबंध" : "OpenAPI 3.0 Contract"}
          </button>
        </div>
      </div>

      {activeTab === "adapters" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {adapters.map((adapter) => (
            <div
              key={adapter.name}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{adapter.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {adapter.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">{adapter.sector}</p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      adapter.status === "CONNECTED" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    }`}
                  ></span>
                  <span className="text-[11px] text-slate-500">{adapter.latency}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600">{adapter.description}</p>

              <div className="p-2 rounded bg-slate-50 border border-slate-200/80 font-mono text-[10px] text-slate-700 truncate">
                {adapter.endpoint}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between text-slate-200 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold font-mono">openapi.yaml (OpenAPI 3.0 Specification)</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-medium border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy YAML"}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 leading-relaxed">
            {openApiYaml}
          </pre>
        </div>
      )}
    </div>
  );
}
