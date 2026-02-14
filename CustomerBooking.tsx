import React, { useState, useMemo } from 'react';
import { SuitCategory, Measurements, Order, Rates, Designs, DesignOption } from '../types';
import { getTailoringAdvice } from '../geminiService';

interface Props {
  rates: Rates;
  blockedDates: string[];
  onOrder: (order: Order) => void;
}

const MEASUREMENT_LABELS_URDU: Record<keyof Measurements, string> = {
  length: 'لمبائی (Length)',
  chest: 'چھاتی (Chest)',
  waist: 'کمر (Waist)',
  hip: 'ہپ (Hip)',
  shoulder: 'کندھا (Shoulder)',
  sleeveLength: 'بازو (Sleeves)',
  neckFront: 'سامنے گلہ (Front Neck)',
  neckBack: 'پیچھے گلہ (Back Neck)',
  damen: 'دامن (Daman)',
  trouserLength: 'شلوار لمبائی (Trouser L)',
  trouserBottom: 'پائنچہ (Trouser Bottom)'
};

const DESIGN_LIBRARY: Record<keyof Designs, DesignOption[]> = {
  neck: [
    { name: 'سادہ گول گلہ', price: 0 },
    { name: 'وی شیپ گلہ', price: 0 },
    { name: 'بین کالر', price: 200 },
    { name: 'انگھراکھا اسٹائل', price: 450 },
    { name: 'لیس والا گلہ', price: 150 },
    { name: 'پائپنگ ڈیزائن', price: 100 }
  ],
  sleeves: [
    { name: 'سادہ بازو', price: 0 },
    { name: 'بیل باٹم بازو', price: 150 },
    { name: 'پف اسٹائل بازو', price: 300 },
    { name: 'کف والے بازو', price: 250 }
  ],
  daman: [
    { name: 'سادہ دامن', price: 0 },
    { name: 'گول دامن', price: 100 },
    { name: 'کٹ ورک دامن', price: 500 },
    { name: 'آرگنزا پیچ', price: 300 }
  ],
  pancha: [
    { name: 'سادہ پائنچہ', price: 0 },
    { name: 'ٹیولپ شلوار', price: 350 },
    { name: 'کٹ ورک پائنچہ', price: 400 },
    { name: 'بیل باٹم ٹراؤزر', price: 200 }
  ]
};

const SIZE_OPTIONS = (() => {
  const opts = [];
  for (let i = 5; i <= 70; i += 0.5) {
    opts.push(i.toFixed(1));
  }
  return opts;
})();

const CustomerBooking: React.FC<Props> = ({ rates, blockedDates, onOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState<SuitCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pickup, setPickup] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [fabricDesc, setFabricDesc] = useState('');
  const [advice, setAdvice] = useState('');
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  const [returningCustomerData, setReturningCustomerData] = useState<any>(null);
  const [showReturningPrompt, setShowReturningPrompt] = useState(false);

  const [selectedDesigns, setSelectedDesigns] = useState<Designs>({
    neck: DESIGN_LIBRARY.neck[0],
    sleeves: DESIGN_LIBRARY.sleeves[0],
    daman: DESIGN_LIBRARY.daman[0],
    pancha: DESIGN_LIBRARY.pancha[0]
  });

  const [measurements, setMeasurements] = useState<Measurements>({
    length: '', chest: '', waist: '', hip: '', shoulder: '',
    sleeveLength: '', neckFront: '', neckBack: '', damen: '',
    trouserLength: '', trouserBottom: ''
  });

  const handlePhoneBlur = () => {
    if (customerPhone.length >= 10) {
      const saved = localStorage.getItem('silaee_customer_profiles');
      const profiles = saved ? JSON.parse(saved) : {};
      if (profiles[customerPhone]) {
        setReturningCustomerData(profiles[customerPhone]);
        setShowReturningPrompt(true);
      }
    }
  };

  const useExistingSize = () => {
    if (returningCustomerData) {
      setCustomerName(returningCustomerData.name);
      setCustomerAddress(returningCustomerData.address);
      setMeasurements(returningCustomerData.measurements);
    }
    setShowReturningPrompt(false);
  };

  const currentTotalPrice = useMemo(() => {
    if (!selectedCategory) return 0;
    const basePrice = rates[selectedCategory];
    const designPrice = selectedDesigns.neck.price + 
                        selectedDesigns.sleeves.price + 
                        selectedDesigns.daman.price + 
                        selectedDesigns.pancha.price;
    const pickupPrice = pickup ? 200 : 0;
    return basePrice + designPrice + pickupPrice;
  }, [selectedCategory, rates, selectedDesigns, pickup]);

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerPhone || !customerAddress || !deliveryDate) {
      alert("براہ کرم تمام معلومات فراہم کریں۔");
      return;
    }

    const isSizeMissing = Object.values(measurements).some(val => val === '');
    if (isSizeMissing) {
      alert("براہ کرم تمام سائز (Measurements) منتخب کریں۔");
      return;
    }

    if (blockedDates.includes(deliveryDate)) {
      alert("معذرت! اس تاریخ کو ہم پہلے ہی مصروف ہیں۔");
      return;
    }

    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      customerName, customerPhone, customerAddress,
      suitType: selectedCategory!,
      measurements, designs: selectedDesigns,
      deliveryDate, pickupRequired: pickup,
      status: 'Pending', totalPrice: currentTotalPrice, timestamp: Date.now()
    };

    const saved = localStorage.getItem('silaee_customer_profiles');
    const profiles = saved ? JSON.parse(saved) : {};
    profiles[customerPhone] = { name: customerName, address: customerAddress, measurements };
    localStorage.setItem('silaee_customer_profiles', JSON.stringify(profiles));

    onOrder(order);
    
    let waMessage = `🌟 *NF Fashion New Order* 🌟\nNaam: ${order.customerName}\nPhone: ${order.customerPhone}\nAddress: ${order.customerAddress}\nSuit: ${order.suitType}\nTotal: Rs. ${order.totalPrice}\n\n*Sizes:*\n`;
    Object.entries(order.measurements).forEach(([k, v]) => {
      waMessage += `${MEASUREMENT_LABELS_URDU[k as keyof Measurements].split(' (')[0]}: ${v}"\n`;
    });
    
    window.open(`https://wa.me/923471115131?text=${encodeURIComponent(waMessage)}`, '_blank');
    setIsModalOpen(false);
    alert("آرڈر وصول کر لیا گیا ہے!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Object.values(SuitCategory).map((cat) => (
          <div 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all ${selectedCategory === cat ? 'border-pink-500 bg-pink-50 shadow-lg' : 'border-slate-100 bg-white hover:border-pink-200'}`}
          >
            <h3 className="font-bold text-lg text-slate-800">{cat}</h3>
            <div className="text-2xl font-bold text-pink-600 mt-2">Rs. {rates[cat]}</div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="bg-white p-8 rounded-[2rem] shadow-xl space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(DESIGN_LIBRARY) as Array<keyof Designs>).map((type) => (
              <div key={type}>
                <label className="block text-sm font-bold text-slate-600 mb-2 text-right">{type === 'neck' ? 'گلہ' : type === 'sleeves' ? 'بازو' : type === 'daman' ? 'دامن' : 'پائنچہ'}</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 text-right outline-none focus:ring-2 focus:ring-pink-500"
                  onChange={(e) => setSelectedDesigns({...selectedDesigns, [type]: DESIGN_LIBRARY[type].find(o => o.name === e.target.value)!})}
                >
                  {DESIGN_LIBRARY[type].map(opt => <option key={opt.name} value={opt.name}>{opt.name} {opt.price > 0 ? `(+Rs. ${opt.price})` : ''}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-8 border-t">
            <div className="text-3xl font-bold text-pink-600">Rs. {currentTotalPrice}</div>
            <button onClick={() => setIsModalOpen(true)} className="bg-pink-600 text-white px-10 py-4 rounded-full font-bold shadow-lg">آرڈر مکمل کریں</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-pink-600 text-white flex justify-between">
              <h3 className="text-xl font-bold brand-font">ناپ اور رابطہ</h3>
              <button onClick={() => setIsModalOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
              {showReturningPrompt && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl text-right">
                  <p className="mb-3 font-bold">پرانا سائز استعمال کریں؟</p>
                  <button type="button" onClick={useExistingSize} className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2">جی ہاں</button>
                  <button type="button" onClick={() => setShowReturningPrompt(false)} className="border border-blue-600 px-4 py-2 rounded-lg">نہیں</button>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required value={customerPhone} onBlur={handlePhoneBlur} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="فون نمبر" className="p-4 border rounded-xl text-right outline-none" />
                <input required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="نام" className="p-4 border rounded-xl text-right outline-none" />
              </div>
              <textarea required value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} placeholder="پتہ" className="w-full p-4 border rounded-xl text-right h-24 outline-none" />
              <input type="date" required value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-4 border rounded-xl outline-none" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.keys(measurements).map((key) => (
                  <div key={key}>
                    <label className="block text-[10px] text-slate-400 mb-1">{MEASUREMENT_LABELS_URDU[key as keyof Measurements]}</label>
                    <select name={key} required value={(measurements as any)[key]} onChange={handleMeasurementChange} className="w-full p-2 border rounded-lg text-center font-bold">
                      <option value="">Select</option>
                      {SIZE_OPTIONS.map(v => <option key={v} value={v}>{v}"</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-full font-bold text-xl">واٹس ایپ پر آرڈر بھیجیں</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBooking;
