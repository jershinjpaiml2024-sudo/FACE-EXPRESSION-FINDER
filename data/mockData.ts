
import type { Building, Device, EnergyDataPoint, Alert } from '../types';

export const buildings: Building[] = [
  { id: 'b1', name: 'Engineering Block', type: 'Academic', area: 50000 },
  { id: 'b2', name: 'Quantum Physics Lab', type: 'Lab', area: 25000 },
  { id: 'b3', name: 'Pioneer Hall', type: 'Hostel', area: 75000 },
  { id: 'b4', name: 'Admin Complex', type: 'Admin', area: 30000 },
];

export const devices: Device[] = [
  { id: 'd1', name: 'Main AC Unit - Eng.', buildingId: 'b1', type: 'AC', status: 'on', power: 150, temp: 22 },
  { id: 'd2', name: 'Corridor Lights - Eng.', buildingId: 'b1', type: 'Lighting', status: 'on', power: 20 },
  { id: 'd3', name: 'Supercomputer', buildingId: 'b2', type: 'Lab Equipment', status: 'on', power: 300 },
  { id: 'd4', name: 'EV Charger Station 1', buildingId: 'b4', type: 'EV Charger', status: 'off', power: 50 },
  { id: 'd5', name: 'Hostel Wing A AC', buildingId: 'b3', type: 'AC', status: 'standby', power: 120, temp: 24 },
  { id: 'd6', name: 'Lab Spectrometer', buildingId: 'b2', type: 'Lab Equipment', status: 'on', power: 75 },
];

export const generateEnergyData = (days: number, buildings: Building[]): Record<string, EnergyDataPoint[]> => {
  const data: Record<string, EnergyDataPoint[]> = {};
  const now = new Date();

  buildings.forEach(building => {
    data[building.id] = [];
    for (let i = days * 24; i > 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      let baseUsage = 20;
      if (building.type === 'Lab') baseUsage = 80;
      if (building.type === 'Hostel') baseUsage = 40;
      
      let usage = baseUsage + Math.random() * 10;
      // Peak hours
      if (hour > 8 && hour < 17 && building.type !== 'Hostel') {
        usage *= (2.5 + Math.random());
      }
      // Night hours for hostel
      if ((hour > 18 || hour < 6) && building.type === 'Hostel') {
         usage *= (2 + Math.random());
      }
      data[building.id].push({
        time: time.toISOString(),
        usage: parseFloat(usage.toFixed(2)),
      });
    }
  });

  return data;
};

export const energyData = generateEnergyData(7, buildings);

export const alerts: Alert[] = [
  { id: 'a1', severity: 'high', message: 'Unusual energy spike detected in Quantum Physics Lab after midnight.', timestamp: new Date().toISOString() },
  { id: 'a2', severity: 'medium', message: 'Pioneer Hall consumption is 20% above prediction for this week.', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
];
