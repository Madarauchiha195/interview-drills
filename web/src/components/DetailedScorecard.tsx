import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, CheckCircle, XCircle, Clock, Award, BarChart } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface DetailedScorecardProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalPoints: number;
  drillTitle: string;
  drillCategory: string;
  drillDifficulty: string;
  attemptId: string;
}

const DetailedScorecard = ({
  score,
  totalQuestions,
  timeSpent,
  correctAnswers,
  incorrectAnswers,
  totalPoints,
  drillTitle,
  drillCategory,
  drillDifficulty,
  attemptId
}: DetailedScorecardProps) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  const percentage = Math.round((score / totalPoints) * 100);
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (percentage >= 80) return { text: 'Great', variant: 'secondary' as const };
    if (percentage >= 70) return { text: 'Good', variant: 'secondary' as const };
    if (percentage >= 60) return { text: 'Fair', variant: 'outline' as const };
    return { text: 'Needs Improvement', variant: 'destructive' as const };
  };

  const scoreBadge = getScoreBadge(percentage);
  
  // Data for pie chart
  const pieData = [
    { name: 'Correct', value: correctAnswers, color: '#22c55e' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#ef4444' },
  ];
  
  // Data for bar chart
  const barData = [
    { name: 'Your Score', value: percentage },
    { name: 'Average', value: 75 }, // This would ideally come from API
  ];

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Drill Results</CardTitle>
            <CardDescription className="text-lg mt-1">{drillTitle}</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">{drillCategory}</Badge>
            <Badge 
              variant={drillDifficulty === 'easy' ? 'secondary' : 
                      drillDifficulty === 'medium' ? 'default' : 'destructive'} 
              className="text-xs"
            >
              {drillDifficulty.charAt(0).toUpperCase() + drillDifficulty.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="summary" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="space-y-4">
            {/* Main Score Display */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
                {score}/{totalPoints}
              </div>
              <div className="text-lg text-muted-foreground">
                {percentage}% Correct
              </div>
              <Badge variant={scoreBadge.variant} className="text-sm">
                {scoreBadge.text}
              </Badge>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2 mt-4">
              <Progress value={percentage} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center space-x-3 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Correct Answers</div>
                  <div className="font-semibold">{correctAnswers} of {totalQuestions}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Incorrect Answers</div>
                  <div className="font-semibold">{incorrectAnswers} of {totalQuestions}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Time Spent</div>
                  <div className="font-semibold">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <div className="text-sm text-muted-foreground">Attempt ID</div>
                  <div className="font-semibold text-xs truncate">{attemptId}</div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Accuracy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round((correctAnswers / totalQuestions) * 100)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {correctAnswers} correct out of {totalQuestions} questions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Time Per Question</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.round(timeSpent / totalQuestions)}s</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {timeSpent} seconds total / {totalQuestions} questions
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Points Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{score}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Out of {totalPoints} possible points
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Performance Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{scoreBadge.text}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on your score of {percentage}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Answer Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Score Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart data={barData}>
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetailedScorecard;