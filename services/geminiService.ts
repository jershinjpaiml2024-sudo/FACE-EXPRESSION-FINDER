
import { GoogleGenAI, Type } from "@google/genai";
import type { EnergyDataPoint, OptimizationRecommendation } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const model = 'gemini-2.5-flash';

export const getEnergyUsageForecast = async (data: EnergyDataPoint[]): Promise<string> => {
  if (!API_KEY) return "AI features disabled. API_KEY not provided.";
  try {
    const prompt = `
      Analyze the following hourly energy usage data (in kWh) for a campus building.
      Data: ${JSON.stringify(data.slice(-48))}
      
      Provide a concise forecast for the next 24 hours. Identify potential peak load times and any noticeable patterns (e.g., weekday vs. weekend).
      Keep the analysis professional and to the point.
    `;
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching energy forecast:", error);
    return "Could not generate forecast due to an API error.";
  }
};

export const getOptimizationRecommendations = async (
  buildingData: Record<string, EnergyDataPoint[]>
): Promise<OptimizationRecommendation[]> => {
    if (!API_KEY) return [];
  try {
    const prompt = `
      You are an expert energy optimization AI for a smart campus.
      Given the recent energy consumption data for several buildings, generate actionable recommendations to reduce waste.

      Data:
      ${Object.entries(buildingData).map(([name, data]) => 
        `${name}: Last 24h average usage: ${(data.slice(-24).reduce((sum, d) => sum + d.usage, 0) / 24).toFixed(2)} kWh`
      ).join('\n')}

      Generate a list of 5 diverse and impactful recommendations.
      For each recommendation, specify the target area (e.g., 'Engineering Block', 'Campus-wide'), a priority level (High, Medium, or Low), and an estimated daily saving in kWh.
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        area: { type: Type.STRING },
                        recommendation: { type: Type.STRING },
                        priority: { type: Type.STRING },
                        estimated_savings_kwh: { type: Type.NUMBER },
                    }
                }
            }
        }
    });

    const resultText = response.text.trim();
    const recommendations = JSON.parse(resultText);

    return recommendations.map((rec: any, index: number) => ({
      ...rec,
      id: `rec-${index}-${Date.now()}`,
    }));
  } catch (error) {
    console.error("Error fetching optimization recommendations:", error);
    // Return mock data on failure
    return [
      { id: 'mock1', area: 'Quantum Physics Lab', recommendation: 'Schedule high-power experiments during off-peak hours (after 10 PM).', priority: 'High', estimated_savings_kwh: 150 },
      { id: 'mock2', area: 'Campus-wide', recommendation: 'Dim corridor lights by 30% between 1 AM and 5 AM.', priority: 'Medium', estimated_savings_kwh: 80 },
    ];
  }
};

export const generateReportSummary = async (
  totalUsage: number, 
  savings: number, 
  buildingComparison: {name: string, value: number}[]
): Promise<string> => {
    if (!API_KEY) return "AI features disabled. API_KEY not provided.";
  try {
    const prompt = `
      Generate a professional summary for a weekly campus energy report.
      Key Metrics:
      - Total Weekly Consumption: ${totalUsage.toFixed(2)} kWh
      - Estimated Savings from Optimizations: ${savings.toFixed(2)} kWh
      - Top Consuming Building: ${buildingComparison[0].name} (${buildingComparison[0].value.toFixed(2)} kWh)
      
      Provide a brief overview of the energy performance, highlight the savings, and suggest one key area of focus for the upcoming week based on the data.
    `;
     const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    return response.text;
  } catch (error) {
    console.error("Error generating report summary:", error);
    return "Could not generate report summary due to an API error.";
  }
};
