import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import React from "react";
import { Task } from "../core/task-model";

interface ScoreBreakdownProps {
  tasks: Task[];
  activeTask?: Task | null;
}

const ScoreBreakdown = ({ tasks, activeTask }: ScoreBreakdownProps) => {
  // Transform tasks into chart data
  const chartData = tasks.map((task) => ({
    name: task.name,
    R: task.resolution,
    CV: +(task.confidence * task.value).toFixed(1),
    L: task.learning,
    F: task.focus,
    total: task.totalScore,
    isActive: task.id === activeTask?.id,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frontier Task Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" domain={[0, "dataMax + 1"]} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={({ x, y, payload }) => (
                  <text
                    x={x}
                    y={y}
                    dy={4}
                    textAnchor="end"
                    fill={chartData[payload.index].isActive ? "#000" : "#666"}
                    fontWeight={
                      chartData[payload.index].isActive ? "bold" : "normal"
                    }
                  >
                    {payload.value}
                  </text>
                )}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const label =
                    {
                      R: "Resolution",
                      CV: "Confidence×Value",
                      L: "Learning",
                      F: "Focus",
                    }[name] || name;
                  return [`${value} - ${label}`, ""];
                }}
              />
              <Bar dataKey="R" stackId="a" fill="#94a3b8" name="Resolution" />
              <Bar
                dataKey="CV"
                stackId="a"
                fill="#60a5fa"
                name="Confidence×Value"
              />
              <Bar dataKey="L" stackId="a" fill="#34d399" name="Learning" />
              <Bar dataKey="F" stackId="a" fill="#f472b6" name="Focus" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#94a3b8]"></div>
            Resolution (depth)
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#60a5fa]"></div>
            Confidence × Value
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#34d399]"></div>
            Learning Impact
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f472b6]"></div>
            Focus Bonus
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreBreakdown;
