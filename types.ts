export enum SuitCategory {
  SIMPLE = 'Simple / Sada',
  MEDIUM = 'Medium / Darmiyani',
  FANCY = 'Fancy / Aala',
  HEAVY = 'Heavy Suit',
  BRIDAL = 'Bridal / Dulhan'
}

export interface Measurements {
  length: string;
  chest: string;
  waist: string;
  hip: string;
  shoulder: string;
  sleeveLength: string;
  neckFront: string;
  neckBack: string;
  damen: string;
  trouserLength: string;
  trouserBottom: string;
}

export interface DesignOption {
  name: string;
  price: number;
}

export interface Designs {
  neck: DesignOption;
  sleeves: DesignOption;
  daman: DesignOption;
  pancha: DesignOption;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  suitType: SuitCategory;
  measurements: Measurements;
  designs: Designs;
  deliveryDate: string;
  pickupRequired: boolean;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delivered';
  totalPrice: number;
  timestamp: number;
}

export interface Rates {
  [SuitCategory.SIMPLE]: number;
  [SuitCategory.MEDIUM]: number;
  [SuitCategory.FANCY]: number;
  [SuitCategory.HEAVY]: number;
  [SuitCategory.BRIDAL]: number;
}