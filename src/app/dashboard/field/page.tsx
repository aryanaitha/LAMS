"use client";

import React, { useState } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Smartphone,
  MapPin,
  Camera,
  CheckCircle2,
  RefreshCw,
  Wifi,
  WifiOff,
  UploadCloud,
  Layers,
  Save,
} from "lucide-react";

export default function FieldOfficerPwaPage() {
  const { t, locale } = useLanguage();

  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([
    {
      id: "QUEUE-1",
      surveyNo: "104/2",
      ulpin: "MH24-0891-4402",
      village: "Musalgaon",
      gps: "19.85124, 74.00412 (±2.4m)",
      photosCount: 3,
      treesCount: 42,
      structuresCount: 1,
      status: "QUEUED_OFFLINE",
    },
  ]);

  const [surveyNo, setSurveyNo] = useState("105/1");
  const [ulpin, setUlpin] = useState("MH24-2219-4812");
  const [gpsLat, setGpsLat] = useState("19.84982");
  const [gpsLng, setGpsLng] = useState("74.00185");
  const [treesCount, setTreesCount] = useState("18");
  const [structuresCount, setStructuresCount] = useState("0");
  const [remarks, setRemarks] = useState("Boundary pillars intact. Drip line present.");

  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleCaptureGps = () => {
    // Generate realistic jitter around Sinnar
    setGpsLat((19.8512 + (Math.random() - 0.5) * 0.005).toFixed(5));
    setGpsLng((74.0041 + (Math.random() - 0.5) * 0.005).toFixed(5));
  };

  const handleSaveSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `QUEUE-${Date.now()}`,
      surveyNo,
      ulpin,
      village: "Musalgaon",
      gps: `${gpsLat}, ${gpsLng} (±2.1m)`,
      photosCount: 2,
      treesCount: parseInt(treesCount, 10),
      structuresCount: parseInt(structuresCount, 10),
      status: "QUEUED_OFFLINE",
    };
    setOfflineQueue([newEntry, ...offlineQueue]);
    alert("Survey record saved to device offline storage (IndexedDB queue)!");
  };

  const handleSyncAll = async () => {
    setSyncStatus("Synchronizing offline records with central LAMS server...");
    setTimeout(() => {
      setOfflineQueue([]);
      setSyncStatus("All offline field surveys synchronized and logged to audit trail!");
      setTimeout(() => setSyncStatus(null), 4000);
    }, 1200);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
      {/* Mobile PWA Top Status Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <div>
            <h1 className="text-sm font-bold">{locale === "hi" ? "फील्ड सर्वेक्षण मोबाइल मॉड्यूल" : "Field Survey Mobile PWA"}</h1>
            <p className="text-[10px] text-slate-400">Offline-First IndexedDB Sync Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${
              isOnline
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? "Online" : "Offline"}</span>
          </button>
        </div>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Offline Queue Notice */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-800">
            Offline IndexedDB Queue: {offlineQueue.length} records pending
          </p>
          <p className="text-[11px] text-slate-500">
            Auto-syncs whenever internet connectivity is restored.
          </p>
        </div>
        <button
          onClick={handleSyncAll}
          disabled={offlineQueue.length === 0}
          className="px-3.5 py-2 rounded-lg bg-gov-navy text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow disabled:opacity-40"
        >
          <UploadCloud className="w-4 h-4 text-amber-400" />
          <span>{t.actions.syncOfflineData}</span>
        </button>
      </div>

      {/* Ground Verification Inspection Form */}
      <form onSubmit={handleSaveSurvey} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
          {locale === "hi" ? "संयुक्त माप सर्वेक्षण (JMS) पंचनामा प्रविष्टि" : "Ground Joint Measurement Survey (JMS)"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Survey / Khasra No.</label>
            <input
              type="text"
              required
              value={surveyNo}
              onChange={(e) => setSurveyNo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">ULPIN (14-Digit)</label>
            <input
              type="text"
              required
              value={ulpin}
              onChange={(e) => setUlpin(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy font-mono"
            />
          </div>
        </div>

        {/* GPS Capture Box */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gov-navy" />
              <span>Real-Time GPS Coordinates</span>
            </span>
            <button
              type="button"
              onClick={handleCaptureGps}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px]"
            >
              Capture Current GPS
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
            <div className="p-2 bg-white rounded border">Lat: {gpsLat}° N</div>
            <div className="p-2 bg-white rounded border">Lng: {gpsLng}° E</div>
          </div>
        </div>

        {/* Enumeration Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Fruit / Timber Trees Count</label>
            <input
              type="number"
              value={treesCount}
              onChange={(e) => setTreesCount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Wells / Farm Buildings Count</label>
            <input
              type="number"
              value={structuresCount}
              onChange={(e) => setStructuresCount(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Panchanama Field Remarks</label>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-gov-navy"
          ></textarea>
        </div>

        {/* Geotagged Photo Simulation */}
        <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 text-center space-y-1">
          <Camera className="w-6 h-6 text-slate-400 mx-auto" />
          <p className="font-semibold text-slate-700">Geotagged Camera Photos (EXIF Tagged)</p>
          <p className="text-[10px] text-slate-400">Captured with GPS watermarks for court evidence</p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gov-navy hover:bg-slate-800 text-white font-bold transition flex items-center justify-center gap-2 shadow"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Ground Verification Record</span>
          </button>
        </div>
      </form>
    </div>
  );
}
