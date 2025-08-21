
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, BarChart, Bar, Area, AreaChart } from 'recharts';

interface PerformanceData {
  date: string;
  score: number;
  timeSpent: number;
  difficulty: string;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const chartConfig = {
  score: {
    label: "Score %",
  },
  timeSpent: {
    label: "Time (minutes)",
  }
};

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Prepare chart data with better formatting
  const chartData = data.slice(-10).map((item, index) => ({
    attempt: `#${index + 1}`,
    score: item.score,
    timeSpent: Math.round(item.timeSpent / 60),
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    difficulty: item.difficulty
  }));

  // Calculate trend data
  const trendData = data.slice(-7).map((item, index) => {
    const previousScores = data.slice(Math.max(0, data.length - 7 - index), data.length - index);
    const avgScore = previousScores.reduce((sum, prev) => sum + prev.score, 0) / previousScores.length;
    
    return {
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      currentScore: item.score,
      trendScore: Math.round(avgScore),
      timeSpent: Math.round(item.timeSpent / 60)
    };
  });

  return (
    <div className="space-y-6">
      {/* Score Progress Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Score Progress & Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px]">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="currentScore" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorScore)"
                name="Current Score"
              />
              <Line 
                type="monotone" 
                dataKey="trendScore" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--destructive))" }}
                name="Trend Line"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <LineChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Time per Attempt</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={chartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="timeSpent" 
                  fill="hsl(var(--secondary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceChart;
