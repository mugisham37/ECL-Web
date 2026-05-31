"use client";

import { createContext, useContext, useState } from "react";
import { DemoModal } from "./DemoModal";

interface DemoContextValue {
  openDemo: () => void;
}

const DemoContext = createContext<DemoContextValue>({ openDemo: () => {} });

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DemoContext.Provider value={{ openDemo: () => setIsOpen(true) }}>
      {children}
      <DemoModal open={isOpen} onOpenChange={setIsOpen} />
    </DemoContext.Provider>
  );
}

export function useDemo() {
  return useContext(DemoContext);
}
