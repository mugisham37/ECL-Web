"use client";

import { ScrollProgress } from "./ScrollProgress";
import { MarketingNav } from "./MarketingNav";
import { MarketingFooter } from "./MarketingFooter";
import { DemoProvider } from "./DemoContext";

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <ScrollProgress />
      <MarketingNav />
      <main>{children}</main>
      <MarketingFooter />
    </DemoProvider>
  );
}
