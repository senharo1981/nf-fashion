import React from 'react';
import { SuitCategory, Order, Rates } from '../types';

interface Props {
  rates: Rates;
  setRates: React.Dispatch<React.SetStateAction<Rates>>;
  blockedDates: string[];
  setBlockedDates: React.Dispatch<React.SetStateAction<string[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const AdminDashboard: React.FC<Props> = ({ rates, setRates, orders, setOrders }) => {
  const updateRate = (cat: SuitCategory, val: string) => {
    setRates({ ...rates, [cat]: parseInt(val) || 0 });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Rates Setup</h3>
          {Object.keys(rates).map((cat) => (
            <div key={cat} className="flex justify-between items-center mb-4 p-3 border-b">
              <span className="text-sm font-medium">{cat}</span>
              <input type="number" value={(rates as any)[cat]} onChange={(e) => updateRate(cat as SuitCategory, e.target.value)} className="w-24 p-2 border rounded-lg text-right" />
            </div>
          ))}
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Recent Orders ({orders.length})</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {orders.map(o => (
              <div key={o.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold">{o.customerName}</p>
                  <p className="text-xs text-slate-400">{o.suitType} • {o.deliveryDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-pink-600">Rs. {o.totalPrice}</p>
                  <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded">{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
