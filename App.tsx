
import React, { useState, useEffect } from 'react';
import { SuitCategory, Measurements, Order, Rates } from './types';
import TailoringApp from './TailoringApp';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <TailoringApp />
    </div>
  );
};

export default App;
