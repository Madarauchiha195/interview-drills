
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, Legend } from 'recharts';

interface DrillStats {
  drillTitle: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
  difficulty: string;
}

interface DrillPerformanceChartProps {
  drillStats: DrillStats[];
}

const chartConfig = {
  averageScore: {
    label: "Average Score %",
  },
  attempts: {
    label: "Attempts",
  }
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658'];

const DrillPerformanceChart = ({ drillStats }: DrillPerformanceChartProps) => {
  // Prepare data for difficulty distribution
  const difficultyData = drillStats.reduce((acc, drill) => {
    const existing = acc.find(item => item.difficulty === drill.difficulty);
    if (existing) {
      existing.count += drill.attempts;
    } else {
      acc.push({ difficulty: drill.difficulty, count: drill.attempts });
    }
    return acc;
  }, [] as { difficulty: string; count: number }[]);

  // Prepare data for drill performance comparison
  const performanceData = drillStats.slice(0, 5).map(drill => ({
    name: drill.drillTitle.length > 15 ? drill.drillTitle.substring(0, 15) + '...' : drill.drillTitle,
    averageScore: drill.averageScore,
    bestScore: drill.bestScore,
    attempts: drill.attempts
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Drill Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Drill Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="averageScore" fill="hsl(var(--primary))" name="Average Score" />
              <Bar dataKey="bestScore" fill="hsl(var(--secondary))" name="Best Score" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Difficulty Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Practice by Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={difficultyData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ difficulty, count }) => `${difficulty}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {difficultyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DrillPerformanceChart;
