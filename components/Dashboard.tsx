
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/Card';
import { Alert as AlertComponent } from './ui/Alert';
import type { UserRole, Building } from '../types';
import { buildings, energyData, alerts } from '../data/mockData';
import { EnergyUsageChart } from './charts/EnergyUsageChart';
import { BuildingConsumptionChart } from './charts/BuildingConsumptionChart';
import { getEnergyUsageForecast } from '../services/geminiService';

interface DashboardProps {
  userRole: UserRole;
}

const MetricCard: React.FC<{ title: string; value: string; icon: string; change?: string; }> = ({ title, value, icon, change }) => (
  <Card>
    <div className="flex items-center">
      <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
        <i className={`${icon} text-xl text-blue-500`}></i>
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {change && <p className="text-sm text-green-500">{change}</p>}
      </div>
    </div>
  </Card>
);


export const Dashboard: React.FC<DashboardProps> = ({ userRole }) => {
  const [selectedBuilding, setSelectedBuilding] = useState<Building>(buildings[0]);
  const [forecast, setForecast] = useState<string>('Generating forecast...');
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
        setIsLoadingForecast(true);
        const data = energyData[selectedBuilding.id];
        if (data) {
            const result = await getEnergyUsageForecast(data);
            setForecast(result);
        }
        setIsLoadingForecast(false);
    };

    fetchForecast();
  }, [selectedBuilding]);

  const totalCampusUsage = useMemo(() => {
    return Object.values(energyData).flat().reduce((sum, d) => sum + d.usage, 0);
  }, []);

  const buildingComparisonData = useMemo(() => {
    return buildings.map(b => ({
      name: b.name,
      value: energyData[b.id]?.reduce((sum, d) => sum + d.usage, 0) || 0,
    })).sort((a, b) => b.value - a.value);
  }, []);

  const last24hData = useMemo(() => {
    return energyData[selectedBuilding.id]?.slice(-24) || [];
  }, [selectedBuilding]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Campus Usage (Weekly)" value={`${(totalCampusUsage / 1000).toFixed(1)} MWh`} icon="fa-solid fa-bolt" change="-5% vs last week" />
        <MetricCard title="Peak Power Today" value={`${Math.max(...last24hData.map(d => d.usage)).toFixed(1)} kWh`} icon="fa-solid fa-triangle-exclamation" />
        <MetricCard title="Est. Weekly Cost" value={`$${(totalCampusUsage * 0.12).toFixed(2)}`} icon="fa-solid fa-dollar-sign" />
        <MetricCard title="Carbon Footprint" value={`${(totalCampusUsage * 0.45).toFixed(1)} tCO2e`} icon="fa-solid fa-smog" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Energy Consumption</h2>
                    <select
                      value={selectedBuilding.id}
                      onChange={(e) => setSelectedBuilding(buildings.find(b => b.id === e.target.value)!)}
                      className="bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 focus:outline-none"
                    >
                      {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <EnergyUsageChart data={last24hData} title={`Last 24 Hours - ${selectedBuilding.name}`} />
            </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold mb-4">AI Forecast</h2>
             {isLoadingForecast ? (
                 <div className="flex items-center justify-center h-full">
                    <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-500"></i>
                 </div>
             ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{forecast}</p>
             )}
          </Card>
          <Card>
            <h2 className="text-xl font-bold mb-4">Alerts</h2>
            <div className="space-y-4">
              {alerts.map(alert => <AlertComponent key={alert.id} alert={alert} />)}
            </div>
          </Card>
        </div>
      </div>
       <Card>
           <BuildingConsumptionChart data={buildingComparisonData} title="Weekly Consumption by Building" />
       </Card>
    </div>
  );
};
