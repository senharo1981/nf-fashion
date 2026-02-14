import React, { useState, useEffect } from 'react';
import { SuitCategory, Order, Rates } from './types';
import AdminDashboard from './components/AdminDashboard';
import CustomerBooking from './components/CustomerBooking';

const INITIAL_RATES: Rates = {
  [SuitCategory.SIMPLE]: 800,
  [SuitCategory.MEDIUM]: 1500,
  [SuitCategory.FANCY]: 3000,
  [SuitCategory.HEAVY]: 5000,
  [SuitCategory.BRIDAL]: 15000,
};

const TailoringApp: React.FC = () => {
  const [view, setView] = useState<'customer' | 'admin'>('customer');
  const [rates, setRates] = useState<Rates>(() => {
    const saved = localStorage.getItem('silaee_rates');
    return saved ? JSON.parse(saved) : INITIAL_RATES;
  });
  const [blockedDates, setBlockedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('silaee_blocked_dates');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('silaee_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('silaee_rates', JSON.stringify(rates));
    localStorage.setItem('silaee_blocked_dates', JSON.stringify(blockedDates));
    localStorage.setItem('silaee_orders', JSON.stringify(orders));
  }, [rates, blockedDates, orders]);

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center border-b border-pink-100">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('customer')}>
          <div className="bg-pink-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">
            <i className="fas fa-cut"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-pink-700 brand-font">NF Fashion</h1>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Tando Allahyar</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setView('customer')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${view === 'customer' ? 'bg-pink-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Booking
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`px-4 py-2 rounded-xl text-sm font-bold ${view === 'admin' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Tailor Panel
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto pt-8">
        {view === 'customer' ? (
          <CustomerBooking rates={rates} blockedDates={blockedDates} onOrder={addOrder} />
        ) : (
          <AdminDashboard 
            rates={rates} 
            setRates={setRates} 
            blockedDates={blockedDates} 
            setBlockedDates={setBlockedDates}
            orders={orders}
            setOrders={setOrders}
          />
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-8 text-center mt-20">
        <p className="brand-font text-white mb-2">NF Fashion Silaee Center</p>
        <p className="text-xs">Developed for Tando Allahyar</p>
      </footer>
    </div>
  );
};

export default TailoringApp;
