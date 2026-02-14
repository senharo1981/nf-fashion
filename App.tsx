
import React, { useState, useEffect } from 'react';
import { SuitCategory, Measurements, Order, Rates } from './types';
import TailoringApp from './TailoringApp';
import { SpeedInsights } from '@vercel/speed-insights/react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TailoringApp />
      <SpeedInsights />
    </div>
  );
};

export default App;
