import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface AttemptData {
  _id: string;
  drillId: string;
  drillTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  createdAt: string;
  category: string;
  difficulty: string;
}

interface ProgressVisualizationProps {
  attempts: AttemptData[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProgressVisualization = ({ attempts }: ProgressVisualizationProps) => {
  if (!attempts || attempts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No attempt data available yet. Complete some drills to see your progress.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort attempts by date
  const sortedAttempts = [...attempts].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Prepare data for charts
  const progressData = sortedAttempts.map((attempt, index) => ({
    id: index + 1,
    date: new Date(attempt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: attempt.score,
    correctAnswers: attempt.correctAnswers,
    totalQuestions: attempt.totalQuestions,
    timeSpent: Math.round(attempt.timeSpent / 60), // Convert to minutes
    category: attempt.category,
    difficulty: attempt.difficulty,
    drillTitle: attempt.drillTitle?.length > 20 ? 
      `${attempt.drillTitle.substring(0, 20)}...` : 
      attempt.drillTitle
  }));

  // Calculate category distribution
  const categoryData = attempts.reduce((acc: {name: string, value: number}[], attempt) => {
    const existingCategory = acc.find(item => item.name === attempt.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: attempt.category, value: 1 });
    }
    return acc;
  }, []);

  // Calculate difficulty distribution
  const difficultyData = attempts.reduce((acc: {name: string, value: number}[], attempt) => {
    const existingDifficulty = acc.find(item => item.name === attempt.difficulty);
    if (existingDifficulty) {
      existingDifficulty.value += 1;
    } else {
      acc.push({ name: attempt.difficulty, value: 1 });
    }
    return acc;
  }, []);

  // Calculate average scores by category
  const categoryScores = attempts.reduce((acc: Record<string, {total: number, count: number}>, attempt) => {
    if (!acc[attempt.category]) {
      acc[attempt.category] = { total: 0, count: 0 };
    }
    acc[attempt.category].total += attempt.score;
    acc[attempt.category].count += 1;
    return acc;
  }, {});

  const categoryScoreData = Object.entries(categoryScores).map(([category, data]) => ({
    name: category,
    score: Math.round(data.total / data.count)
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress Visualization</CardTitle>
        <CardDescription>
          Track your performance over time across {attempts.length} attempts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="progress">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="time">Time Analysis</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      `${value}${name === 'score' ? '%' : ''}`, 
                      name === 'score' ? 'Score' : name
                    ]}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    name="Score %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Latest Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {progressData[progressData.length - 1]?.score}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sortedAttempts[sortedAttempts.length - 1]?.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across {attempts.length} attempts
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Best Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.max(...attempts.map(a => a.score))}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your highest achievement
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryScoreData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Avg. Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {categoryData.map((category, index) => (
                <Badge 
                  key={category.name} 
                  variant="outline" 
                  style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}
                >
                  {category.name}: {category.value} attempts
                </Badge>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="timeSpent" 
                    stroke="#8884d8" 
                    name="Time (minutes)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#82ca9d" 
                    name="Score %" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Average Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / attempts.length / 60)} min
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Per attempt
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fastest Attempt</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(Math.min(...attempts.map(a => a.timeSpent)) / 60)} min
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your quickest completion
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Practice Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0) / 60)} min
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all attempts
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.name === 'easy' ? '#4ade80' : 
                                entry.name === 'medium' ? '#facc15' : 
                                '#f87171'} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-center text-sm font-medium mt-2">Attempts by Difficulty</p>
              </div>
              
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData.slice(-5)}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="drillTitle" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="hsl(var(--primary))" name="Score %" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-center text-sm font-medium mt-2">Recent Drill Scores</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              {difficultyData.map((difficulty) => (
                <Badge 
                  key={difficulty.name} 
                  variant={difficulty.name === 'easy' ? 'secondary' : 
                          difficulty.name === 'medium' ? 'default' : 'destructive'}
                >
                  {difficulty.name.charAt(0).toUpperCase() + difficulty.name.slice(1)}: {difficulty.value} attempts
                </Badge>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressVisualization;