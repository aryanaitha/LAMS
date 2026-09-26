import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

function sha256(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

// Generate realistic irregular polygon around a center (lat, lng)
function generateParcelPolygon(centerLat: number, centerLng: number, sizeDelta: number): string {
  // 5 to 7 vertices for realistic farm field
  const points: [number, number][] = [
    [centerLng - sizeDelta * 0.9, centerLat - sizeDelta * 0.8],
    [centerLng + sizeDelta * 0.8, centerLat - sizeDelta * 0.9],
    [centerLng + sizeDelta * 1.1, centerLat + sizeDelta * 0.2],
    [centerLng + sizeDelta * 0.7, centerLat + sizeDelta * 1.0],
    [centerLng - sizeDelta * 0.3, centerLat + sizeDelta * 1.1],
    [centerLng - sizeDelta * 1.0, centerLat + sizeDelta * 0.3],
  ];
  // close polygon
  points.push(points[0]);
  return JSON.stringify({
    type: "Polygon",
    coordinates: [points],
  });
}

async function main() {
  console.log("Starting LAMS database seeding...");

  // Clear existing data in correct dependency order
  await prisma.auditLog.deleteMany();
  await prisma.appNotification.deleteMany();
  await prisma.grievance.deleteMany();
  await prisma.candidateAlignment.deleteMany();
  await prisma.parcel.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.village.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemConfig.deleteMany();

  // 1. System Config
  await prisma.systemConfig.create({
    data: {
      id: "default",
      simulatedDateOffsetDays: 0,
      slaProposalScrutinyDays: 15,
      slaSiaAppraisalDays: 60,
      slaObjectionHearingDays: 60,
      slaAwardEnquiryDays: 90,
      solatiumPercentage: 100.0,
      ruralMultiplier: 1.5,
      additionalInterestRate: 12.0,
    },
  });

  // 2. Users for all 7 roles
  const hashedPassword = await bcrypt.hash("Demo@123", 10);
  const users = [
    {
      email: "central.ministry@lams.gov.in",
      name: "Dr. Arvind Subramanian",
      role: "CENTRAL_MINISTRY",
      department: "Dept of Land Resources, MoRD",
      jurisdiction: "National",
      phone: "+91 98110 01122",
    },
    {
      email: "state.maharashtra@lams.gov.in",
      name: "Smt. Manisha Verma, IAS",
      role: "STATE_OFFICER",
      department: "Revenue & Forest Dept, Maharashtra",
      jurisdiction: "Maharashtra",
      phone: "+91 98220 33445",
    },
    {
      email: "collector.nashik@lams.gov.in",
      name: "Shri Jalaj Sharma, IAS",
      role: "DISTRICT_COLLECTOR",
      department: "District Collectorate & CALA, Nashik",
      jurisdiction: "Nashik District",
      phone: "+91 98230 55667",
    },
    {
      email: "nhai.projects@lams.gov.in",
      name: "Rajeev Agrawal",
      role: "REQUIRING_BODY",
      department: "NHAI Project Implementation Unit",
      jurisdiction: "Western Corridors",
      phone: "+91 98900 77889",
    },
    {
      email: "field.sinnar@lams.gov.in",
      name: "Santosh Kulkarni",
      role: "FIELD_OFFICER",
      department: "Tehsil Revenue Office, Sinnar",
      jurisdiction: "Sinnar Tehsil",
      phone: "+91 94220 99001",
    },
    {
      email: "ramesh.patil@lams.test",
      name: "Ramesh Tukaram Patil",
      role: "LANDOWNER",
      department: "Citizen / Landowner",
      jurisdiction: "Musalgaon, Sinnar",
      phone: "+91 98221 42109",
    },
    {
      email: "admin@lams.gov.in",
      name: "System Administrator",
      role: "ADMIN",
      department: "NIC / Digital India Land Records Modernization",
      jurisdiction: "System-wide",
      phone: "+91 99999 00000",
    },
  ];

  for (const u of users) {
    await prisma.user.create({
      data: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: u.role,
        status: "ACTIVE",
        department: u.department,
        jurisdiction: u.jurisdiction,
        phone: u.phone,
      },
    });
  }
  console.log(`Seeded ${users.length} system users.`);

  // 3. Projects (6 Diverse Projects)
  const projects = [
    {
      id: "proj_nh_084",
      code: "NH-2026-084",
      name: "Nashik-Pune Industrial Expressway (Sinnar Bypass)",
      nameHi: "नाशिक-पुणे औद्योगिक द्रुतगतिमार्ग (सिन्नर बायपास)",
      sector: "HIGHWAY",
      state: "Maharashtra",
      district: "Nashik",
      tehsils: "Sinnar, Niphad",
      status: "SEC_11",
      stage: "Section 11 Preliminary Notification & Objections",
      slaDeadline: new Date(Date.now() + 45 * 86400000),
      delayRiskScore: 28,
      delayReasons: JSON.stringify(["Hearings scheduled for 18 objections in Musalgaon village", "Joint measurement survey completed for 92% parcels"]),
      budgetCr: 480.0,
      disbursedCr: 84.5,
      targetAreaHa: 142.5,
      acquiredAreaHa: 42.0,
      totalParcels: 280,
      affectedFamilies: 195,
      requiringBody: "National Highways Authority of India (NHAI)",
    },
    {
      id: "proj_nh_102",
      code: "NH-2026-102",
      name: "Samruddhi Mahamarg Feeder Corridor (Niphad Link)",
      nameHi: "समृद्धि महामार्ग फीडर कॉरिडोर (निफाड लिंक)",
      sector: "HIGHWAY",
      state: "Maharashtra",
      district: "Nashik",
      tehsils: "Niphad",
      status: "AWARD",
      stage: "Award Enquiry & Valuation under Section 23",
      slaDeadline: new Date(Date.now() - 12 * 86400000), // SLA breached!
      delayRiskScore: 78,
      delayReasons: JSON.stringify(["SLA statutory deadline breached by 12 days", "Pending 6 High Court writ petitions regarding valuation multiplier", "Tree & structure compensation re-verification ordered"]),
      budgetCr: 320.0,
      disbursedCr: 120.0,
      targetAreaHa: 96.0,
      acquiredAreaHa: 68.0,
      totalParcels: 190,
      affectedFamilies: 140,
      requiringBody: "MSRDC",
    },
    {
      id: "proj_rl_019",
      code: "RL-2026-019",
      name: "Pune-Nashik Semi High-Speed Rail Corridor",
      nameHi: "पुणे-नाशिक सेमी हाय-स्पीड रेल कॉरिडोर",
      sector: "RAILWAY",
      state: "Maharashtra",
      district: "Pune",
      tehsils: "Khed, Shirur",
      status: "SIA",
      stage: "Social Impact Assessment & Expert Committee Appraisal",
      slaDeadline: new Date(Date.now() + 30 * 86400000),
      delayRiskScore: 18,
      delayReasons: JSON.stringify(["Public consultations completed in 16 villages", "Expert committee appraisal draft under review"]),
      budgetCr: 1250.0,
      disbursedCr: 0.0,
      targetAreaHa: 280.0,
      acquiredAreaHa: 0.0,
      totalParcels: 420,
      affectedFamilies: 310,
      requiringBody: "Maharashtra Rail Infrastructure Development Corporation (MRIDC)",
    },
    {
      id: "proj_ir_007",
      code: "IR-2026-007",
      name: "Upper Godavari Left Bank Canal Modernization",
      nameHi: "ऊपरी गोदावरी डांवा तट नहर आधुनिकीकरण",
      sector: "IRRIGATION",
      state: "Maharashtra",
      district: "Nashik",
      tehsils: "Niphad, Sinnar",
      status: "SEC_19",
      stage: "Section 19 Final Declaration & R&R Scheme Publication",
      slaDeadline: new Date(Date.now() - 5 * 86400000), // delayed
      delayRiskScore: 64,
      delayReasons: JSON.stringify(["Delayed forest stage-1 clearance on 4.2 Ha corridor", "R&R scheme modification pending Collector approval"]),
      budgetCr: 190.0,
      disbursedCr: 45.0,
      targetAreaHa: 64.0,
      acquiredAreaHa: 38.0,
      totalParcels: 130,
      affectedFamilies: 85,
      requiringBody: "Water Resources Department, Maharashtra",
    },
    {
      id: "proj_in_031",
      code: "IN-2026-031",
      name: "Sinnar-MIDC Phase IV Industrial Growth Centre",
      nameHi: "सिन्नर-एमआईडीसी चरण IV औद्योगिक संवृद्धि केंद्र",
      sector: "INDUSTRIAL",
      state: "Maharashtra",
      district: "Nashik",
      tehsils: "Sinnar",
      status: "COMPENSATION",
      stage: "Direct Beneficiary Compensation Disbursement (PFMS)",
      slaDeadline: new Date(Date.now() + 6 * 86400000), // near deadline
      delayRiskScore: 35,
      delayReasons: JSON.stringify(["82% compensation disbursed via PFMS direct transfer", "Remaining 18% pending succession heir documentation"]),
      budgetCr: 540.0,
      disbursedCr: 442.8,
      targetAreaHa: 210.0,
      acquiredAreaHa: 195.0,
      totalParcels: 210,
      affectedFamilies: 160,
      requiringBody: "MIDC",
    },
    {
      id: "proj_tr_055",
      code: "TR-2026-055",
      name: "400kV Western Green Energy Power Evacuation Corridor",
      nameHi: "400kV पश्चिमी हरित ऊर्जा ट्रांसमिशन गलियारा",
      sector: "TRANSMISSION",
      state: "Maharashtra",
      district: "Pune",
      tehsils: "Shirur",
      status: "POSSESSION",
      stage: "Tower Footing Possession & Crop Compensation Handover",
      slaDeadline: new Date(Date.now() + 60 * 86400000),
      delayRiskScore: 12,
      delayReasons: JSON.stringify(["Smooth RoW settlement achieved", "Final possession Panchanama executed"]),
      budgetCr: 110.0,
      disbursedCr: 98.0,
      targetAreaHa: 32.0,
      acquiredAreaHa: 30.5,
      totalParcels: 75,
      affectedFamilies: 60,
      requiringBody: "Power Grid Corporation of India (PGCIL)",
    },
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }
  console.log(`Seeded ${projects.length} major projects.`);

  // 4. 40 Villages (4 Tehsils, 2 Districts)
  // Accurate rural Maharashtra agricultural coordinates around Sinnar, Niphad, Khed, Shirur
  const villageData = [
    // Nashik District -> Sinnar Tehsil (Center ~19.85, 74.00)
    { name: "Musalgaon", nameHi: "मुसळगाव", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.864, lng: 73.985 },
    { name: "Gonde", nameHi: "गोंदे", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.845, lng: 73.972 },
    { name: "Pandhurli", nameHi: "पांढुर्ली", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.815, lng: 73.951 },
    { name: "Vadgaon Sinnar", nameHi: "वडगाव सिन्नर", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.872, lng: 74.015 },
    { name: "Shirasgaon", nameHi: "शिरसगाव", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.832, lng: 74.025 },
    { name: "Baragaon Pimpri", nameHi: "बारागाव पिंप्री", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.888, lng: 74.045 },
    { name: "Dodi Khurd", nameHi: "डोडी खुर्द", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.782, lng: 74.032 },
    { name: "Dodi Budruk", nameHi: "डोडी बुद्रुक", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.771, lng: 74.048 },
    { name: "Wavi", nameHi: "वावी", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.825, lng: 74.120 },
    { name: "Shah", nameHi: "शाह", tehsil: "Sinnar", district: "Nashik", state: "Maharashtra", lat: 19.895, lng: 73.962 },

    // Nashik District -> Niphad Tehsil (Center ~20.07, 74.11)
    { name: "Pimpalgaon Baswant", nameHi: "पिंपळगाव बसवंत", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.172, lng: 73.985 },
    { name: "Ozar", nameHi: "ओझर", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.095, lng: 73.925 },
    { name: "Lasalgaon", nameHi: "लासलगाव", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.145, lng: 74.232 },
    { name: "Kundewadi", nameHi: "कुंदेवाडी", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.065, lng: 74.110 },
    { name: "Ranwad", nameHi: "रानवड", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.082, lng: 74.142 },
    { name: "Saykheda", nameHi: "सायखेडा", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.035, lng: 74.055 },
    { name: "Khedgaon", nameHi: "खेडगाव", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.115, lng: 74.065 },
    { name: "Chandori", nameHi: "चांदोरी", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.045, lng: 74.015 },
    { name: "Sukene", nameHi: "सुकेणे", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.088, lng: 74.088 },
    { name: "Vinchur", nameHi: "विंचूर", tehsil: "Niphad", district: "Nashik", state: "Maharashtra", lat: 20.125, lng: 74.205 },

    // Pune District -> Khed Tehsil (Center ~18.85, 73.85)
    { name: "Chakan", nameHi: "चाकण", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.758, lng: 73.856 },
    { name: "Rajgurunagar", nameHi: "राजगुरुनगर", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.858, lng: 73.882 },
    { name: "Alandi", nameHi: "आळंदी", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.675, lng: 73.898 },
    { name: "Medankarwadi", nameHi: "मेदनकरवाडी", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.742, lng: 73.868 },
    { name: "Kuruli", nameHi: "कुरुळी", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.718, lng: 73.852 },
    { name: "Kadachiwadi", nameHi: "कडाचीवाडी", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.735, lng: 73.878 },
    { name: "Nanekarwadi", nameHi: "नानेकरवाडी", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.748, lng: 73.835 },
    { name: "Khalumbre", nameHi: "खळुंब्रे", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.732, lng: 73.815 },
    { name: "Mahalunge", nameHi: "म्हाळुंगे", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.725, lng: 73.792 },
    { name: "Vasuli", nameHi: "वासुली", tehsil: "Khed", district: "Pune", state: "Maharashtra", lat: 18.762, lng: 73.785 },

    // Pune District -> Shirur Tehsil (Center ~18.82, 74.25)
    { name: "Shikrapur", nameHi: "शिक्रापूर", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.692, lng: 74.125 },
    { name: "Sanaswadi", nameHi: "सणसवाडी", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.672, lng: 74.075 },
    { name: "Koregaon Bhima", nameHi: "कोरेगाव भीमा", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.655, lng: 74.032 },
    { name: "Ranjangaon", nameHi: "रांजणगाव", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.752, lng: 74.238 },
    { name: "Karegaon", nameHi: "कारेगाव", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.735, lng: 74.215 },
    { name: "Pabal", nameHi: "पाबळ", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.835, lng: 74.055 },
    { name: "Talegaon Dhamdhere", nameHi: "तळेगाव ढमढेरे", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.675, lng: 74.155 },
    { name: "Kondhapuri", nameHi: "कोंढापुरी", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.712, lng: 74.175 },
    { name: "Mandavgan", nameHi: "मांडवगण", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.785, lng: 74.452 },
    { name: "Nhavare", nameHi: "न्हावरे", tehsil: "Shirur", district: "Pune", state: "Maharashtra", lat: 18.625, lng: 74.325 },
  ];

  const createdVillages = [];
  for (const v of villageData) {
    const created = await prisma.village.create({
      data: {
        name: v.name,
        nameHi: v.nameHi,
        tehsil: v.tehsil,
        district: v.district,
        state: v.state,
        lat: v.lat,
        lng: v.lng,
        parcelCount: 0,
      },
    });
    createdVillages.push(created);
  }
  console.log(`Seeded ${createdVillages.length} villages across 4 tehsils.`);

  // 5. Seed ~700 Synthetic Owners & ~180 R&R Families
  const firstNames = ["Ramesh", "Suresh", "Ganesh", "Balasaheb", "Sunita", "Savita", "Dattatray", "Pandurang", "Santosh", "Ashok", "Kishore", "Vitthal", "Anand", "Nitin", "Meena", "Vandana", "Shantaram", "Baburao", "Eknath", "Gopal"];
  const lastNames = ["Patil", "Deshmukh", "Jadhav", "Shinde", "Pawar", "Gaikwad", "Kulkarni", "Chavan", "Wagh", "Bhosale", "More", "Suryavanshi", "Khairnar", "Dumbre", "Kale", "Gite", "Avhad", "Londhe", "Sonawane", "Thakare"];

  const createdOwners = [];
  for (let i = 1; i <= 720; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 7) % lastNames.length];
    const isVulnerable = i % 4 === 0;
    const vType = isVulnerable ? (i % 8 === 0 ? "SC" : i % 12 === 0 ? "ST" : i % 6 === 0 ? "WOMEN_HEADED" : "MARGINAL_FARMER") : null;
    const isRr = i <= 185;

    const owner = await prisma.owner.create({
      data: {
        id: `own_${i}`,
        name: `${fn} ${ln}`,
        nameHi: `${fn} ${ln}`,
        maskedPhone: `+91 98*** ${String(10000 + (i * 37) % 90000)}`,
        maskedAadhaar: `XXXX-XXXX-${String(1000 + (i * 83) % 9000)}`,
        address: `Gat No. ${100 + (i % 250)}, Tehsil ${i % 2 === 0 ? "Sinnar" : "Niphad"}, Dist. Nashik`,
        bankAccountMasked: `SBIN000****${String(1000 + (i * 19) % 9000)}`,
        ifsc: "SBIN0001428",
        isVulnerable,
        vulnerabilityType: vType,
        familyMembers: 3 + (i % 5),
        rrPackageAssigned: isRr,
        rrEntitlementsJson: isRr ? JSON.stringify({
          housingEntitlement: "Indira Awas 50 sq.m Constructed Unit or ₹3,50,000 grant",
          subsistenceAllowance: "₹50,000 one-time grant",
          annuityBenefit: "₹2,500/month for 20 years or mandatory job offer",
          resettlementAllowance: "₹50,000 transport and shifting grant",
          cattleShedGrant: isVulnerable ? "₹25,000 grant for cattle shed / petty shop" : null,
          status: i % 3 === 0 ? "COMPLETED" : "IN_PROGRESS",
        }) : null,
      },
    });
    createdOwners.push(owner);
  }
  console.log(`Seeded ${createdOwners.length} synthetic landowners (${185} R&R families).`);

  // 6. Seed ~900 Land Parcels with real irregular polygons overlaying Sinnar/Niphad fields
  const statuses = ["PROPOSED", "NOTIFIED", "OBJECTIONS", "AWARDED", "COMPENSATION_PAID", "POSSESSED", "DISPUTED"];
  const landUses = ["AGRICULTURAL_IRRIGATED", "AGRICULTURAL_UNIRRIGATED", "COMMERCIAL", "RESIDENTIAL", "BARREN"];

  let totalParcelsCount = 0;
  // Generate 22 to 24 parcels per village across 40 villages = ~920 parcels
  for (let vi = 0; vi < createdVillages.length; vi++) {
    const vill = createdVillages[vi];
    const parcelsInVillage = 23;

    for (let p = 1; p <= parcelsInVillage; p++) {
      totalParcelsCount++;
      const parcelIndex = totalParcelsCount;
      const owner = createdOwners[(parcelIndex * 3) % createdOwners.length];
      
      // Determine project assignment (primarily NH-084, NH-102, IR-007, IN-031)
      let projId: string | null = null;
      if (vill.district === "Nashik") {
        if (vill.tehsil === "Sinnar") projId = parcelIndex % 3 === 0 ? "proj_in_031" : "proj_nh_084";
        else projId = parcelIndex % 2 === 0 ? "proj_nh_102" : "proj_ir_007";
      } else {
        projId = vill.tehsil === "Khed" ? "proj_rl_019" : "proj_tr_055";
      }

      // Offset coordinates around village center
      const row = Math.floor(p / 5);
      const col = p % 5;
      const offsetLat = (row - 2) * 0.0035 + ((parcelIndex % 7) * 0.0003);
      const offsetLng = (col - 2) * 0.0035 + ((parcelIndex % 5) * 0.0003);
      const centerLat = Number((vill.lat + offsetLat).toFixed(6));
      const centerLng = Number((vill.lng + offsetLng).toFixed(6));
      
      // Realistic polygon size: ~0.0008 to 0.0016 degrees (~0.2 to 2.5 Ha)
      const sizeDelta = 0.0007 + ((parcelIndex % 6) * 0.00015);
      const geometry = generateParcelPolygon(centerLat, centerLng, sizeDelta);

      // Area in Hectares: 0.25 to 2.85 ha
      const areaHa = Number((0.35 + (parcelIndex % 25) * 0.1).toFixed(2));
      const marketValuePerHa = 3200000 + (parcelIndex % 15) * 250000;
      const calculatedCompensation = Math.round(areaHa * marketValuePerHa * 1.5 * 2.12); // Solatium + Interest

      // Special flags
      const isLitigation = parcelIndex % 45 === 0; // ~20 litigation parcels
      const isMultiProjectOverlap = parcelIndex === 42 || parcelIndex === 88 || parcelIndex === 145 || parcelIndex === 210 || parcelIndex === 295;
      const isEcoSensitive = parcelIndex % 60 === 0;

      let status = statuses[parcelIndex % statuses.length];
      if (isLitigation) status = "DISPUTED";

      // Ramesh Patil (Landowner Demo User) parcel anchor:
      const isRameshPatilParcel = parcelIndex === 104;
      const ulpin = isRameshPatilParcel ? "MH24-0891-4402" : `MH24-${String(1000 + (parcelIndex * 17) % 8999)}-${String(4000 + (parcelIndex * 31) % 5999)}`;
      const surveyNo = isRameshPatilParcel ? "104/2" : `${100 + (parcelIndex % 180)}/${1 + (parcelIndex % 6)}`;

      await prisma.parcel.create({
        data: {
          ulpin,
          surveyNo,
          subDivision: isRameshPatilParcel ? "2A" : `A${1 + (parcelIndex % 4)}`,
          villageId: vill.id,
          villageName: vill.name,
          district: vill.district,
          areaHa,
          landUse: landUses[parcelIndex % landUses.length],
          status,
          geometry,
          centerLat,
          centerLng,
          ownerId: isRameshPatilParcel ? "own_1" : owner.id,
          ownerName: isRameshPatilParcel ? "Ramesh Tukaram Patil" : owner.name,
          projectId: projId,
          marketValuePerHa,
          calculatedCompensation,
          paidCompensation: status === "COMPENSATION_PAID" || status === "POSSESSED" ? calculatedCompensation : 0,
          isLitigation,
          isEcoSensitive,
          isMultiProjectOverlap,
          overlappingProjects: isMultiProjectOverlap ? "NH-2026-084 / IN-2026-031 (Sinnar Industrial Feeder)" : null,
        },
      });
    }

    // Update village count
    await prisma.village.update({
      where: { id: vill.id },
      data: { parcelCount: parcelsInVillage },
    });
  }
  console.log(`Seeded ${totalParcelsCount} parcels with realistic irregular field polygons.`);

  // 7. Seed Candidate Alignments for What-If Simulator
  // Project: Nashik-Pune Industrial Expressway (Sinnar Bypass)
  const alignmentALine = JSON.stringify({
    type: "LineString",
    coordinates: [
      [73.962, 19.895],
      [73.972, 19.870],
      [73.985, 19.864],
      [74.015, 19.840],
      [74.045, 19.815],
      [74.085, 19.785],
    ],
  });

  const alignmentBLine = JSON.stringify({
    type: "LineString",
    coordinates: [
      [73.951, 19.890],
      [73.965, 19.855],
      [73.995, 19.825],
      [74.025, 19.795],
      [74.060, 19.765],
    ],
  });

  await prisma.candidateAlignment.create({
    data: {
      projectId: "proj_nh_084",
      name: "Option A: Northern Semi-Urban Bypass Corridor",
      description: "Traverses north of Sinnar town near Musalgaon industrial fringe. Requires crossing 2 state highways and higher density agricultural lands.",
      bufferWidthMeters: 60.0,
      lineGeometry: alignmentALine,
      affectedParcelsCount: 184,
      affectedAreaHa: 142.5,
      estimatedCostCr: 480.0,
      displacedFamiliesCount: 195,
      forestWaterOverlapHa: 3.4,
      isRecommended: false,
      recommendationScore: 68.5,
      recommendationReasons: "High R&R displacement (195 families) and requires 3.4 Ha eco-sensitive and canal buffer clearance. Higher overall land acquisition compensation cost.",
    },
  });

  await prisma.candidateAlignment.create({
    data: {
      projectId: "proj_nh_084",
      name: "Option B: Southern Greenfield Bypass Alignment (Recommended)",
      description: "Southern greenfield alignment avoiding high-value urban fringes. Follows natural contours with minimal residential settlement displacement.",
      bufferWidthMeters: 60.0,
      lineGeometry: alignmentBLine,
      affectedParcelsCount: 126,
      affectedAreaHa: 98.2,
      estimatedCostCr: 342.0,
      displacedFamiliesCount: 38,
      forestWaterOverlapHa: 0.2,
      isRecommended: true,
      recommendationScore: 92.4,
      recommendationReasons: "Reduces affected families by 80.5% (only 38 families vs 195). Saves ₹138.0 Cr in acquisition compensation and minimizes environmental buffer overlap to 0.2 Ha.",
    },
  });
  console.log("Seeded Candidate Alignments for What-If spatial simulation.");

  // 8. Seed 30 Grievances / Objections under Section 15
  const grievanceCategories = ["COMPENSATION_AMOUNT", "OWNERSHIP_DISPUTE", "MEASUREMENT_ERROR", "RR_BENEFIT"];
  for (let g = 1; g <= 30; g++) {
    const isResolved = g > 20;
    const cat = grievanceCategories[g % grievanceCategories.length];
    await prisma.grievance.create({
      data: {
        trackingNo: `GRV-2026-${String(1000 + g)}`,
        parcelUlpin: g === 1 ? "MH24-0891-4402" : `MH24-${String(2000 + g * 33)}-${String(4000 + g * 47)}`,
        surveyNo: g === 1 ? "104/2" : `${110 + g}/1`,
        applicantName: g === 1 ? "Ramesh Tukaram Patil" : createdOwners[g].name,
        applicantPhone: "+91 98221 42109",
        category: cat,
        description: g === 1
          ? "Objection regarding tree valuation: 42 yielding pomegranate trees and irrigation drip infrastructure not included in preliminary joint measurement survey."
          : `Objection regarding ${cat.toLowerCase().replace(/_/g, " ")}: Discrepancy between village map cadastral sheet and physical boundaries on ground.`,
        status: isResolved ? "RESOLVED" : g % 2 === 0 ? "HEARING_SCHEDULED" : "UNDER_REVIEW",
        hearingDate: isResolved ? new Date(Date.now() - 10 * 86400000) : new Date(Date.now() + (g * 2) * 86400000),
        resolutionNotes: isResolved ? "Joint re-inspection carried out by CALA team. Valuation revision approved in Supplementary Award." : null,
        filedAt: new Date(Date.now() - (g * 3) * 86400000),
        resolvedAt: isResolved ? new Date() : null,
      },
    });
  }
  console.log("Seeded 30 grievances and Section 15 objections.");

  // 9. Seed Genesis and Operational Hash-Chained Audit Trail
  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000";
  const auditEntries = [
    {
      actorEmail: "admin@lams.gov.in",
      actorRole: "ADMIN",
      action: "GENESIS_SYSTEM_BOOTSTRAP",
      entityType: "SYSTEM",
      entityId: "SYSTEM_INIT",
      details: "LAMS National Platform database initialized with statutory parameters and master cadastral boundaries.",
    },
    {
      actorEmail: "nhai.projects@lams.gov.in",
      actorRole: "REQUIRING_BODY",
      action: "PROPOSAL_SUBMITTED",
      entityType: "PROJECT",
      entityId: "proj_nh_084",
      details: "Submitted formal acquisition proposal for NH-2026-084 Nashik-Pune Expressway Sinnar Bypass (142.5 Ha).",
    },
    {
      actorEmail: "collector.nashik@lams.gov.in",
      actorRole: "DISTRICT_COLLECTOR",
      action: "SECTION_11_ISSUED",
      entityType: "NOTIFICATION",
      entityId: "NOTIF-SEC11-084",
      details: "Published Preliminary Notification under Section 11(1) of RFCTLARR Act 2013 across 10 villages in Sinnar tehsil.",
    },
    {
      actorEmail: "field.sinnar@lams.gov.in",
      actorRole: "FIELD_OFFICER",
      action: "JOINT_SURVEY_COMPLETED",
      entityType: "PARCEL",
      entityId: "MH24-0891-4402",
      details: "Completed ground boundary pegging and tree/structure enumeration for Survey No. 104/2, Musalgaon.",
    },
    {
      actorEmail: "ramesh.patil@lams.test",
      actorRole: "LANDOWNER",
      action: "GRIEVANCE_FILED",
      entityType: "GRIEVANCE",
      entityId: "GRV-2026-1001",
      details: "Filed statutory objection under Section 15 regarding pomegranate horticulture valuation.",
    },
  ];

  for (const entry of auditEntries) {
    const timestamp = new Date();
    const payload = `${prevHash}|${timestamp.toISOString()}|${entry.actorEmail}|${entry.actorRole}|${entry.action}|${entry.entityType}|${entry.entityId}|${entry.details}`;
    const hash = sha256(payload);

    await prisma.auditLog.create({
      data: {
        timestamp,
        actorEmail: entry.actorEmail,
        actorRole: entry.actorRole,
        action: entry.action,
        entityType: entry.entityType,
        entityId: entry.entityId,
        details: entry.details,
        ipAddress: "10.24.112.5",
        prevHash,
        hash,
      },
    });

    prevHash = hash;
  }
  console.log("Seeded cryptographic SHA-256 hash-chained audit trail.");

  // 10. Seed Notifications
  const notifications = [
    {
      recipientEmail: "collector.nashik@lams.gov.in",
      recipientRole: "DISTRICT_COLLECTOR",
      title: "Statutory SLA Alert: Section 15 Hearing Window",
      titleHi: "वैधानिक एसएलए चेतावनी: धारा 15 सुनवाई अवधि",
      message: "18 objections in Sinnar Tehsil approaching 60-day hearing statutory completion deadline.",
      messageHi: "सिन्नर तहसील में 18 आपत्तियों की 60-दिवसीय वैधानिक सुनवाई अवधि पूर्ण होने वाली है।",
      type: "SLA_WARNING",
    },
    {
      recipientEmail: "nhai.projects@lams.gov.in",
      recipientRole: "REQUIRING_BODY",
      title: "Section 11 Notification Gazetted",
      titleHi: "धारा 11 अधिसूचना राजपत्र में प्रकाशित",
      message: "Preliminary notification for NH-2026-084 published in Government Gazette and uploaded to LAMS portal.",
      messageHi: "एनएच-2026-084 हेतु प्रारंभिक अधिसूचना सरकारी राजपत्र में प्रकाशित एवं लम्स पोर्टल पर अपलोड।",
      type: "STAGE_CHANGE",
    },
    {
      recipientEmail: "ramesh.patil@lams.test",
      recipientRole: "LANDOWNER",
      title: "Objection Hearing Scheduled",
      titleHi: "आपत्ति सुनवाई नियत",
      message: "Your objection GRV-2026-1001 hearing is scheduled on 14th Oct 2026 at CALA Office Sinnar.",
      messageHi: "आपकी आपत्ति GRV-2026-1001 की सुनवाई 14 अक्टूबर 2026 को सीएएलए कार्यालय सिन्नर में निर्धारित है।",
      type: "GRIEVANCE",
    },
  ];

  for (const notif of notifications) {
    await prisma.appNotification.create({ data: notif });
  }
  console.log("Seeded initial system notifications.");

  console.log("✅ LAMS synthetic database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
