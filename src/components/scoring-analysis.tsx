import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ScoringAnalysis = () => {
  const tasks = [
    {
      name: "Score Editor Form",
      R: 3,
      CV: 3, // C=1.0, V=3
      L: 2,
      F: 2,
      total: 10.0
    },
    {
      name: "Score Breakdown View",
      R: 3,
      CV: 2.1, // C=0.7, V=3
      L: 1,
      F: 1,
      total: 7.1
    },
    {
      name: "Score Update Handler",
      R: 3,
      CV: 2.1, // C=0.7, V=3
      L: 1,
      F: 0,
      total: 6.1
    }
  ];

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Scoring System Components</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={tasks}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
          >
            <XAxis type="number" domain={[0, 10]} />
            <YAxis type="category" dataKey="name" width={100} />
            <Tooltip />
            <Legend />
            <Bar dataKey="R" stackId="a" fill="#94a3b8" name="Resolution" />
            <Bar dataKey="CV" stackId="a" fill="#60a5fa" name="Confidence×Value" />
            <Bar dataKey="L" stackId="a" fill="#34d399" name="Learning" />
            <Bar dataKey="F" stackId="a" fill="#f472b6" name="Focus" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ScoringAnalysis;
