import { z } from "zod";

export const ProfileSchema = z.object({
  institutionName: z.string().min(2, "Institution name required"),
  currency: z.string().min(1),
  timezone: z.string().min(1),
  cadence: z.enum(["Monthly", "Quarterly"]),
});

export const SegmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string().optional(),
});

export const CollateralItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  haircut: z.number().min(0).max(100),
  ttr: z.number().min(0),
});

export const InviteEntrySchema = z.object({
  email: z.string().email(),
  role: z.enum(["Analyst", "Reviewer", "Administrator"]),
});

export const OnboardingSchema = z.object({
  profile: ProfileSchema,
  segments: z.array(SegmentSchema).min(1, "At least one segment is required"),
  collateral: z
    .array(CollateralItemSchema)
    .min(1, "At least one collateral type is required"),
  invites: z.array(InviteEntrySchema),
});

export type Profile = z.infer<typeof ProfileSchema>;
export type Segment = z.infer<typeof SegmentSchema>;
export type CollateralItem = z.infer<typeof CollateralItemSchema>;
export type InviteEntry = z.infer<typeof InviteEntrySchema>;
export type OnboardingData = z.infer<typeof OnboardingSchema>;

export const CURRENCIES = [
  { value: "KES", label: "KES — Kenyan Shilling" },
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "NGN", label: "NGN — Nigerian Naira" },
  { value: "UGX", label: "UGX — Ugandan Shilling" },
  { value: "TZS", label: "TZS — Tanzanian Shilling" },
];

export const TIMEZONES = [
  { value: "Africa/Nairobi", label: "Africa/Nairobi (EAT, UTC+3)" },
  { value: "Africa/Lagos", label: "Africa/Lagos (WAT, UTC+1)" },
  { value: "Europe/London", label: "Europe/London (GMT, UTC+0)" },
  { value: "Africa/Kampala", label: "Africa/Kampala (EAT, UTC+3)" },
];

export const COMMON_SEGMENTS = [
  "Transport",
  "Education",
  "Agriculture",
  "Trade",
  "Manufacturing",
  "Real Estate",
  "Personal",
  "SME",
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
