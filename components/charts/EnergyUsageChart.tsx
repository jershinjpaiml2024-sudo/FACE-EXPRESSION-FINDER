
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { EnergyDataPoint } from '../../types';

interface EnergyUsageChartProps {
  data: EnergyDataPoint[];
  title: string;
}

export const EnergyUsageChart: React.FC<EnergyUsageChartProps> = ({ data, title }) => {
  const formattedData = data.map(d => ({
    ...d,
    time: new Date(d.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));

  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="time" />
          <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
              borderColor: 'rgba(55, 65, 81, 1)', // border-gray-600
              color: '#fff',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="usage" stroke="#3b82f6" strokeWidth={2} dot={false} name="Energy Usage" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
