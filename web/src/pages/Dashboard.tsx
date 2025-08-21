import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import DrillCard from '@/components/DrillCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { Search, Filter, BookOpen, Target, Clock, TrendingUp } from 'lucide-react';
import { drillsData } from '@/data/drillsData';

interface Drill {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  estimatedTime?: number;
  questionsCount?: number;
}

interface Stats {
  totalAttempts: number;
  averageScore: number;
  completedDrills: number;
  totalTimeSpent: number;
}

// Demo data for frontend functionality
const demoDrills: Drill[] = [
  {
    _id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
    difficulty: 'easy',
    tags: ['JavaScript', 'Programming', 'Fundamentals'],
    estimatedTime: 15,
    questionsCount: 5
  },
  {
    _id: '2',
    title: 'React Components',
    description: 'Practice building and understanding React components, props, and state management.',
    difficulty: 'medium',
    tags: ['React', 'Components', 'Frontend'],
    estimatedTime: 25,
    questionsCount: 5
  },
  {
    _id: '3',
    title: 'Advanced Algorithms',
    description: 'Challenge yourself with complex algorithmic problems and data structures.',
    difficulty: 'hard',
    tags: ['Algorithms', 'Data Structures', 'Problem Solving'],
    estimatedTime: 45,
    questionsCount: 5
  },
  {
    _id: '4',
    title: 'CSS Grid & Flexbox',
    description: 'Master modern CSS layout techniques with Grid and Flexbox.',
    difficulty: 'medium',
    tags: ['CSS', 'Layout', 'Frontend'],
    estimatedTime: 20,
    questionsCount: 5
  },
  {
    _id: '5',
    title: 'Node.js Basics',
    description: 'Learn the fundamentals of server-side JavaScript with Node.js.',
    difficulty: 'easy',
    tags: ['Node.js', 'Backend', 'JavaScript'],
    estimatedTime: 18,
    questionsCount: 5
  },
  {
    _id: '6',
    title: 'Database Design',
    description: 'Practice designing efficient database schemas and relationships.',
    difficulty: 'hard',
    tags: ['Database', 'SQL', 'Design'],
    estimatedTime: 35,
    questionsCount: 5
  }
];

const demoStats: Stats = {
  totalAttempts: 12,
  averageScore: 78,
  completedDrills: 8,
  totalTimeSpent: 240
};

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Use the new drill data
  const filteredDrills = drillsData.filter((drill) => {
    const matchesSearch = drill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drill.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'all' || drill.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  // Calculate dynamic stats from localStorage
  const getStats = () => {
    const attempts = JSON.parse(localStorage.getItem('drillAttempts') || '[]');
    
    if (attempts.length === 0) {
      return demoStats; // Fallback to demo stats if no attempts
    }
    
    const totalAttempts = attempts.length;
    const totalScore = attempts.reduce((sum: number, attempt: any) => sum + attempt.score, 0);
    const totalPossible = attempts.reduce((sum: number, attempt: any) => {
      const drill = drillsData.find(d => d._id === attempt.drillId);
      return sum + (drill?.totalPoints || 50);
    }, 0);
    const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    const completedDrills = new Set(attempts.map((a: any) => a.drillId)).size;
    const totalTimeSpent = attempts.reduce((sum: number, attempt: any) => sum + attempt.timeSpent, 0);
    
    return {
      totalAttempts,
      averageScore,
      completedDrills,
      totalTimeSpent
    };
  };

  const stats = getStats();
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || user?.email}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-16 mb-2" />
                  <Skeleton className="h-8 w-12 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Attempts</p>
                      <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                    </div>
                    <Target className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">{stats.averageScore}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Drills</p>
                      <p className="text-2xl font-bold">{stats.completedDrills}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                      <p className="text-2xl font-bold">{Math.round(stats.totalTimeSpent / 60)}m</p>
                    </div>
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Search and Filter */}
        <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Drills
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search drills by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className="capitalize"
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drills Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredDrills && filteredDrills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDrills.map((drill, index: number) => (
                <div 
                  key={drill._id} 
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <DrillCard drill={drill} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No drills found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedDifficulty !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No drills are available right now. Check back later!'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
