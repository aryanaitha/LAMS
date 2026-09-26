"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { MAP_CONFIG } from "@/config/mapConfig";

// Status Colors for Cadastral Parcels
export const STATUS_COLORS: Record<
  string,
  { fill: string; stroke: string; label: string; labelHi: string }
> = {
  PROPOSED: { fill: "#94a3b8", stroke: "#475569", label: "Proposed", labelHi: "प्रस्तावित" },
  NOTIFIED: { fill: "#38bdf8", stroke: "#0284c7", label: "Notified (Sec 11)", labelHi: "अधिसूचित (धारा 11)" },
  OBJECTIONS: { fill: "#f59e0b", stroke: "#d97706", label: "Objections (Sec 15)", labelHi: "आपत्तियां (धारा 15)" },
  AWARDED: { fill: "#a855f7", stroke: "#7e22ce", label: "Award Declared", labelHi: "पंचाट घोषित" },
  COMPENSATION_PAID: { fill: "#10b981", stroke: "#047857", label: "Compensation Paid", labelHi: "मुआवजा भुगतान संपन्न" },
  POSSESSED: { fill: "#059669", stroke: "#064e3b", label: "Possessed / Handover", labelHi: "दखल प्राप्त" },
  DISPUTED: { fill: "#ef4444", stroke: "#b91c1c", label: "Litigation Dispute", labelHi: "न्यायालयीन विवादित" },
};

// Client-safe Leaflet dynamic component
const LeafletMapContainer = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Polygon, Polyline, Tooltip, Popup, useMap, ZoomControl } = mod;

      // Invalidation and view controller to guarantee Leaflet tiles render without grey / missing tiles
      function MapController({
        center,
        zoom,
      }: {
        center: [number, number];
        zoom: number;
      }) {
        const map = useMap();

        useEffect(() => {
          // Immediately trigger invalidateSize and schedule another after layout settles
          map.invalidateSize();
          const t1 = setTimeout(() => map.invalidateSize(), 150);
          const t2 = setTimeout(() => map.invalidateSize(), 500);

          const handleResize = () => {
            map.invalidateSize();
          };
          window.addEventListener("resize", handleResize);

          return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener("resize", handleResize);
          };
        }, [map]);

        useEffect(() => {
          map.setView(center, zoom, { animate: true });
        }, [center, zoom, map]);

        return null;
      }

      return function InnerMap({
        parcels,
        selectedParcel,
        onSelectParcel,
        baseLayer = "satellite",
        showLabels = true,
        center,
        zoom,
        alignmentLine,
      }: any) {
        return (
          <MapContainer
            center={center}
            zoom={zoom}
            maxZoom={MAP_CONFIG.maxZoom}
            minZoom={MAP_CONFIG.minZoom}
            style={{ width: "100%", height: "100%", minHeight: "600px" }}
            className="w-full h-full z-10"
            zoomControl={false}
          >
            <MapController center={center} zoom={zoom} />
            <ZoomControl position="bottomright" />

            {/* Base Tile Layer */}
            {baseLayer === "satellite" ? (
              <TileLayer
                attribution={MAP_CONFIG.tileLayers.satellite.attribution}
                url={MAP_CONFIG.tileLayers.satellite.url}
                maxNativeZoom={MAP_CONFIG.tileLayers.satellite.maxNativeZoom}
                maxZoom={MAP_CONFIG.tileLayers.satellite.maxZoom}
              />
            ) : (
              <TileLayer
                attribution={MAP_CONFIG.tileLayers.osm.attribution}
                url={MAP_CONFIG.tileLayers.osm.url}
                maxNativeZoom={MAP_CONFIG.tileLayers.osm.maxNativeZoom}
                maxZoom={MAP_CONFIG.tileLayers.osm.maxZoom}
              />
            )}

            {/* Boundaries & Labels Reference Overlay */}
            {showLabels && (
              <TileLayer
                attribution={MAP_CONFIG.tileLayers.labels.attribution}
                url={MAP_CONFIG.tileLayers.labels.url}
                maxNativeZoom={MAP_CONFIG.tileLayers.labels.maxNativeZoom}
                maxZoom={MAP_CONFIG.tileLayers.labels.maxZoom}
                opacity={MAP_CONFIG.tileLayers.labels.opacity}
                zIndex={500}
              />
            )}

            {/* Alignment Centerline */}
            {alignmentLine && (
              <Polyline
                positions={alignmentLine}
                pathOptions={{ color: "#f59e0b", weight: 4, dashArray: "8, 6" }}
              >
                <Tooltip permanent={false}>NH-2026-084 Expressway Alignment</Tooltip>
              </Polyline>
            )}

            {/* Cadastral Parcels Layer */}
            {parcels.map((p: any) => {
              const statusCfg = STATUS_COLORS[p.status] || STATUS_COLORS.PROPOSED;
              const isSelected = selectedParcel?.ulpin === p.ulpin;

              // GeoJSON coordinates are [lng, lat], Leaflet Polygon expects [lat, lng]
              const coords = p.coordinates.map((pt: [number, number]) => [pt[1], pt[0]]);

              return (
                <Polygon
                  key={p.ulpin}
                  positions={coords}
                  eventHandlers={{
                    click: () => onSelectParcel(p),
                  }}
                  pathOptions={{
                    fillColor: isSelected ? "#facc15" : statusCfg.fill,
                    fillOpacity: isSelected ? 0.85 : 0.45,
                    color: isSelected ? "#090d16" : statusCfg.stroke,
                    weight: isSelected ? 3.5 : 1.8,
                  }}
                >
                  <Tooltip sticky>
                    <div className="text-xs space-y-0.5 p-0.5">
                      <p className="font-bold text-slate-900">Survey No. {p.surveyNo}</p>
                      <p className="text-[10px] text-slate-500 font-mono">ULPIN: {p.ulpin}</p>
                      <p className="text-[10px] text-slate-700">{p.ownerName}</p>
                      <p className="font-semibold text-[10px] text-emerald-700">
                        {p.areaHa} Ha • {statusCfg.label}
                      </p>
                    </div>
                  </Tooltip>
                </Polygon>
              );
            })}
          </MapContainer>
        );
      };
    }),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-medium tracking-wide">Loading Esri Satellite Basemap & Cadastral Parcels...</p>
      </div>
    ),
  }
);

export function GisMap({
  parcels,
  selectedParcel,
  onSelectParcel,
  baseLayer = "satellite",
  showLabels = true,
  alignmentLine,
  center = MAP_CONFIG.defaultCenter,
  zoom = MAP_CONFIG.defaultZoom,
}: any) {
  return (
    <div
      className="w-full h-full min-h-[600px] relative overflow-hidden"
      style={{ height: "100%", minHeight: "600px" }}
    >
      <LeafletMapContainer
        parcels={parcels}
        selectedParcel={selectedParcel}
        onSelectParcel={onSelectParcel}
        baseLayer={baseLayer}
        showLabels={showLabels}
        alignmentLine={alignmentLine}
        center={center}
        zoom={zoom}
      />
    </div>
  );
}
