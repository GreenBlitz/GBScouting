// CompareGraph.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface CompareGraphProps {
  seriesA: number[];
  seriesB: number[];
}

const CompareGraph: React.FC<CompareGraphProps> = ({ seriesA, seriesB }) => {
  // Merge into chart data
  const data = seriesA.map((value, index) => ({
    index,
    A: value,
    B: seriesB[index] ?? null, // Fallback if B is shorter
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="A" stroke="#8884d8" name="Series A" />
        <Line type="monotone" dataKey="B" stroke="#82ca9d" name="Series B" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CompareGraph;
