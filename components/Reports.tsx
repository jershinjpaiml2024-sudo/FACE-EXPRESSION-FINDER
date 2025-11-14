
import React, { useState, useMemo, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { energyData, buildings } from '../data/mockData';
import { BuildingConsumptionChart } from './charts/BuildingConsumptionChart';
import { generateReportSummary } from '../services/geminiService';

export const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');
  const [summary, setSummary] = useState<string>('Generating summary...');
  const [isLoading, setIsLoading] = useState(true);

  const reportData = useMemo(() => {
    const days = reportType === 'weekly' ? 7 : 30;
    const slicedData = Object.keys(energyData).reduce((acc, key) => {
        acc[key] = energyData[key].slice(-24 * days);
        return acc;
    }, {} as typeof energyData);

    const totalUsage = Object.values(slicedData).flat().reduce((sum, d) => sum + d.usage, 0);
    const buildingComparison = buildings.map(b => ({
      name: b.name,
      value: slicedData[b.id]?.reduce((sum, d) => sum + d.usage, 0) || 0,
    })).sort((a, b) => b.value - a.value);

    return { totalUsage, buildingComparison, estimatedSavings: totalUsage * 0.05 }; // Mock 5% savings
  }, [reportType]);

  useEffect(() => {
    const fetchSummary = async () => {
        setIsLoading(true);
        const result = await generateReportSummary(reportData.totalUsage, reportData.estimatedSavings, reportData.buildingComparison);
        setSummary(result);
        setIsLoading(false);
    };

    fetchSummary();
  }, [reportData]);

  const handleExport = () => {
    alert("PDF export functionality would be implemented here.");
  };

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
              <h1 className="text-2xl font-bold">Energy Reports</h1>
              <p className="text-gray-500 dark:text-gray-400">Review performance and download summaries.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <button onClick={() => setReportType('weekly')} className={`px-3 py-1 text-sm font-semibold rounded-md ${reportType === 'weekly' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Weekly</button>
                <button onClick={() => setReportType('monthly')} className={`px-3 py-1 text-sm font-semibold rounded-md ${reportType === 'monthly' ? 'bg-white dark:bg-gray-900 shadow' : ''}`}>Monthly</button>
            </div>
            <Button onClick={handleExport} icon="fa-solid fa-file-pdf">Export PDF</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <h3 className="font-bold text-lg mb-2">Key Metrics</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Usage:</span> <span className="font-bold">{(reportData.totalUsage / 1000).toFixed(2)} MWh</span></div>
                    <div className="flex justify-between"><span>Est. Savings:</span> <span className="font-bold text-green-500">{reportData.estimatedSavings.toFixed(2)} kWh</span></div>
                    <div className="flex justify-between"><span>Peak Building:</span> <span className="font-bold">{reportData.buildingComparison[0]?.name}</span></div>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold text-lg mb-2">AI Generated Summary</h3>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-full"><i className="fa-solid fa-spinner fa-spin text-2xl text-blue-500"></i></div>
                 ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{summary}</p>
                 )}
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <BuildingConsumptionChart data={reportData.buildingComparison} title={`Consumption by Building (${reportType})`} />
            </Card>
        </div>

      </div>

    </div>
  );
};
