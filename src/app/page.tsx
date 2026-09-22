'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ThreePanelLayout } from '@/components/layout/ThreePanelLayout';
import { useSimulatorStore } from '@/store/useSimulatorStore';

export default function Home() {
  const { validateCurrentFile } = useSimulatorStore();

  useEffect(() => {
    // Initial validation check on load
    validateCurrentFile();
  }, [validateCurrentFile]);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#09090b]">
      <Header />
      <ThreePanelLayout />
    </div>
  );
}
