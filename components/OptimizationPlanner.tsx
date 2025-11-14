
import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import type { UserRole, OptimizationRecommendation } from '../types';
import { energyData } from '../data/mockData';
import { getOptimizationRecommendations } from '../services/geminiService';

interface OptimizationPlannerProps {
  userRole: UserRole;
}

const PriorityPill: React.FC<{ priority: 'High' | 'Medium' | 'Low' }> = ({ priority }) => {
    const colorClasses = {
        High: 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200',
        Medium: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        Low: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[priority]}`}>
            {priority}
        </span>
    );
};

export const OptimizationPlanner: React.FC<OptimizationPlannerProps> = ({ userRole }) => {
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    const fetchedRecs = await getOptimizationRecommendations(energyData);
    setRecommendations(fetchedRecs);
    setIsLoading(false);
  };
  
  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div className="space-y-6">
        <Card className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">AI Optimization Planner</h1>
                <p className="text-gray-500 dark:text-gray-400">Actionable insights to reduce energy consumption and costs.</p>
            </div>
            <Button onClick={fetchRecommendations} disabled={isLoading} icon="fa-solid fa-wand-magic-sparkles">
                {isLoading ? 'Generating...' : 'Regenerate'}
            </Button>
        </Card>
      
      {isLoading ? (
        <Card className="flex justify-center items-center h-96">
            <div className="text-center">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
                <p className="mt-4 text-lg">AI is analyzing campus data...</p>
            </div>
        </Card>
      ) : (
        <Card>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Priority</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Recommendation</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Area</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Est. Daily Savings (kWh)</th>
                            {userRole === 'Admin' && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Action</span></th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {recommendations.map((rec) => (
                        <tr key={rec.id}>
                            <td className="px-6 py-4 whitespace-nowrap"><PriorityPill priority={rec.priority} /></td>
                            <td className="px-6 py-4 whitespace-normal text-sm">{rec.recommendation}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{rec.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-bold">{rec.estimated_savings_kwh}</td>
                            {userRole === 'Admin' && (
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="secondary" onClick={() => alert(`Applying schedule for: ${rec.recommendation}`)}>Apply</Button>
                            </td>
                            )}
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
      )}
    </div>
  );
};
