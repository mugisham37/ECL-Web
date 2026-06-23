import { z } from "zod";

// ── State machine ──────────────────────────────────────────────────────────

export const DashboardStateSchema = z.enum([
  "loading",
  "empty",
  "incomplete",
  "running",
  "failed",
  "healthy",
]);
export type DashboardState = z.infer<typeof DashboardStateSchema>;

// ── Tenant ─────────────────────────────────────────────────────────────────

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: z.string(),
  role: z.enum(["Administrator", "Reviewer", "Analyst"]),
  initials: z.string().optional(),
});
export type Tenant = z.infer<typeof TenantSchema>;

// ── User ───────────────────────────────────────────────────────────────────

export const AppShellUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  initials: z.string(),
  role: z.string(),
});
export type AppShellUser = z.infer<typeof AppShellUserSchema>;

// ── KPI cards ─────────────────────────────────────────────────────────────

export const KpiDataSchema = z.object({
  id: z.string(),
  label: z.string(),
  helpText: z.string().optional(),
  currencyPrefix: z.string().optional(),
  value: z.string(),
  delta: z.number().optional(),
  deltaDir: z.enum(["up", "down", "flat"]).optional(),
  subNote: z.string().optional(),
  staleAsOf: z.string().optional(),
});
export type KpiData = z.infer<typeof KpiDataSchema>;

// ── Charts ────────────────────────────────────────────────────────────────

export const SegmentBarSchema = z.object({
  name: z.string(),
  value: z.number(),
});
export type SegmentBar = z.infer<typeof SegmentBarSchema>;

export const StageSliceSchema = z.object({
  stage: z.enum(["Stage 1", "Stage 2", "Stage 3"]),
  percent: z.number(),
  colorVar: z.number().min(1).max(8),
});
export type StageSlice = z.infer<typeof StageSliceSchema>;

export const TrendWindowSchema = z.enum(["12M", "6M", "3M"]);
export type TrendWindow = z.infer<typeof TrendWindowSchema>;

export const TrendPointSchema = z.object({
  label: z.string(),
  value: z.number(),
});
export type TrendPoint = z.infer<typeof TrendPointSchema>;

// ── Runs table ────────────────────────────────────────────────────────────

export const RunStatusSchema = z.enum(["success", "failed", "running", "queued"]);
export type RunStatus = z.infer<typeof RunStatusSchema>;

export const RunSchema = z.object({
  id: z.string(),
  fullId: z.string(),
  period: z.string(),
  byInitials: z.string(),
  byName: z.string(),
  status: RunStatusSchema,
  eclAmount: z.number().nullable(),
  currency: z.string(),
});
export type Run = z.infer<typeof RunSchema>;

// ── Notifications ──────────────────────────────────────────────────────────

export const NotificationSchema = z.object({
  id: z.string(),
  kind: z.enum(["ok", "warn", "info"]),
  title: z.string(),
  description: z.string(),
  timeAgo: z.string(),
  read: z.boolean(),
});
export type Notification = z.infer<typeof NotificationSchema>;

// ── Banner ────────────────────────────────────────────────────────────────

export const BannerPropsSchema = z.object({
  variant: z.enum(["incomplete", "running", "failed"]),
  progress: z.number().min(0).max(100).optional(),
  failedAt: z.string().optional(),
  errorRef: z.string().optional(),
  setupStep: z.string().optional(),
});
export type BannerProps = z.infer<typeof BannerPropsSchema>;

// ── Full dashboard data ───────────────────────────────────────────────────

export const DashboardDataSchema = z.object({
  state: DashboardStateSchema,
  tenant: TenantSchema,
  allTenants: z.array(TenantSchema),
  user: AppShellUserSchema,
  kpis: z.array(KpiDataSchema),
  segments: z.array(SegmentBarSchema),
  stages: z.array(StageSliceSchema),
  trend: z.array(TrendPointSchema),
  runs: z.array(RunSchema),
  notifications: z.array(NotificationSchema),
  bannerProps: BannerPropsSchema.optional(),
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;
