export type UserRole =
  | "CENTRAL_MINISTRY"
  | "STATE_OFFICER"
  | "DISTRICT_COLLECTOR"
  | "REQUIRING_BODY"
  | "FIELD_OFFICER"
  | "LANDOWNER"
  | "ADMIN";

export type ProjectStatus =
  | "PROPOSAL"
  | "SCRUTINY"
  | "SIA"
  | "SEC_11"
  | "OBJECTIONS"
  | "SEC_19"
  | "AWARD"
  | "COMPENSATION"
  | "POSSESSION"
  | "COMPLETED";

export type ParcelStatus =
  | "PROPOSED"
  | "NOTIFIED"
  | "OBJECTIONS"
  | "AWARDED"
  | "COMPENSATION_PAID"
  | "POSSESSED"
  | "DISPUTED";

export type LandUseType =
  | "AGRICULTURAL_IRRIGATED"
  | "AGRICULTURAL_UNIRRIGATED"
  | "COMMERCIAL"
  | "RESIDENTIAL"
  | "BARREN";

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface GeoJsonLineString {
  type: "LineString";
  coordinates: number[][];
}

export interface CompensationBreakdown {
  marketValuePerHa: number;
  areaHa: number;
  baseLandValue: number;
  ruralMultiplier: number;
  multipliedLandValue: number;
  assetsAndTreesValue: number;
  solatiumPercentage: number;
  solatiumAmount: number;
  additionalInterestMonths: number;
  additionalInterestRate: number;
  additionalInterestAmount: number;
  totalCompensation: number;
}
