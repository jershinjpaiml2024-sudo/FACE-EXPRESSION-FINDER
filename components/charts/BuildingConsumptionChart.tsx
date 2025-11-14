
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BuildingConsumptionChartProps {
  data: { name: string; value: number }[];
  title: string;
}

export const BuildingConsumptionChart: React.FC<BuildingConsumptionChartProps> = ({ data, title }) => {
  return (
    <div className="h-96">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
             contentStyle={{
              backgroundColor: 'rgba(31, 41, 55, 0.8)',
              borderColor: 'rgba(55, 65, 81, 1)',
              color: '#fff',
            }}
          />
          <Legend />
          <Bar dataKey="value" fill="#3b82f6" name="Total kWh" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
