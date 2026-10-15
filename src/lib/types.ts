export type StockStatus = 'En Stock' | 'Stock Faible' | 'En Rupture';

export type MedicationStock = {
  status: StockStatus;
  price: number;
};

export type Pharmacy = {
  id: number;
  name: string;
  address: string;
  distance: string;
  city: string;
  loginId: string; // Unique identifier for login
  stock: {
    [medicationName: string]: MedicationStock;
  };
};

export type Medication = {
  name: string;
};
