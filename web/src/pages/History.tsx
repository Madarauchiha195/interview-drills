import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import PerformanceChart from '@/components/PerformanceChart';
import StatisticsCards from '@/components/StatisticsCards';
import DrillPerformanceChart from '@/components/DrillPerformanceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Clock, Target, Calendar, ArrowRight, RotateCcw, TrendingUp, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface Attempt {
  _id: string;
  drillId: {
    _id: string;
    title: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  score: number;
  totalQuestions: number;
  timeSpent: number;
  createdAt: string;
}

const History = () => {
  const { toast } = useToast();

  const { data: attempts, isLoading, error } = useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      // Enhanced demo data with more comprehensive statistics
      const demoAttempts: Attempt[] = [
        {
          _id: '1',
          drillId: { _id: 'drill1', title: 'JavaScript Fundamentals', difficulty: 'easy' },
          score: 8,
          totalQuestions: 10,
          timeSpent: 300,
          createdAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          _id: '2',
          drillId: { _id: 'drill2', title: 'React Hooks Deep Dive', difficulty: 'medium' },
          score: 7,
          totalQuestions: 10,
          timeSpent: 450,
          createdAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          _id: '3',
          drillId: { _id: 'drill3', title: 'Advanced TypeScript', difficulty: 'hard' },
          score: 6,
          totalQuestions: 10,
          timeSpent: 600,
          createdAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          _id: '4',
          drillId: { _id: 'drill4', title: 'CSS Grid & Flexbox', difficulty: 'medium' },
          score: 9,
          totalQuestions: 10,
          timeSpent: 320,
          createdAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          _id: '5',
          drillId: { _id: 'drill5', title: 'Node.js Basics', difficulty: 'easy' },
          score: 10,
          totalQuestions: 10,
          timeSpent: 280,
          createdAt: new Date(Date.now() - 432000000).toISOString()
        },
        {
          _id: '6',
          drillId: { _id: 'drill6', title: 'Python Data Structures', difficulty: 'medium' },
          score: 8,
          totalQuestions: 10,
          timeSpent: 380,
          createdAt: new Date(Date.now() - 518400000).toISOString()
        },
        {
          _id: '7',
          drillId: { _id: 'drill1', title: 'JavaScript Fundamentals', difficulty: 'easy' },
          score: 9,
          totalQuestions: 10,
          timeSpent: 250,
          createdAt: new Date(Date.now() - 604800000).toISOString()
        },
        {
          _id: '8',
          drillId: { _id: 'drill7', title: 'Database Design', difficulty: 'hard' },
          score: 5,
          totalQuestions: 10,
          timeSpent: 720,
          createdAt: new Date(Date.now() - 691200000).toISOString()
        }
      ];
      
      // Check for real API attempts first
      try {
        const response = await fetch('/api/attempts?limit=20', {
          credentials: 'include'
        });
        if (response.ok) {
          return response.json();
        }
      } catch (err) {
        console.log('API not available, using demo data');
      }
      
      return demoAttempts;
    }
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Note",
        description: "Using demo data for history display.",
        variant: "default",
      });
    }
  }, [error, toast]);

  // Calculate comprehensive statistics
  const calculateStats = (attempts: Attempt[]) => {
    if (!attempts || attempts.length === 0) return null;

    const totalAttempts = attempts.length;
    const totalTimeSpent = attempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
    const scores = attempts.map(attempt => (attempt.score / attempt.totalQuestions) * 100);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const bestScore = Math.max(...scores);
    const firstScore = scores[scores.length - 1] || 0;
    const lastScore = scores[0] || 0;
    const improvementRate = Math.round(((lastScore - firstScore) / firstScore) * 100) || 0;
    const completionRate = Math.round((attempts.filter(a => a.score > 0).length / totalAttempts) * 100);

    return {
      totalAttempts,
      averageScore,
      totalTimeSpent,
      bestScore,
      improvementRate,
      completionRate
    };
  };

  // Calculate drill-wise statistics
  const calculateDrillStats = (attempts: Attempt[]) => {
    const drillMap = new Map();
    
    attempts.forEach(attempt => {
      const drillId = attempt.drillId._id;
      const score = (attempt.score / attempt.totalQuestions) * 100;
      
      if (!drillMap.has(drillId)) {
        drillMap.set(drillId, {
          drillTitle: attempt.drillId.title,
          difficulty: attempt.drillId.difficulty,
          attempts: 0,
          totalScore: 0,
          bestScore: 0,
          scores: []
        });
      }
      
      const drill = drillMap.get(drillId);
      drill.attempts += 1;
      drill.totalScore += score;
      drill.bestScore = Math.max(drill.bestScore, score);
      drill.scores.push(score);
    });
    
    return Array.from(drillMap.values()).map(drill => ({
      drillTitle: drill.drillTitle,
      difficulty: drill.difficulty,
      attempts: drill.attempts,
      averageScore: Math.round(drill.totalScore / drill.attempts),
      bestScore: Math.round(drill.bestScore)
    }));
  };

  const stats = attempts ? calculateStats(attempts) : null;
  const drillStats = attempts ? calculateDrillStats(attempts) : [];

  // Prepare data for performance charts
  const performanceData = attempts ? attempts.map((attempt: Attempt) => ({
    date: attempt.createdAt,
    score: Math.round((attempt.score / attempt.totalQuestions) * 100),
    timeSpent: attempt.timeSpent,
    difficulty: attempt.drillId.difficulty
  })).reverse() : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-2">Practice Analytics</h1>
          <p className="text-muted-foreground text-lg">
            Comprehensive insights into your learning progress
          </p>
        </div>

        {/* Content Tabs */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="drills" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Drill Analysis
              </TabsTrigger>
              <TabsTrigger value="attempts" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                All Attempts
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <Skeleton className="h-16 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : stats ? (
                <StatisticsCards data={stats} />
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <TrendingUp className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No data yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Complete some drills to see your analytics.
                        </p>
                        <Button asChild>
                          <Link to="/dashboard">
                            Start Practicing
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ) : attempts && attempts.length > 0 ? (
                <PerformanceChart data={performanceData} />
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No performance data</h3>
                        <p className="text-muted-foreground">
                          Complete more drills to see detailed performance charts.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Drill Analysis Tab */}
            <TabsContent value="drills" className="space-y-6">
              {isLoading ? (
                <Card>
                  <CardContent className="p-6">
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
              ) : drillStats.length > 0 ? (
                <DrillPerformanceChart drillStats={drillStats} />
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <Target className="h-16 w-16 text-muted-foreground mx-auto" />
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No drill data</h3>
                        <p className="text-muted-foreground">
                          Practice different drills to see detailed analysis.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* All Attempts Tab */}
            <TabsContent value="attempts" className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-5 w-64" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : attempts && attempts.length > 0 ? (
                attempts.map((attempt: Attempt, index: number) => {
                  const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
                  
                  return (
                    <Card 
                      key={attempt._id} 
                      className="hover:shadow-md transition-all duration-200 animate-fade-in-up"
                      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold">
                                {attempt.drillId.title}
                              </h3>
                              <Badge 
                                variant="outline" 
                                className={`${getDifficultyColor(attempt.drillId.difficulty)} text-xs`}
                              >
                                {attempt.drillId.difficulty}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(attempt.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(attempt.timeSpent)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                <span>{attempt.totalQuestions} questions</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right space-y-3">
                            <div>
                              <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                                {attempt.score}/{attempt.totalQuestions}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {percentage}%
                              </div>
                            </div>
                            
                            <Button variant="outline" size="sm" asChild>
                              <Link to={`/drill/${attempt.drillId._id}`}>
                                <RotateCcw className="mr-2 h-3 w-3" />
                                Retry
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">No attempts yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start practicing with some drills to see your history here.
                        </p>
                        <Button asChild>
                          <Link to="/dashboard">
                            Browse Drills
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default History;
