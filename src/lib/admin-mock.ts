import type { Member, AdminSegment, CollateralType, TenantProfile } from "./admin-types";

export const MOCK_MEMBERS: Member[] = [
  { id: "1", name: "Tendai Mwangi",  email: "t.mwangi@savannabank.co.ke",  initials: "TM", role: "Admin",    status: "active",  lastActive: "2 min ago",       isYou: true },
  { id: "2", name: "A. Karanja",     email: "a.karanja@savannabank.co.ke", initials: "AK", role: "Admin",    status: "active",  lastActive: "1 h ago" },
  { id: "3", name: "J. Otieno",      email: "j.otieno@savannabank.co.ke",  initials: "JO", role: "Analyst",  status: "active",  lastActive: "Yesterday" },
  { id: "4", name: "Grace Wanjiru",  email: "g.wanjiru@savannabank.co.ke", initials: "GW", role: "Reviewer", status: "active",  lastActive: "3 days ago" },
  { id: "5", name: "P. Kamau",       email: "p.kamau@savannabank.co.ke",   initials: "PK", role: "Analyst",  status: "invited", lastActive: "Invited 2 days ago" },
];

export const MOCK_SEGMENTS_ADMIN: AdminSegment[] = [
  { id: "s1", name: "Transport",     code: "TRN", runsCount: 8, disabled: false },
  { id: "s2", name: "Agriculture",   code: "AGR", runsCount: 8, disabled: false },
  { id: "s3", name: "Trade",         code: "TRD", runsCount: 8, disabled: false },
  { id: "s4", name: "Manufacturing", code: "MFG", runsCount: 6, disabled: false },
  { id: "s5", name: "Real Estate",   code: "RES", runsCount: 6, disabled: false },
  { id: "s6", name: "Education",     code: "EDU", runsCount: 8, disabled: false },
  { id: "s7", name: "SME",           code: "SME", runsCount: 4, disabled: false },
];

export const COMMON_SEGMENTS = [
  "Transport", "Education", "Agriculture", "Trade",
  "Manufacturing", "Real Estate", "Personal", "SME",
];

export const MOCK_COLLATERAL: CollateralType[] = [
  { id: "c1", name: "Cash deposit",         haircut: 0,  timeToRealize: 0  },
  { id: "c2", name: "Government securities", haircut: 5,  timeToRealize: 1  },
  { id: "c3", name: "Listed equities",       haircut: 25, timeToRealize: 1  },
  { id: "c4", name: "Residential property",  haircut: 30, timeToRealize: 12 },
  { id: "c5", name: "Commercial property",   haircut: 40, timeToRealize: 18 },
  { id: "c6", name: "Motor vehicle",         haircut: 50, timeToRealize: 6  },
  { id: "c7", name: "Plant & machinery",     haircut: 60, timeToRealize: 12 },
  { id: "c8", name: "Personal guarantee",    haircut: 80, timeToRealize: 24 },
];

export const COMMON_COLLATERAL: Array<[string, number, number]> = [
  ["Cash deposit", 0, 0],
  ["Government securities", 5, 1],
  ["Listed equities", 25, 1],
  ["Residential property", 30, 12],
  ["Commercial property", 40, 18],
  ["Motor vehicle", 50, 6],
  ["Plant & machinery", 60, 12],
  ["Personal guarantee", 80, 24],
];

export const MOCK_TENANT_PROFILE: TenantProfile = {
  name: "Savanna Bank PLC",
  reportingCadence: "Monthly",
  currency: "KES — Kenyan Shilling",
  timezone: "Africa/Nairobi (EAT, UTC+3)",
};
