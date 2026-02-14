
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
    alert("آرڈر وصول کر لیا گیا ہے! شکریہ۔");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('customer')}>
          <div className="bg-pink-600 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
            <i className="fas fa-cut"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-pink-700 brand-font tracking-tight">NF Fashion</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Tando Allahyar</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setView('customer')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${view === 'customer' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Booking
          </button>
          <button 
            onClick={() => setView('admin')}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${view === 'admin' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Tailor Admin
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4">
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

      <footer className="bg-slate-900 text-slate-500 py-10 px-4 mt-20">
        <div className="container mx-auto text-center">
          <h3 className="text-white font-bold brand-font text-2xl mb-4">NF Fashion Silaee Center</h3>
          <p className="max-w-md mx-auto text-sm mb-6">ٹنڈو الہیار کا بہترین خواتین کا سلائی سینٹر۔ ہم آپ کی خوبصورتی کا خیال رکھتے ہیں۔</p>
          <div className="flex justify-center gap-6 text-xl mb-8">
            <i className="fab fa-whatsapp hover:text-green-500 cursor-pointer transition-colors"></i>
            <i className="fab fa-instagram hover:text-pink-500 cursor-pointer transition-colors"></i>
            <i className="fas fa-map-marker-alt hover:text-red-500 cursor-pointer transition-colors"></i>
          </div>
          <div className="text-[10px] uppercase tracking-widest">&copy; {new Date().getFullYear()} NF Fashion. Designed with Heart.</div>
        </div>
      </footer>
    </div>
  );
};

export default TailoringApp;
