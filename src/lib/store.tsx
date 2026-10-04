"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type TransportMode = "maritime" | "routier" | "aerien";
export type MaritimeType = "FCL" | "LCL";
export type RoutierType = "FTL" | "LTL";
export type AerienType = "express" | "standard";

export type ContainerType = "20_dry" | "40_dry" | "40_hc" | "40_reefer" | "20_opentop";
export type Incoterm = "FOB" | "CIF" | "EXW" | "CFR" | "DDP" | "DAP";
export type CargoNature = "general" | "perissable" | "dangereux" | "textile" | "industriel" | "chimique";

export type PortStatus = "actif" | "congestion" | "travaux" | "limite";

export interface PortItem {
  id: string;
  code: string; // UN/LOCODE e.g. MAPTM
  name: string;
  country: string;
  countryCode: string; // Flag code or emoji
  mode: TransportMode;
  status: PortStatus;
  thcRate: number; // in EUR
  transitHub: string;
  activeLines: number;
  notes?: string;
  coordinates?: { lat: number; lng: number };
}

export interface RouteTariff {
  id: string;
  originId: string;
  destinationId: string;
  mode: TransportMode;
  baseRate20: number; // EUR for 20ft or base FTL
  baseRate40: number; // EUR for 40ft or base FTL
  baseRateLclPerCbm: number; // EUR per CBM or Kg
  transitTimeDaysMin: number;
  transitTimeDaysMax: number;
  frequency: string; // e.g. "3x / semaine"
  bafRate: number; // % or EUR
}

export type QuoteStatus = 
  | "EN_ATTENTE_CONFIRMATION"
  | "CONFIRME_ADMIN"
  | "EN_NEGOCIATION"
  | "ORDRE_TRANSPORT"
  | "EN_TRANSIT"
  | "LIVRE"
  | "REJETE";

export interface QuoteServices {
  customsClearance: boolean;
  allRiskInsurance: boolean;
  doorDelivery: boolean;
  portHandlingTHC: boolean;
  tempMonitoring?: boolean;
}

export interface ClientQuote {
  id: string; // e.g. GTI-2026-DEV-7842
  createdAt: string;
  updatedAt: string;
  mode: TransportMode;
  subType: string; // FCL, LCL, FTL, LTL, express, standard
  originPort: PortItem;
  destinationPort: PortItem;
  cargoNature: CargoNature;
  cargoDescription?: string;
  containerType?: ContainerType;
  containerQuantity?: number;
  weightKg?: number;
  volumeCbm?: number;
  palletsCount?: number;
  goodsValueEur: number;
  incoterm: Incoterm;
  departureDate: string;
  services: QuoteServices;
  
  // Pricing Breakdown
  baseFreightEur: number;
  surchargesEur: number;
  thcEur: number;
  customsEur: number;
  insuranceEur: number;
  doorDeliveryEur: number;
  totalHtEur: number;
  totalTtcEur: number;
  adminAdjustedPriceEur?: number;
  
  // Client info
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientCity: string;
  clientNotes?: string;
  
  // Admin workflow
  status: QuoteStatus;
  adminNotes?: string;
  assignedAgent?: string;
  vesselOrFlightRef?: string;
  trackingNumber?: string;
}

export interface ShipmentMilestone {
  step: string;
  date: string;
  location: string;
  completed: boolean;
  current?: boolean;
}

export interface ShipmentItem {
  id: string; // e.g. EXP-2026-9041
  quoteId: string;
  trackingNumber: string; // e.g. GTI-TRK-882190
  containerNumber?: string; // e.g. CMAU-748920-1
  vesselName: string;
  origin: string;
  destination: string;
  mode: TransportMode;
  status: "EN_ATTENTE" | "EN_MER" | "EN_ROUTE" | "DEDOUANE" | "LIVRE";
  eta: string;
  departureDate: string;
  clientCompany: string;
  cargo: string;
  milestones: ShipmentMilestone[];
}

export interface ClientCompany {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  sector: string;
  ice?: string;
  totalQuotes: number;
  totalBookings: number;
  status: "VIP" | "Actif" | "Prospect";
}

export interface InvoiceItem {
  id: string; // e.g. FAC-2026-0428
  quoteId: string;
  clientName: string;
  date: string;
  dueDate: string;
  amountEur: number;
  status: "PAYEE" | "EN_ATTENTE" | "RETARD";
}

interface GTIContextType {
  ports: PortItem[];
  tariffs: RouteTariff[];
  quotes: ClientQuote[];
  shipments: ShipmentItem[];
  invoices: InvoiceItem[];
  clients: ClientCompany[];
  currency: "EUR" | "MAD" | "USD";
  setCurrency: (c: "EUR" | "MAD" | "USD") => void;
  formatPrice: (amountInEur: number) => string;
  
  // Quote Actions
  calculateQuote: (params: {
    mode: TransportMode;
    subType: string;
    originId: string;
    destinationId: string;
    cargoNature: CargoNature;
    containerType?: ContainerType;
    containerQuantity?: number;
    weightKg?: number;
    volumeCbm?: number;
    palletsCount?: number;
    goodsValueEur: number;
    incoterm: Incoterm;
    services: QuoteServices;
  }) => {
    baseFreight: number;
    surcharges: number;
    thc: number;
    customs: number;
    insurance: number;
    doorDelivery: number;
    totalHt: number;
    totalTtc: number;
    transitTime: string;
    frequency: string;
  };
  submitQuote: (quoteData: Omit<ClientQuote, "id" | "createdAt" | "updatedAt" | "status">) => Promise<ClientQuote>;
  confirmQuote: (quoteId: string, adminNotes?: string, adjustedPriceEur?: number) => void;
  rejectQuote: (quoteId: string, reason?: string) => void;
  updateQuoteStatus: (quoteId: string, status: QuoteStatus) => void;
  transformToShipment: (quoteId: string) => ShipmentItem;
  
  // Port management
  addPort: (port: Omit<PortItem, "id">) => void;
  updatePort: (id: string, updates: Partial<PortItem>) => void;
  deletePort: (id: string) => void;
  togglePortStatus: (id: string, status: PortStatus) => void;

  // Tariff management
  updateTariff: (id: string, updates: Partial<RouteTariff>) => void;
  addTariff: (tariff: Omit<RouteTariff, "id">) => void;
}

const INITIAL_PORTS: PortItem[] = [
  { id: "port-1", code: "MAPTM", name: "Tanger Med Hub", country: "Maroc", countryCode: "🇲🇦", mode: "maritime", status: "actif", thcRate: 180, transitHub: "Méditerranée / Océan", activeLines: 120, coordinates: { lat: 35.88, lng: -5.50 } },
  { id: "port-2", code: "MACAS", name: "Casablanca Port", country: "Maroc", countryCode: "🇲🇦", mode: "maritime", status: "actif", thcRate: 210, transitHub: "Atlantique", activeLines: 85, coordinates: { lat: 33.60, lng: -7.61 } },
  { id: "port-3", code: "MAAGA", name: "Agadir Port", country: "Maroc", countryCode: "🇲🇦", mode: "maritime", status: "actif", thcRate: 165, transitHub: "Atlantique Sud", activeLines: 40, coordinates: { lat: 30.42, lng: -9.62 } },
  { id: "port-4", code: "FRMRS", name: "Marseille Fos", country: "France", countryCode: "🇫🇷", mode: "maritime", status: "actif", thcRate: 240, transitHub: "Europe Sud", activeLines: 95, coordinates: { lat: 43.30, lng: 5.36 } },
  { id: "port-5", code: "FRLEH", name: "Le Havre Port", country: "France", countryCode: "🇫🇷", mode: "maritime", status: "actif", thcRate: 260, transitHub: "Manche / Mer du Nord", activeLines: 110, coordinates: { lat: 49.49, lng: 0.10 } },
  { id: "port-6", code: "NLRTM", name: "Rotterdam Port", country: "Pays-Bas", countryCode: "🇳🇱", mode: "maritime", status: "congestion", thcRate: 295, transitHub: "Europe Nord", activeLines: 240, notes: "Retard moyen +2 jours (Travaux terminaux)", coordinates: { lat: 51.92, lng: 4.47 } },
  { id: "port-7", code: "BEANR", name: "Anvers / Antwerp", country: "Belgique", countryCode: "🇧🇪", mode: "maritime", status: "actif", thcRate: 275, transitHub: "Europe Nord", activeLines: 180, coordinates: { lat: 51.21, lng: 4.40 } },
  { id: "port-8", code: "ESVLC", name: "Valence / Valencia", country: "Espagne", countryCode: "🇪🇸", mode: "maritime", status: "actif", thcRate: 220, transitHub: "Méditerranée Ouest", activeLines: 140, coordinates: { lat: 39.46, lng: -0.37 } },
  { id: "port-9", code: "ESBCN", name: "Barcelone Port", country: "Espagne", countryCode: "🇪🇸", mode: "maritime", status: "actif", thcRate: 230, transitHub: "Méditerranée", activeLines: 130, coordinates: { lat: 41.38, lng: 2.17 } },
  { id: "port-10", code: "CNSHA", name: "Shanghai Port", country: "Chine", countryCode: "🇨🇳", mode: "maritime", status: "actif", thcRate: 195, transitHub: "Asie Pacifique", activeLines: 350, coordinates: { lat: 31.23, lng: 121.47 } },
  { id: "port-11", code: "CNNGB", name: "Ningbo-Zhoushan", country: "Chine", countryCode: "🇨🇳", mode: "maritime", status: "actif", thcRate: 190, transitHub: "Asie Pacifique", activeLines: 310, coordinates: { lat: 29.86, lng: 121.54 } },
  { id: "port-12", code: "CNSZX", name: "Shenzhen / Yantian", country: "Chine", countryCode: "🇨🇳", mode: "maritime", status: "actif", thcRate: 200, transitHub: "Asie Sud", activeLines: 290, coordinates: { lat: 22.54, lng: 114.05 } },
  { id: "port-13", code: "AEDXB", name: "Jebel Ali Dubai", country: "Émirats Arabes Unis", countryCode: "🇦🇪", mode: "maritime", status: "actif", thcRate: 230, transitHub: "Moyen-Orient", activeLines: 160, coordinates: { lat: 25.01, lng: 55.06 } },
  { id: "port-14", code: "TRIST", name: "Istanbul Ambarli", country: "Turquie", countryCode: "🇹🇷", mode: "maritime", status: "actif", thcRate: 210, transitHub: "Bosphore / Mer Noire", activeLines: 95, coordinates: { lat: 41.00, lng: 28.97 } },
  
  // Aérien
  { id: "air-1", code: "CMN", name: "Casablanca CMN Cargo", country: "Maroc", countryCode: "🇲🇦", mode: "aerien", status: "actif", thcRate: 85, transitHub: "Hub Afrique Nord", activeLines: 45 },
  { id: "air-2", code: "CDG", name: "Paris Charles de Gaulle", country: "France", countryCode: "🇫🇷", mode: "aerien", status: "actif", thcRate: 120, transitHub: "Hub Europe", activeLines: 120 },
  { id: "air-3", code: "DXB", name: "Dubai Cargo Airport", country: "Émirats Arabes Unis", countryCode: "🇦🇪", mode: "aerien", status: "actif", thcRate: 110, transitHub: "Hub Global", activeLines: 90 },
  { id: "air-4", code: "PVG", name: "Shanghai Pudong Cargo", country: "Chine", countryCode: "🇨🇳", mode: "aerien", status: "actif", thcRate: 95, transitHub: "Hub Asie", activeLines: 130 },
  
  // Routier
  { id: "road-1", code: "HUB-TNG", name: "Tanger Hub TIR / Logistique", country: "Maroc", countryCode: "🇲🇦", mode: "routier", status: "actif", thcRate: 90, transitHub: "Passage Détroit", activeLines: 60 },
  { id: "road-2", code: "HUB-CAS", name: "Casablanca Plateforme TIR", country: "Maroc", countryCode: "🇲🇦", mode: "routier", status: "actif", thcRate: 95, transitHub: "Distribution Maroc", activeLines: 80 },
  { id: "road-3", code: "HUB-LYN", name: "Lyon Saint-Priest Hub", country: "France", countryCode: "🇫🇷", mode: "routier", status: "actif", thcRate: 110, transitHub: "Corridor Rhodanien", activeLines: 50 },
  { id: "road-4", code: "HUB-MAD", name: "Madrid Coslada Logistique", country: "Espagne", countryCode: "🇪🇸", mode: "routier", status: "actif", thcRate: 100, transitHub: "Péninsule Ibérique", activeLines: 70 },
];

const INITIAL_TARIFFS: RouteTariff[] = [
  { id: "tar-1", originId: "port-10", destinationId: "port-2", mode: "maritime", baseRate20: 1850, baseRate40: 2750, baseRateLclPerCbm: 110, transitTimeDaysMin: 24, transitTimeDaysMax: 28, frequency: "2x / semaine", bafRate: 180 },
  { id: "tar-2", originId: "port-10", destinationId: "port-1", mode: "maritime", baseRate20: 1750, baseRate40: 2600, baseRateLclPerCbm: 105, transitTimeDaysMin: 22, transitTimeDaysMax: 26, frequency: "3x / semaine", bafRate: 170 },
  { id: "tar-3", originId: "port-11", destinationId: "port-2", mode: "maritime", baseRate20: 1880, baseRate40: 2790, baseRateLclPerCbm: 112, transitTimeDaysMin: 25, transitTimeDaysMax: 29, frequency: "2x / semaine", bafRate: 180 },
  { id: "tar-4", originId: "port-5", destinationId: "port-2", mode: "maritime", baseRate20: 950, baseRate40: 1420, baseRateLclPerCbm: 65, transitTimeDaysMin: 5, transitTimeDaysMax: 7, frequency: "3x / semaine", bafRate: 85 },
  { id: "tar-5", originId: "port-4", destinationId: "port-2", mode: "maritime", baseRate20: 890, baseRate40: 1350, baseRateLclPerCbm: 60, transitTimeDaysMin: 4, transitTimeDaysMax: 6, frequency: "4x / semaine", bafRate: 80 },
  { id: "tar-6", originId: "port-6", destinationId: "port-1", mode: "maritime", baseRate20: 980, baseRate40: 1480, baseRateLclPerCbm: 70, transitTimeDaysMin: 6, transitTimeDaysMax: 8, frequency: "3x / semaine", bafRate: 90 },
  { id: "tar-7", originId: "port-8", destinationId: "port-2", mode: "maritime", baseRate20: 650, baseRate40: 980, baseRateLclPerCbm: 45, transitTimeDaysMin: 3, transitTimeDaysMax: 5, frequency: "Quotidien", bafRate: 60 },
  { id: "tar-8", originId: "port-13", destinationId: "port-2", mode: "maritime", baseRate20: 1450, baseRate40: 2200, baseRateLclPerCbm: 90, transitTimeDaysMin: 14, transitTimeDaysMax: 18, frequency: "1x / semaine", bafRate: 140 },
  { id: "tar-9", originId: "port-14", destinationId: "port-2", mode: "maritime", baseRate20: 1100, baseRate40: 1680, baseRateLclPerCbm: 75, transitTimeDaysMin: 7, transitTimeDaysMax: 10, frequency: "2x / semaine", bafRate: 110 },
  { id: "tar-air-1", originId: "air-2", destinationId: "air-1", mode: "aerien", baseRate20: 0, baseRate40: 0, baseRateLclPerCbm: 3.8, transitTimeDaysMin: 1, transitTimeDaysMax: 2, frequency: "Vols quotidiens", bafRate: 0.45 },
  { id: "tar-air-2", originId: "air-4", destinationId: "air-1", mode: "aerien", baseRate20: 0, baseRate40: 0, baseRateLclPerCbm: 6.2, transitTimeDaysMin: 3, transitTimeDaysMax: 4, frequency: "4x / semaine", bafRate: 0.85 },
  { id: "tar-road-1", originId: "road-3", destinationId: "road-2", mode: "routier", baseRate20: 2400, baseRate40: 2400, baseRateLclPerCbm: 85, transitTimeDaysMin: 3, transitTimeDaysMax: 4, frequency: "Départs mardi/vendredi", bafRate: 150 },
];

const INITIAL_QUOTES: ClientQuote[] = [
  {
    id: "GTI-2026-DEV-7842",
    createdAt: "2026-10-04T10:30:00Z",
    updatedAt: "2026-10-04T10:30:00Z",
    mode: "maritime",
    subType: "FCL",
    originPort: INITIAL_PORTS[9], // Shanghai
    destinationPort: INITIAL_PORTS[1], // Casablanca
    cargoNature: "perissable",
    cargoDescription: "Agrumes & Produits Frais pour l'export",
    containerType: "40_reefer",
    containerQuantity: 2,
    goodsValueEur: 85000,
    incoterm: "CIF",
    departureDate: "2026-10-15",
    services: {
      customsClearance: true,
      allRiskInsurance: true,
      doorDelivery: false,
      portHandlingTHC: true,
      tempMonitoring: true,
    },
    baseFreightEur: 5500,
    surchargesEur: 360,
    thcEur: 420,
    customsEur: 180,
    insuranceEur: 297,
    doorDeliveryEur: 0,
    totalHtEur: 6757,
    totalTtcEur: 8108.4,
    clientName: "Yassine Mansouri",
    clientCompany: "Atlas Fruits & Primeurs Maroc",
    clientEmail: "y.mansouri@atlasfruits.ma",
    clientPhone: "+212 6 61 24 88 90",
    clientCity: "Casablanca",
    clientNotes: "Besoin impératif de maintien en température constante (-2°C).",
    status: "EN_ATTENTE_CONFIRMATION",
    trackingNumber: "GTI-TRK-784201",
  },
  {
    id: "GTI-2026-DEV-7841",
    createdAt: "2026-10-04T08:15:00Z",
    updatedAt: "2026-10-04T09:40:00Z",
    mode: "maritime",
    subType: "FCL",
    originPort: INITIAL_PORTS[4], // Le Havre
    destinationPort: INITIAL_PORTS[0], // Tanger Med
    cargoNature: "industriel",
    cargoDescription: "Composants et faisceaux électriques",
    containerType: "20_dry",
    containerQuantity: 1,
    goodsValueEur: 42000,
    incoterm: "FOB",
    departureDate: "2026-10-12",
    services: {
      customsClearance: true,
      allRiskInsurance: false,
      doorDelivery: true,
      portHandlingTHC: true,
    },
    baseFreightEur: 950,
    surchargesEur: 85,
    thcEur: 180,
    customsEur: 150,
    insuranceEur: 0,
    doorDeliveryEur: 250,
    totalHtEur: 1615,
    totalTtcEur: 1938,
    adminAdjustedPriceEur: 1550,
    clientName: "Marc Fontaine",
    clientCompany: "Maghreb Câbles Industrie SA",
    clientEmail: "m.fontaine@maghrebcables.com",
    clientPhone: "+33 6 42 19 88 23",
    clientCity: "Tanger Free Zone",
    status: "CONFIRME_ADMIN",
    adminNotes: "Navire CMA CGM Tanger Express confirmé.",
    assignedAgent: "Faiez Hentati",
    vesselOrFlightRef: "CMA CGM MEDWAY v.26W04",
    trackingNumber: "GTI-TRK-784102",
  },
  {
    id: "GTI-2026-DEV-7840",
    createdAt: "2026-10-03T16:20:00Z",
    updatedAt: "2026-10-03T17:10:00Z",
    mode: "maritime",
    subType: "FCL",
    originPort: INITIAL_PORTS[11], // Shenzhen
    destinationPort: INITIAL_PORTS[1], // Casablanca
    cargoNature: "textile",
    cargoDescription: "Rouleaux de tissu et confection",
    containerType: "40_hc",
    containerQuantity: 3,
    goodsValueEur: 120000,
    incoterm: "CIF",
    departureDate: "2026-10-20",
    services: {
      customsClearance: true,
      allRiskInsurance: true,
      doorDelivery: true,
      portHandlingTHC: true,
    },
    baseFreightEur: 8370,
    surchargesEur: 540,
    thcEur: 630,
    customsEur: 220,
    insuranceEur: 420,
    doorDeliveryEur: 600,
    totalHtEur: 10780,
    totalTtcEur: 12936,
    clientName: "Sofia Benali",
    clientCompany: "TexMed Confection",
    clientEmail: "s.benali@texmed.ma",
    clientPhone: "+212 6 63 90 11 44",
    clientCity: "Fès",
    status: "EN_NEGOCIATION",
    adminNotes: "Proposition transmise avec option train combiné.",
    assignedAgent: "Faiez Hentati",
    trackingNumber: "GTI-TRK-784003",
  },
  {
    id: "GTI-2026-DEV-7839",
    createdAt: "2026-10-02T11:00:00Z",
    updatedAt: "2026-10-02T14:30:00Z",
    mode: "routier",
    subType: "FTL",
    originPort: INITIAL_PORTS[18], // Lyon
    destinationPort: INITIAL_PORTS[17], // Casablanca
    cargoNature: "industriel",
    cargoDescription: "Machines outils et pièces de rechange",
    weightKg: 18500,
    goodsValueEur: 65000,
    incoterm: "DDP",
    departureDate: "2026-10-08",
    services: {
      customsClearance: true,
      allRiskInsurance: true,
      doorDelivery: true,
      portHandlingTHC: false,
    },
    baseFreightEur: 2400,
    surchargesEur: 150,
    thcEur: 0,
    customsEur: 180,
    insuranceEur: 227.5,
    doorDeliveryEur: 200,
    totalHtEur: 3157.5,
    totalTtcEur: 3789,
    clientName: "Karim Idrissi",
    clientCompany: "IndusMaroc Equipements",
    clientEmail: "k.idrissi@indusmaroc.com",
    clientPhone: "+212 5 22 40 55 66",
    clientCity: "Casablanca",
    status: "ORDRE_TRANSPORT",
    adminNotes: "Camion TIR immatriculé 4829-A-26 affrété.",
    assignedAgent: "Sarah Lamrani",
    trackingNumber: "GTI-TRK-783904",
  },
  {
    id: "GTI-2026-DEV-7838",
    createdAt: "2026-10-01T09:10:00Z",
    updatedAt: "2026-10-01T15:00:00Z",
    mode: "aerien",
    subType: "express",
    originPort: INITIAL_PORTS[15], // CDG
    destinationPort: INITIAL_PORTS[14], // CMN
    cargoNature: "chimique",
    cargoDescription: "Réactifs pharmaceutiques sous carboglace",
    weightKg: 380,
    goodsValueEur: 95000,
    incoterm: "CIF",
    departureDate: "2026-10-03",
    services: {
      customsClearance: true,
      allRiskInsurance: true,
      doorDelivery: true,
      portHandlingTHC: true,
      tempMonitoring: true,
    },
    baseFreightEur: 1444,
    surchargesEur: 171,
    thcEur: 120,
    customsEur: 210,
    insuranceEur: 332.5,
    doorDeliveryEur: 180,
    totalHtEur: 2457.5,
    totalTtcEur: 2949,
    clientName: "Dr. Nadia El Amrani",
    clientCompany: "PharmaMaroc Laboratoires",
    clientEmail: "n.elamrani@pharmamaroc.ma",
    clientPhone: "+212 6 70 88 99 00",
    clientCity: "Casablanca",
    status: "LIVRE",
    adminNotes: "Colis dédouané en urgence sous 2h et livré au laboratoire.",
    assignedAgent: "Faiez Hentati",
    vesselOrFlightRef: "Air France Cargo AF1496",
    trackingNumber: "GTI-TRK-783805",
  }
];

const INITIAL_SHIPMENTS: ShipmentItem[] = [
  {
    id: "EXP-2026-9041",
    quoteId: "GTI-2026-DEV-7841",
    trackingNumber: "GTI-TRK-784102",
    containerNumber: "CMAU-849201-9",
    vesselName: "CMA CGM MEDWAY",
    origin: "Le Havre (FRLEH)",
    destination: "Tanger Med (MAPTM)",
    mode: "maritime",
    status: "EN_MER",
    eta: "08 Octobre 2026",
    departureDate: "04 Octobre 2026",
    clientCompany: "Maghreb Câbles Industrie SA",
    cargo: "Composants électriques (1x 20' Dry)",
    milestones: [
      { step: "Booking confirmé & Ordre émis", date: "02 Oct, 14:00", location: "Siège GTI Casablanca", completed: true },
      { step: "Enlèvement usine & Empotage", date: "03 Oct, 09:30", location: "Le Havre Port Terminal", completed: true },
      { step: "Départ Navire CMA CGM MEDWAY", date: "04 Oct, 06:00", location: "En mer - Golfe de Gascogne", completed: true, current: true },
      { step: "Arrivée prévue Tanger Med", date: "08 Oct, 10:00", location: "Tanger Med Port", completed: false },
      { step: "Dédouanement BADR & Livraison TFZ", date: "09 Oct, 15:00", location: "Zone Franche Tanger", completed: false },
    ]
  },
  {
    id: "EXP-2026-9042",
    quoteId: "GTI-2026-DEV-7839",
    trackingNumber: "GTI-TRK-783904",
    containerNumber: "TIR-4829-A26",
    vesselName: "Camion Dédié GTI TIR 4829",
    origin: "Lyon Hub (FR)",
    destination: "Casablanca Plateforme (MA)",
    mode: "routier",
    status: "EN_ROUTE",
    eta: "06 Octobre 2026",
    departureDate: "03 Octobre 2026",
    clientCompany: "IndusMaroc Equipements",
    cargo: "Machines outils (18.5 T)",
    milestones: [
      { step: "Prise en charge plateforme Lyon", date: "02 Oct, 11:00", location: "Lyon Saint-Priest", completed: true },
      { step: "Traversée Espagne / Algesiras", date: "04 Oct, 18:00", location: "Port d'Algésiras", completed: true, current: true },
      { step: "Traversée Ferry Tanger Med", date: "05 Oct, 08:00", location: "Détroit de Gibraltar", completed: false },
      { step: "Dédouanement & Livraison finale", date: "06 Oct, 14:00", location: "Casablanca Usine", completed: false },
    ]
  },
  {
    id: "EXP-2026-9043",
    quoteId: "GTI-2026-DEV-7838",
    trackingNumber: "GTI-TRK-783805",
    vesselName: "Air France Cargo AF1496",
    origin: "Paris CDG (FR)",
    destination: "Casablanca CMN (MA)",
    mode: "aerien",
    status: "LIVRE",
    eta: "03 Octobre 2026",
    departureDate: "03 Octobre 2026",
    clientCompany: "PharmaMaroc Laboratoires",
    cargo: "Réactifs médicaux sous carboglace (380 kg)",
    milestones: [
      { step: "Enlèvement Laboratoire Roissy", date: "02 Oct, 16:00", location: "Paris CDG Cargo", completed: true },
      { step: "Vol AF1496 Atterrissage CMN", date: "03 Oct, 11:45", location: "Aéroport Mohammed V", completed: true },
      { step: "Dédouanement express & Contrôle T°", date: "03 Oct, 13:30", location: "Douane Fret CMN", completed: true },
      { step: "Livraison au client & Émargement", date: "03 Oct, 16:00", location: "Casablanca Pharma", completed: true },
    ]
  }
];

const INITIAL_CLIENTS: ClientCompany[] = [
  { id: "cli-1", name: "Atlas Fruits & Primeurs Maroc", contactPerson: "Yassine Mansouri", email: "y.mansouri@atlasfruits.ma", phone: "+212 6 61 24 88 90", city: "Casablanca", country: "Maroc", sector: "Agroalimentaire", ice: "002849102000045", totalQuotes: 8, totalBookings: 6, status: "VIP" },
  { id: "cli-2", name: "Maghreb Câbles Industrie SA", contactPerson: "Marc Fontaine", email: "m.fontaine@maghrebcables.com", phone: "+33 6 42 19 88 23", city: "Tanger", country: "Maroc", sector: "Automobile & Câblage", ice: "001928472000088", totalQuotes: 14, totalBookings: 12, status: "VIP" },
  { id: "cli-3", name: "TexMed Confection", contactPerson: "Sofia Benali", email: "s.benali@texmed.ma", phone: "+212 6 63 90 11 44", city: "Fès", country: "Maroc", sector: "Textile & Habillement", ice: "003847291000012", totalQuotes: 5, totalBookings: 3, status: "Actif" },
  { id: "cli-4", name: "IndusMaroc Equipements", contactPerson: "Karim Idrissi", email: "k.idrissi@indusmaroc.com", phone: "+212 5 22 40 55 66", city: "Casablanca", country: "Maroc", sector: "Industrie Lourde", ice: "004928174000033", totalQuotes: 3, totalBookings: 2, status: "Actif" },
  { id: "cli-5", name: "PharmaMaroc Laboratoires", contactPerson: "Dr. Nadia El Amrani", email: "n.elamrani@pharmamaroc.ma", phone: "+212 6 70 88 99 00", city: "Casablanca", country: "Maroc", sector: "Santé & Pharma", ice: "005928174000077", totalQuotes: 9, totalBookings: 8, status: "VIP" },
  { id: "cli-6", name: "Global Solar Energy", contactPerson: "Tariq Chaoui", email: "t.chaoui@globalsolar.ma", phone: "+212 6 60 12 34 56", city: "Ouarzazate", country: "Maroc", sector: "Énergies Renouvelables", ice: "006847291000099", totalQuotes: 2, totalBookings: 0, status: "Prospect" },
];

const INITIAL_INVOICES: InvoiceItem[] = [
  { id: "FAC-2026-0428", quoteId: "GTI-2026-DEV-7841", clientName: "Maghreb Câbles Industrie SA", date: "04/10/2026", dueDate: "04/11/2026", amountEur: 1860, status: "EN_ATTENTE" },
  { id: "FAC-2026-0427", quoteId: "GTI-2026-DEV-7839", clientName: "IndusMaroc Equipements", date: "02/10/2026", dueDate: "02/11/2026", amountEur: 3789, status: "PAYEE" },
  { id: "FAC-2026-0426", quoteId: "GTI-2026-DEV-7838", clientName: "PharmaMaroc Laboratoires", date: "01/10/2026", dueDate: "31/10/2026", amountEur: 2949, status: "PAYEE" },
  { id: "FAC-2026-0425", quoteId: "GTI-2026-DEV-7830", clientName: "TexMed Confection", date: "24/09/2026", dueDate: "24/10/2026", amountEur: 8420, status: "RETARD" },
];

const GTIContext = createContext<GTIContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PORTS = "gti_ports_v3";
const LOCAL_STORAGE_KEY_QUOTES = "gti_quotes_v3";
const LOCAL_STORAGE_KEY_TARIFFS = "gti_tariffs_v3";
const LOCAL_STORAGE_KEY_SHIPMENTS = "gti_shipments_v3";

export function GTIProvider({ children }: { children: React.ReactNode }) {
  const [ports, setPorts] = useState<PortItem[]>(INITIAL_PORTS);
  const [tariffs, setTariffs] = useState<RouteTariff[]>(INITIAL_TARIFFS);
  const [quotes, setQuotes] = useState<ClientQuote[]>(INITIAL_QUOTES);
  const [shipments, setShipments] = useState<ShipmentItem[]>(INITIAL_SHIPMENTS);
  const [invoices, setInvoices] = useState<InvoiceItem[]>(INITIAL_INVOICES);
  const [clients, setClients] = useState<ClientCompany[]>(INITIAL_CLIENTS);
  const [currency, setCurrency] = useState<"EUR" | "MAD" | "USD">("EUR");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const savedPorts = localStorage.getItem(LOCAL_STORAGE_KEY_PORTS);
      if (savedPorts) setPorts(JSON.parse(savedPorts));

      const savedQuotes = localStorage.getItem(LOCAL_STORAGE_KEY_QUOTES);
      if (savedQuotes) setQuotes(JSON.parse(savedQuotes));

      const savedTariffs = localStorage.getItem(LOCAL_STORAGE_KEY_TARIFFS);
      if (savedTariffs) setTariffs(JSON.parse(savedTariffs));

      const savedShipments = localStorage.getItem(LOCAL_STORAGE_KEY_SHIPMENTS);
      if (savedShipments) setShipments(JSON.parse(savedShipments));
    } catch (e) {
      console.error("Failed to load GTI state from localStorage", e);
    }
  }, []);

  const savePorts = (newPorts: PortItem[]) => {
    setPorts(newPorts);
    try { localStorage.setItem(LOCAL_STORAGE_KEY_PORTS, JSON.stringify(newPorts)); } catch(e){}
  };

  const saveQuotes = (newQuotes: ClientQuote[]) => {
    setQuotes(newQuotes);
    try { localStorage.setItem(LOCAL_STORAGE_KEY_QUOTES, JSON.stringify(newQuotes)); } catch(e){}
  };

  const saveTariffs = (newTariffs: RouteTariff[]) => {
    setTariffs(newTariffs);
    try { localStorage.setItem(LOCAL_STORAGE_KEY_TARIFFS, JSON.stringify(newTariffs)); } catch(e){}
  };

  const saveShipments = (newShipments: ShipmentItem[]) => {
    setShipments(newShipments);
    try { localStorage.setItem(LOCAL_STORAGE_KEY_SHIPMENTS, JSON.stringify(newShipments)); } catch(e){}
  };

  const formatPrice = (amountInEur: number): string => {
    if (currency === "MAD") {
      const mad = amountInEur * 10.85;
      return new Intl.NumberFormat("fr-MA", { style: "currency", currency: "MAD", maximumFractionDigits: 0 }).format(mad);
    }
    if (currency === "USD") {
      const usd = amountInEur * 1.08;
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(usd);
    }
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amountInEur);
  };

  const calculateQuote = (params: {
    mode: TransportMode;
    subType: string;
    originId: string;
    destinationId: string;
    cargoNature: CargoNature;
    containerType?: ContainerType;
    containerQuantity?: number;
    weightKg?: number;
    volumeCbm?: number;
    palletsCount?: number;
    goodsValueEur: number;
    incoterm: Incoterm;
    services: QuoteServices;
  }) => {
    const origin = ports.find(p => p.id === params.originId) || ports[0];
    const destination = ports.find(p => p.id === params.destinationId) || ports[1];

    const matchTariff = tariffs.find(
      t => (t.originId === origin.id && t.destinationId === destination.id) ||
           (t.originId === destination.id && t.destinationId === origin.id)
    );

    let baseFreight = 0;
    let surcharges = 0;
    let transitTime = "12 - 16 jours";
    let frequency = "2x / semaine";

    const qty = params.containerQuantity || 1;

    if (params.mode === "maritime") {
      if (params.subType === "FCL") {
        const is40 = params.containerType?.startsWith("40") || false;
        const isReefer = params.containerType === "40_reefer";
        const ratePerUnit = matchTariff 
          ? (is40 ? matchTariff.baseRate40 : matchTariff.baseRate20) 
          : (is40 ? 2400 : 1600);
        
        baseFreight = ratePerUnit * qty * (isReefer ? 1.45 : 1.0);
        surcharges = (matchTariff ? matchTariff.bafRate : 120) * qty;
        transitTime = matchTariff ? `${matchTariff.transitTimeDaysMin} - ${matchTariff.transitTimeDaysMax} jours` : "18 - 24 jours";
        frequency = matchTariff ? matchTariff.frequency : "2x / semaine";
      } else {
        const cbm = Math.max(1, params.volumeCbm || 2);
        const ratePerCbm = matchTariff ? matchTariff.baseRateLclPerCbm : 85;
        baseFreight = ratePerCbm * cbm;
        surcharges = cbm * 18;
        transitTime = matchTariff ? `${matchTariff.transitTimeDaysMin + 3} - ${matchTariff.transitTimeDaysMax + 4} jours` : "20 - 28 jours";
        frequency = "Hebdomadaire";
      }
    } else if (params.mode === "aerien") {
      const weight = Math.max(20, params.weightKg || 100);
      const isExpress = params.subType === "express";
      const ratePerKg = matchTariff ? matchTariff.baseRateLclPerCbm : (isExpress ? 5.5 : 3.8);
      baseFreight = ratePerKg * weight * (isExpress ? 1.3 : 1.0);
      surcharges = weight * 0.45;
      transitTime = isExpress ? "24 - 48 heures" : "3 - 5 jours";
      frequency = "Vols quotidiens";
    } else {
      const isFTL = params.subType === "FTL";
      if (isFTL) {
        baseFreight = matchTariff ? matchTariff.baseRate20 : 2100;
        surcharges = 140;
        transitTime = matchTariff ? `${matchTariff.transitTimeDaysMin} - ${matchTariff.transitTimeDaysMax} jours` : "3 - 5 jours";
        frequency = "3 départs / semaine";
      } else {
        const pallets = Math.max(1, params.palletsCount || 2);
        baseFreight = pallets * 220;
        surcharges = pallets * 25;
        transitTime = "4 - 6 jours";
        frequency = "2 départs / semaine";
      }
    }

    if (params.cargoNature === "dangereux") {
      baseFreight *= 1.25;
      surcharges += 150;
    } else if (params.cargoNature === "perissable") {
      baseFreight *= 1.15;
    }

    const thc = params.services.portHandlingTHC 
      ? (origin.thcRate + destination.thcRate) * (params.mode === "maritime" && params.subType === "FCL" ? qty : 1)
      : 0;

    const customs = params.services.customsClearance ? 180 : 0;
    const insurance = params.services.allRiskInsurance 
      ? Math.max(50, Math.round(params.goodsValueEur * 0.0035))
      : 0;

    const doorDelivery = params.services.doorDelivery ? 250 * (params.subType === "FCL" ? qty : 1) : 0;

    const totalHt = Math.round(baseFreight + surcharges + thc + customs + insurance + doorDelivery);
    const totalTtc = Math.round(totalHt * 1.2);

    return {
      baseFreight: Math.round(baseFreight),
      surcharges: Math.round(surcharges),
      thc: Math.round(thc),
      customs,
      insurance,
      doorDelivery,
      totalHt,
      totalTtc,
      transitTime,
      frequency,
    };
  };

  const submitQuote = async (quoteData: Omit<ClientQuote, "id" | "createdAt" | "updatedAt" | "status">): Promise<ClientQuote> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `GTI-2026-DEV-${randomNum}`;
    const trackingNum = `GTI-TRK-${randomNum}01`;
    const now = new Date().toISOString();

    const newQuote: ClientQuote = {
      ...quoteData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      status: "EN_ATTENTE_CONFIRMATION",
      trackingNumber: trackingNum,
    };

    const updated = [newQuote, ...quotes];
    saveQuotes(updated);

    const existingClient = clients.find(c => c.email.toLowerCase() === quoteData.clientEmail.toLowerCase());
    if (existingClient) {
      setClients(clients.map(c => c.id === existingClient.id ? { ...c, totalQuotes: c.totalQuotes + 1 } : c));
    } else {
      const newCli: ClientCompany = {
        id: `cli-${Date.now()}`,
        name: quoteData.clientCompany || quoteData.clientName,
        contactPerson: quoteData.clientName,
        email: quoteData.clientEmail,
        phone: quoteData.clientPhone,
        city: quoteData.clientCity || "Maroc",
        country: "Maroc",
        sector: "Commerce & Industrie",
        totalQuotes: 1,
        totalBookings: 0,
        status: "Prospect",
      };
      setClients([newCli, ...clients]);
    }

    return newQuote;
  };

  const confirmQuote = (quoteId: string, adminNotes?: string, adjustedPriceEur?: number) => {
    const now = new Date().toISOString();
    const updated = quotes.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: "CONFIRME_ADMIN" as QuoteStatus,
          updatedAt: now,
          adminNotes: adminNotes || q.adminNotes || "Devis validé et confirmé par le pôle commercial GTI.",
          adminAdjustedPriceEur: adjustedPriceEur !== undefined ? adjustedPriceEur : q.adminAdjustedPriceEur,
          assignedAgent: "Faiez Hentati (Commercial GTI)",
        };
      }
      return q;
    });
    saveQuotes(updated);
  };

  const rejectQuote = (quoteId: string, reason?: string) => {
    const now = new Date().toISOString();
    const updated = quotes.map(q => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: "REJETE" as QuoteStatus,
          updatedAt: now,
          adminNotes: reason || "Demande refusée ou capacité non disponible sur cet axe.",
        };
      }
      return q;
    });
    saveQuotes(updated);
  };

  const updateQuoteStatus = (quoteId: string, status: QuoteStatus) => {
    const now = new Date().toISOString();
    const updated = quotes.map(q => {
      if (q.id === quoteId) {
        return { ...q, status, updatedAt: now };
      }
      return q;
    });
    saveQuotes(updated);
  };

  const transformToShipment = (quoteId: string): ShipmentItem => {
    const q = quotes.find(x => x.id === quoteId) || quotes[0];
    const newShipment: ShipmentItem = {
      id: `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      quoteId: q.id,
      trackingNumber: q.trackingNumber || `GTI-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      containerNumber: q.mode === "maritime" ? `GTIU-${Math.floor(100000 + Math.random() * 900000)}-4` : undefined,
      vesselName: q.vesselOrFlightRef || (q.mode === "maritime" ? "CMA CGM TANGER EXPRESS" : "GTI Trans Flotte"),
      origin: `${q.originPort.name} (${q.originPort.code})`,
      destination: `${q.destinationPort.name} (${q.destinationPort.code})`,
      mode: q.mode,
      status: "EN_ATTENTE",
      eta: "Sous 12 jours",
      departureDate: q.departureDate,
      clientCompany: q.clientCompany,
      cargo: q.cargoDescription || q.cargoNature,
      milestones: [
        { step: "Ordre de Transport Émis", date: "Aujourd'hui", location: "Siège GTI", completed: true, current: true },
        { step: "Enlèvement & Empotage", date: "En attente", location: q.originPort.name, completed: false },
        { step: "Départ Navire / Expédition", date: "En attente", location: "En transit", completed: false },
        { step: "Dédouanement & Livraison", date: "En attente", location: q.destinationPort.name, completed: false },
      ]
    };

    saveShipments([newShipment, ...shipments]);
    updateQuoteStatus(quoteId, "ORDRE_TRANSPORT");
    return newShipment;
  };

  const addPort = (port: Omit<PortItem, "id">) => {
    const newPort: PortItem = {
      ...port,
      id: `port-${Date.now()}`,
    };
    savePorts([...ports, newPort]);
  };

  const updatePort = (id: string, updates: Partial<PortItem>) => {
    const updated = ports.map(p => p.id === id ? { ...p, ...updates } : p);
    savePorts(updated);
  };

  const deletePort = (id: string) => {
    const updated = ports.filter(p => p.id !== id);
    savePorts(updated);
  };

  const togglePortStatus = (id: string, status: PortStatus) => {
    const updated = ports.map(p => p.id === id ? { ...p, status } : p);
    savePorts(updated);
  };

  const updateTariff = (id: string, updates: Partial<RouteTariff>) => {
    const updated = tariffs.map(t => t.id === id ? { ...t, ...updates } : t);
    saveTariffs(updated);
  };

  const addTariff = (tariff: Omit<RouteTariff, "id">) => {
    const newTariff: RouteTariff = {
      ...tariff,
      id: `tar-${Date.now()}`,
    };
    saveTariffs([...tariffs, newTariff]);
  };

  return (
    <GTIContext.Provider
      value={{
        ports,
        tariffs,
        quotes,
        shipments,
        invoices,
        clients,
        currency,
        setCurrency,
        formatPrice,
        calculateQuote,
        submitQuote,
        confirmQuote,
        rejectQuote,
        updateQuoteStatus,
        transformToShipment,
        addPort,
        updatePort,
        deletePort,
        togglePortStatus,
        updateTariff,
        addTariff,
      }}
    >
      {children}
    </GTIContext.Provider>
  );
}

export function useGTI() {
  const context = useContext(GTIContext);
  if (!context) {
    throw new Error("useGTI must be used within a GTIProvider");
  }
  return context;
}
