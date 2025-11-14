
import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { Device } from '../types';
import { buildings } from '../data/mockData';

interface DeviceControlProps {
  devices: Device[];
}

const DeviceCard: React.FC<{ device: Device; onToggle: (id: string) => void; onTempChange: (id: string, temp: number) => void; }> = ({ device, onToggle, onTempChange }) => {
  const buildingName = buildings.find(b => b.id === device.buildingId)?.name || 'Unknown';
  const statusColor = device.status === 'on' ? 'text-green-500' : 'text-red-500';
  const icon = {
      AC: 'fa-solid fa-snowflake',
      Lighting: 'fa-solid fa-lightbulb',
      'Lab Equipment': 'fa-solid fa-flask-vial',
      'EV Charger': 'fa-solid fa-car-battery',
  }[device.type];

  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
                 <i className={`${icon} text-2xl text-blue-500`}></i>
                <div>
                    <h3 className="font-bold text-lg">{device.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{buildingName}</p>
                </div>
            </div>
            <div className={`font-bold text-sm capitalize ${statusColor}`}>
              <i className="fa-solid fa-circle text-xs mr-1"></i>
              {device.status}
            </div>
        </div>
        <div className="my-4 text-sm space-y-2">
            <p><strong>Type:</strong> {device.type}</p>
            <p><strong>Power Draw:</strong> {device.power} kW</p>
            {device.type === 'AC' && device.temp !== undefined && (
                <div className="flex items-center gap-2">
                    <strong>Temp:</strong> 
                    <input 
                        type="range" 
                        min="16" 
                        max="30" 
                        value={device.temp} 
                        onChange={(e) => onTempChange(device.id, parseInt(e.target.value, 10))}
                        className="w-full" 
                    />
                    <span className="font-bold">{device.temp}°C</span>
                </div>
            )}
        </div>
      </div>
      <Button
        onClick={() => onToggle(device.id)}
        variant={device.status === 'on' ? 'danger' : 'primary'}
      >
        {device.status === 'on' ? 'Turn Off' : 'Turn On'}
      </Button>
    </Card>
  );
};


export const DeviceControl: React.FC<DeviceControlProps> = ({ devices: initialDevices }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  
  const handleToggle = (id: string) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, status: d.status === 'on' ? 'off' : 'on' } : d));
  };
  
  const handleTempChange = (id: string, temp: number) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, temp } : d));
  };

  return (
    <div className="space-y-6">
        <Card>
            <h1 className="text-2xl font-bold">Device Control Panel</h1>
            <p className="text-gray-500 dark:text-gray-400">Simulated control for campus devices. (Admin only)</p>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {devices.map(device => (
                <DeviceCard key={device.id} device={device} onToggle={handleToggle} onTempChange={handleTempChange} />
            ))}
        </div>
    </div>
  );
};
