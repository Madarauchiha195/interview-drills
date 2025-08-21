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
import { getAttempts, getAttemptStats } from '@/services/api';
import { Attempt, AttemptStats } from '@/services/api';

const History = () => {
  const { toast } = useToast();

  // Fetch attempts data
  const { data: attemptsData, isLoading: attemptsLoading, error: attemptsError } = useQuery({
    queryKey: ['attempts'],
    queryFn: async () => {
      try {
        return await getAttempts(50, 1);
      } catch (error) {
        console.error('Error fetching attempts:', error);
        throw error;
      }
    }
  });

  // Fetch attempt statistics
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['attemptStats'],
    queryFn: async () => {
      try {
        return await getAttemptStats();
      } catch (error) {
        console.error('Error fetching attempt stats:', error);
        throw error;
      }
    }
  });

  const attempts = attemptsData?.attempts || [];
  const isLoading = attemptsLoading || statsLoading;
  const error = attemptsError || statsError;

  // Prepare data for performance charts
  const performanceData = attempts.map((attempt: Attempt) => ({
    date: attempt.createdAt,
    score: attempt.score,
    timeSpent: attempt.timeSpent,
    difficulty: attempt.drillId.difficulty
  })).reverse();

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

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading History</h1>
            <p className="text-muted-foreground mb-6">
              Failed to load your practice history. Please try again later.
            </p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

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
              ) : stats && stats.drillStats && stats.drillStats.length > 0 ? (
                <DrillPerformanceChart drillStats={stats.drillStats} />
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
                  const percentage = attempt.score;
                  
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
                                {attempt.correctAnswers}/{attempt.totalQuestions}
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
