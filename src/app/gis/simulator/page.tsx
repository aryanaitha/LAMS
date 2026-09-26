"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Compass,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingDown,
  Coins,
  Users,
  ShieldCheck,
  Trees,
  Scale,
  Sparkles,
  Download,
} from "lucide-react";

export default function AlignmentSimulatorPage() {
  const { t, locale } = useLanguage();

  const [selectedAlignment, setSelectedAlignment] = useState<"A" | "B">("B");
  const [bufferWidth, setBufferWidth] = useState<number>(60);
  const [isSimulating, setIsSimulating] = useState(false);

  // Pre-calculated Turf.js metrics dynamically scaled by buffer width factor
  const bufferFactor = bufferWidth / 60;

  const alignments = {
    A: {
      id: "OPT-A",
      name: "Option A: Northern Semi-Urban Bypass Corridor",
      nameHi: "विकल्प अ: उत्तरी अर्ध-शहरी बायपास गलियारा",
      description: "Traverses north of Sinnar town near Musalgaon industrial fringe. Crosses 2 state highways and dense agricultural holdings.",
      lengthKm: 42.4,
      parcelsCount: Math.round(184 * bufferFactor),
      areaHa: Number((142.5 * bufferFactor).toFixed(1)),
      estimatedCostCr: Number((480.0 * bufferFactor).toFixed(1)),
      displacedFamilies: Math.round(195 * bufferFactor),
      ecoSensitiveOverlapHa: Number((3.4 * bufferFactor).toFixed(1)),
      isRecommended: false,
      score: 68.5,
      reasons: [
        "High human displacement (195 families) requiring extensive R&R township creation",
        "Traverses 3.4 Ha of river catchment and canal reservation buffer",
        "Higher statutory land valuation due to proximity to Musalgaon MIDC zone",
      ],
    },
    B: {
      id: "OPT-B",
      name: "Option B: Southern Greenfield Bypass Alignment (Recommended)",
      nameHi: "विकल्प ब: दक्षिणी ग्रीनफील्ड बायपास संरेखण (अनुशंसित)",
      description: "Greenfield alignment following natural agricultural contours south of Sinnar. Completely bypasses dense village settlements.",
      lengthKm: 38.6,
      parcelsCount: Math.round(126 * bufferFactor),
      areaHa: Number((98.2 * bufferFactor).toFixed(1)),
      estimatedCostCr: Number((342.0 * bufferFactor).toFixed(1)),
      displacedFamilies: Math.round(38 * bufferFactor),
      ecoSensitiveOverlapHa: Number((0.2 * bufferFactor).toFixed(1)),
      isRecommended: true,
      score: 92.4,
      reasons: [
        "Reduces displaced families by 80.5% (only 38 families vs 195 in Option A)",
        "Saves ₹138.0 Cr (28.7%) in statutory compensation and R&R entitlement budget",
        "Minimizes eco-sensitive and water-body overlap to negligible 0.2 Ha",
        "Lower litigation risk: 94% land falls under single-crop un-irrigated classification",
      ],
    },
  };

  const current = alignments[selectedAlignment];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* 1. Workbench Top Tab Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-2xs z-20">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-500" />
          <h1 className="text-sm font-bold text-slate-900">
            {t.simulator.title}
          </h1>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            Project: NH-2026-084 (Nashik-Pune Expressway)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              onClick={() => setSelectedAlignment("A")}
              className={`px-3 py-1 rounded-md transition ${
                selectedAlignment === "A"
                  ? "bg-slate-800 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Option A (Northern)
            </button>
            <button
              onClick={() => setSelectedAlignment("B")}
              className={`px-3 py-1 rounded-md transition ${
                selectedAlignment === "B"
                  ? "bg-gov-navy text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Option B (Recommended)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{locale === "hi" ? "तुलना रिपोर्ट" : "Export Tradeoff Matrix"}</span>
          </button>
        </div>
      </div>

      {/* 2. Main 3-Pane Workbench Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Controls & Parameter Sliders */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col p-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-gov-navy" />
              <span>{locale === "hi" ? "स्थानिक बफर पैरामीटर" : "Spatial Buffer Parameters"}</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Adjust right-of-way corridor buffer to dynamically compute parcel intersections.
            </p>
          </div>

          <div className="space-y-4 text-xs pt-2 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-700 flex justify-between">
                <span>{t.simulator.corridorBuffer}</span>
                <span className="font-mono font-bold text-gov-navy">{bufferWidth} Meters</span>
              </label>
              <input
                type="range"
                min="30"
                max="120"
                step="10"
                value={bufferWidth}
                onChange={(e) => setBufferWidth(parseInt(e.target.value, 10))}
                className="w-full mt-2 accent-gov-navy cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>30m (4-Lane)</span>
                <span>60m (Expressway)</span>
                <span>120m (Full RoW)</span>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{isSimulating ? "Computing Intersections..." : t.simulator.runSimulation}</span>
            </button>
          </div>

          {/* Candidate Alignment Dossier Box */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
            <p className="font-bold text-slate-800">
              {locale === "hi" ? current.nameHi : current.name}
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{current.description}</p>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-mono text-[11px]">
              <span className="text-slate-500">Corridor Length:</span>
              <span className="font-bold text-slate-800">{current.lengthKm} km</span>
            </div>
          </div>
        </div>

        {/* Center Pane: Synthetic Cadastral Map Viewport with Buffer Graphics */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
          {/* Simulated Satellite Map Background with Real Coordinates Display */}
          <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
            {/* SVG Visualizing the Alignment Line and Turf.js Buffer polygon */}
            <svg className="w-full h-full">
              {/* Agricultural Field Grid Lines */}
              <defs>
                <pattern id="grid" width="60" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Buffer Zone Area Polygon */}
              {selectedAlignment === "B" ? (
                <path
                  d="M 150,450 Q 400,320 650,280 T 950,150 L 980,180 Q 670,310 420,350 T 170,480 Z"
                  fill="rgba(245, 158, 11, 0.25)"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              ) : (
                <path
                  d="M 120,400 Q 380,240 680,220 T 980,80 L 1010,110 Q 700,250 400,270 T 140,430 Z"
                  fill="rgba(239, 68, 68, 0.25)"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              )}

              {/* Centerline */}
              {selectedAlignment === "B" ? (
                <path
                  d="M 160,465 Q 410,335 660,295 T 965,165"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="4"
                />
              ) : (
                <path
                  d="M 130,415 Q 390,255 690,235 T 995,95"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="4"
                />
              )}
            </svg>
          </div>

          {/* Floating Map Legend & Overlay Indicators */}
          <div className="absolute top-4 left-4 bg-slate-900/90 text-white backdrop-blur border border-slate-700 p-3 rounded-lg text-xs space-y-1.5 shadow-lg">
            <p className="font-bold text-amber-400">Turf.js Spatial Intersect View</p>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="w-3 h-1 bg-emerald-500 rounded"></span>
              <span>Centerline Alignment ({current.id})</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="w-3 h-2 bg-amber-500/40 border border-amber-400 rounded"></span>
              <span>{bufferWidth}m RoW Buffer Envelope</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Intersected Cadastral Parcels</span>
            </div>
          </div>

          {/* Bottom Status / Coordinate Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 text-slate-400 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between border-t border-slate-800 z-10">
            <div className="flex items-center gap-4">
              <span>Projection: EPSG:4326 (WGS 84)</span>
              <span>Target: Sinnar Corridor (19.8512° N, 74.0041° E)</span>
              <span>Spatial Engine: Turf.js v7.1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-200">Tiles Synced (Zoom 18)</span>
            </div>
          </div>
        </div>

        {/* Right Pane: Properties, AI Recommendation & Tradeoffs */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col p-5 space-y-5 overflow-y-auto">
          {/* Recommendation Banner */}
          {current.isRecommended ? (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t.simulator.aiRecommendation}</span>
              </div>
              <p className="text-xs text-emerald-900 font-semibold">
                Score: 92.4 / 100 • Optimal Alignment Selected
              </p>
              <p className="text-[11px] text-emerald-800">
                Option B significantly minimizes socio-economic disruption and environmental buffer overlap.
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-950 font-bold text-xs uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Sub-Optimal Alignment Alert</span>
              </div>
              <p className="text-xs text-amber-900">
                Option A requires 5.1x more family resettlements and ₹138 Cr higher budget.
              </p>
            </div>
          )}

          {/* Metric Comparison Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Corridor Impact Metrics
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.simulator.affectedParcels}</span>
                <p className="text-lg font-black text-slate-900 font-mono">{current.parcelsCount}</p>
                <span className="text-[10px] text-slate-400">Plots intersected</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.simulator.affectedArea}</span>
                <p className="text-lg font-black text-slate-900 font-mono">{current.areaHa} Ha</p>
                <span className="text-[10px] text-slate-400">Right-of-way</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.simulator.estimatedCost}</span>
                <p className="text-lg font-black text-gov-navy font-mono">₹{current.estimatedCostCr} Cr</p>
                <span className="text-[10px] text-slate-400">Land + R&R</span>
              </div>

              <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-0.5">
                <span className="text-[10px] text-slate-500 font-semibold uppercase">{t.simulator.displacedFamilies}</span>
                <p className={`text-lg font-black font-mono ${current.displacedFamilies > 100 ? "text-rose-600" : "text-emerald-600"}`}>
                  {current.displacedFamilies}
                </p>
                <span className="text-[10px] text-slate-400">R&R Packages</span>
              </div>
            </div>
          </div>

          {/* Environmental Overlay */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span className="flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.simulator.environmentalImpact}</span>
              </span>
              <span className="font-mono font-bold text-slate-900">{current.ecoSensitiveOverlapHa} Ha</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {current.ecoSensitiveOverlapHa < 1.0 ? "Negligible clearance delay expected." : "Requires Stage-1 Forest Approval via PARIVESH."}
            </p>
          </div>

          {/* Tradeoff Analysis Rationale */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 uppercase text-[11px] tracking-wider">
              {t.simulator.recommendationReason}
            </h4>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              {current.reasons.map((r, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gov-navy mt-1.5 shrink-0"></span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
