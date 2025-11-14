
export type View = 'dashboard' | 'optimization-planner' | 'device-control' | 'reports';

export type UserRole = 'Admin' | 'Energy Manager' | 'Faculty/Staff' | 'Student';

export interface Building {
  id: string;
  name: string;
  type: 'Academic' | 'Lab' | 'Hostel' | 'Admin';
  area: number; // in sqft
}

export interface Device {
  id: string;
  name: string;
  type: 'AC' | 'Lighting' | 'Lab Equipment' | 'EV Charger';
  buildingId: string;
  status: 'on' | 'off' | 'standby';
  power: number; // in kW
  temp?: number; // for AC
}

export interface EnergyDataPoint {
  time: string; // ISO format
  usage: number; // kWh
}

export interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}

export interface OptimizationRecommendation {
  id: string;
  recommendation: string;
  priority: 'High' | 'Medium' | 'Low';
  estimated_savings_kwh: number;
  area: string;
}
