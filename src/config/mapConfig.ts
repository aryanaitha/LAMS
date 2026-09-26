export interface TileLayerConfig {
  name: string;
  url: string;
  attribution: string;
  maxZoom: number;
  maxNativeZoom?: number;
  subdomains?: string[];
  opacity?: number;
}

export const MAP_CONFIG = {
  defaultCenter: [19.8512, 74.0041] as [number, number], // Sinnar Rural Corridor, Nashik, Maharashtra
  defaultZoom: 15,
  minZoom: 10,
  maxZoom: 19,
  tileLayers: {
    satellite: {
      name: "Esri World Imagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      maxZoom: 19,
      maxNativeZoom: 18,
    } as TileLayerConfig,
    osm: {
      name: "OpenStreetMap",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      maxNativeZoom: 19,
      subdomains: ["a", "b", "c"],
    } as TileLayerConfig,
    labels: {
      name: "Esri Boundaries & Places",
      url: "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Reference Overlay",
      maxZoom: 19,
      maxNativeZoom: 18,
      opacity: 0.9,
    } as TileLayerConfig,
  },
};
