"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { GisMap, STATUS_COLORS } from "@/components/gis/GisMap";
import { MAP_CONFIG } from "@/config/mapConfig";
import {
  Layers,
  MapPin,
  Filter,
  Search,
  Crosshair,
  RotateCcw,
  X,
  FileText,
  Coins,
  ShieldAlert,
  User,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

export default function GisExplorerPage() {
  const { t, locale } = useLanguage();

  const [baseLayer, setBaseLayer] = useState<"satellite" | "osm">("satellite");
  const [showLabels, setShowLabels] = useState(true);
  const [showParcels, setShowParcels] = useState(true);
  const [showAlignment, setShowAlignment] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedParcel, setSelectedParcel] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(MAP_CONFIG.defaultCenter);
  const [mapZoom, setMapZoom] = useState<number>(MAP_CONFIG.defaultZoom);

  // Representative subset of cadastral parcels with high-density Sinnar farmland coordinates
  // Overlaid on visible agricultural field plots
  const demoParcels = [
    {
      ulpin: "MH24-0891-4402",
      surveyNo: "104/2",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Ramesh Tukaram Patil",
      maskedPhone: "+91 98*** 42109",
      areaHa: 1.25,
      landUse: "AGRICULTURAL_IRRIGATED",
      status: "OBJECTIONS",
      marketValue: "₹43,75,000",
      estimatedAward: "₹1,32,50,000",
      isLitigation: false,
      isEcoSensitive: false,
      coordinates: [
        [74.0012, 19.8525],
        [74.0045, 19.853],
        [74.0052, 19.8505],
        [74.0018, 19.8498],
        [74.0012, 19.8525],
      ],
    },
    {
      ulpin: "MH24-1102-5819",
      surveyNo: "104/3",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Sunita Balasaheb Deshmukh",
      maskedPhone: "+91 98*** 55120",
      areaHa: 0.95,
      landUse: "AGRICULTURAL_IRRIGATED",
      status: "AWARDED",
      marketValue: "₹33,25,000",
      estimatedAward: "₹1,00,75,000",
      isLitigation: false,
      isEcoSensitive: false,
      coordinates: [
        [74.0052, 19.8505],
        [74.0085, 19.851],
        [74.009, 19.8485],
        [74.0058, 19.848],
        [74.0052, 19.8505],
      ],
    },
    {
      ulpin: "MH24-2219-4812",
      surveyNo: "105/1",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Gangaram Bapu Shinde",
      maskedPhone: "+91 98*** 66201",
      areaHa: 1.8,
      landUse: "AGRICULTURAL_UNIRRIGATED",
      status: "COMPENSATION_PAID",
      marketValue: "₹57,60,000",
      estimatedAward: "₹1,74,50,000",
      isLitigation: false,
      isEcoSensitive: false,
      coordinates: [
        [74.0018, 19.8498],
        [74.0058, 19.848],
        [74.0065, 19.8455],
        [74.0022, 19.846],
        [74.0018, 19.8498],
      ],
    },
    {
      ulpin: "MH24-3401-7711",
      surveyNo: "105/2",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Eknath Kashinath Jadhav",
      maskedPhone: "+91 98*** 88319",
      areaHa: 0.65,
      landUse: "AGRICULTURAL_IRRIGATED",
      status: "POSSESSED",
      marketValue: "₹22,75,000",
      estimatedAward: "₹68,90,000",
      isLitigation: false,
      isEcoSensitive: false,
      coordinates: [
        [74.0065, 19.8455],
        [74.0095, 19.8458],
        [74.0102, 19.8432],
        [74.007, 19.843],
        [74.0065, 19.8455],
      ],
    },
    {
      ulpin: "MH24-4820-9102",
      surveyNo: "106/1",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Ashok Trimbak Gaikwad",
      maskedPhone: "+91 98*** 11029",
      areaHa: 2.1,
      landUse: "AGRICULTURAL_IRRIGATED",
      status: "DISPUTED",
      marketValue: "₹73,50,000",
      estimatedAward: "₹2,22,60,000",
      isLitigation: true,
      isEcoSensitive: false,
      coordinates: [
        [74.0022, 19.846],
        [74.007, 19.843],
        [74.0078, 19.8395],
        [74.003, 19.8402],
        [74.0022, 19.846],
      ],
    },
    {
      ulpin: "MH24-5510-3329",
      surveyNo: "106/2",
      village: "Musalgaon",
      tehsil: "Sinnar",
      ownerName: "Kavita Dnyaneshwar Wagh",
      maskedPhone: "+91 98*** 33418",
      areaHa: 1.4,
      landUse: "AGRICULTURAL_IRRIGATED",
      status: "NOTIFIED",
      marketValue: "₹49,00,000",
      estimatedAward: "₹1,48,40,000",
      isLitigation: false,
      isEcoSensitive: false,
      coordinates: [
        [74.007, 19.843],
        [74.0102, 19.8432],
        [74.0112, 19.8398],
        [74.0078, 19.8395],
        [74.007, 19.843],
      ],
    },
  ];

  const alignmentCoords: [number, number][] = [
    [19.855, 73.985],
    [19.852, 74.002],
    [19.849, 74.015],
    [19.844, 74.032],
  ];

  const filteredParcels = demoParcels.filter((p) => {
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesSearch =
      p.surveyNo.includes(searchQuery) ||
      p.ulpin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleLocateMe = () => {
    setMapCenter([19.8512, 74.0041]);
    setMapZoom(18); // Zoom 18 for verified field-level detail!
  };

  const handleResetView = () => {
    setMapCenter(MAP_CONFIG.defaultCenter);
    setMapZoom(MAP_CONFIG.defaultZoom);
    setSelectedParcel(null);
  };

  return (
    <div
      className="w-full flex-1 flex flex-col relative overflow-hidden bg-slate-900"
      style={{ height: "calc(100vh - 105px)", minHeight: "600px" }}
    >
      {/* 1. Floating Top Bar over Full-Bleed Map */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Main Title Badge */}
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-slate-700/80 shadow-lg flex items-center gap-3">
            <Layers className="w-4 h-4 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">{t.nav.gisExplorer}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                  Sinnar Corridor
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-60 hidden md:block">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Survey No / ULPIN..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-900/90 backdrop-blur-md text-white placeholder-slate-400 border border-slate-700/80 rounded-xl focus:ring-1 focus:ring-amber-400 focus:outline-none shadow-lg font-mono"
            />
          </div>

          {/* Toggle Layers Drawer Button */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg backdrop-blur-md ${
              drawerOpen
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-slate-900/90 text-slate-200 hover:text-white border border-slate-700/80"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{locale === "hi" ? "परतें व फ़िल्टर" : "Layers & Filters"}</span>
          </button>
        </div>

        {/* Right Floating Controls: Basemap Toggle & Zoom Helpers */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Base Layer Switcher */}
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 flex items-center gap-1 shadow-lg text-xs font-medium">
            <button
              onClick={() => setBaseLayer("satellite")}
              className={`px-3 py-1 rounded-lg transition ${
                baseLayer === "satellite"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setBaseLayer("osm")}
              className={`px-3 py-1 rounded-lg transition ${
                baseLayer === "osm"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Streets
            </button>
          </div>

          {/* Labels Toggle */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium backdrop-blur-md transition shadow-lg ${
              showLabels
                ? "bg-slate-800/90 text-amber-300 border-amber-400/40"
                : "bg-slate-900/90 text-slate-400 border-slate-700/80"
            }`}
            title="Toggle Place & Road Labels"
          >
            Labels: {showLabels ? "ON" : "OFF"}
          </button>

          {/* Zoom to Field Level */}
          <button
            onClick={handleLocateMe}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-slate-700/80 backdrop-blur-md transition shadow-lg"
            title="Zoom to Field Level (Zoom 18)"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Reset Zoom */}
          <button
            onClick={handleResetView}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition shadow-lg"
            title="Reset Project Extent"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Primary Full-Bleed Leaflet Map Viewport */}
      <div
        className="w-full h-full flex-1 relative"
        style={{ height: "100%", minHeight: "600px" }}
      >
        <GisMap
          parcels={showParcels ? filteredParcels : []}
          selectedParcel={selectedParcel}
          onSelectParcel={setSelectedParcel}
          baseLayer={baseLayer}
          showLabels={showLabels}
          alignmentLine={showAlignment ? alignmentCoords : undefined}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      {/* 3. Single Collapsible Side Drawer (Layers & Filters) */}
      {drawerOpen && (
        <div className="absolute top-20 left-4 z-40 w-80 max-h-[calc(100vh-210px)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 shadow-2xl overflow-y-auto text-white animate-in slide-in-from-left duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Map Layers & Filtering</span>
            </h3>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Layer toggles */}
          <div className="mt-4 space-y-2 text-xs">
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer">
              <span className="font-medium text-slate-200">Cadastral Parcels</span>
              <input
                type="checkbox"
                checked={showParcels}
                onChange={(e) => setShowParcels(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 cursor-pointer">
              <span className="font-medium text-slate-200">NH-2026-084 Expressway Alignment</span>
              <input
                type="checkbox"
                checked={showAlignment}
                onChange={(e) => setShowAlignment(e.target.checked)}
                className="rounded accent-amber-500"
              />
            </label>
          </div>

          {/* Status filter */}
          <div className="mt-5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Filter by RFCTLARR Stage
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 text-white text-xs border border-slate-700 rounded-lg p-2 focus:ring-1 focus:ring-amber-400"
            >
              <option value="ALL">All Stages ({demoParcels.length} parcels)</option>
              <option value="PROPOSED">Proposed</option>
              <option value="NOTIFIED">Sec 11 Notified</option>
              <option value="OBJECTIONS">Sec 15 Objections</option>
              <option value="AWARDED">Sec 23 Awarded</option>
              <option value="COMPENSATION_PAID">Compensation Paid</option>
              <option value="POSSESSED">Possessed / Handover</option>
              <option value="DISPUTED">Litigation Dispute</option>
            </select>
          </div>

          {/* Status Color Legend */}
          <div className="mt-5 border-t border-slate-800 pt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Parcel Status Legend
            </h4>
            <div className="grid grid-cols-1 gap-1.5 text-[11px]">
              {Object.entries(STATUS_COLORS).map(([key, cfg]) => (
                <div key={key} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border"
                    style={{ backgroundColor: cfg.fill, borderColor: cfg.stroke }}
                  ></span>
                  <span className="text-slate-300">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Parcel Detail Inspector Drawer (Slide-in from right when selected) */}
      {selectedParcel && (
        <div className="absolute top-20 right-4 z-40 w-96 max-h-[calc(100vh-210px)] bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-y-auto text-white animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="font-mono text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                ULPIN: {selectedParcel.ulpin}
              </span>
              <h3 className="text-base font-bold text-white mt-2">
                Survey No. {selectedParcel.surveyNo}
              </h3>
              <p className="text-xs text-slate-400">
                {selectedParcel.village} Village, {selectedParcel.tehsil} Tehsil
              </p>
            </div>
            <button
              onClick={() => setSelectedParcel(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Litigation alert */}
          {selectedParcel.isLitigation && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/80 border border-rose-700/80 flex items-start gap-2.5 text-xs text-rose-200">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Active High Court Litigation</span>
                <p className="text-[11px] text-rose-300/80 mt-0.5">
                  WP-2026/8941: Stay petition pending in Bombay High Court.
                </p>
              </div>
            </div>
          )}

          {/* Details list */}
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Landowner</span>
              <span className="font-semibold text-slate-200">{selectedParcel.ownerName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Acquired Area</span>
              <span className="font-semibold text-slate-200">{selectedParcel.areaHa} Hectares</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Land Classification</span>
              <span className="font-semibold text-slate-200">{selectedParcel.landUse}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Base Market Value</span>
              <span className="font-mono text-slate-200">{selectedParcel.marketValue}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Schedule I Award</span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {selectedParcel.estimatedAward}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMapCenter(selectedParcel.coordinates[0]);
                setMapZoom(18);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>Zoom to Parcel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
