
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  totalQuestions: number;
  timeSpent?: number;
  feedback?: string[];
  correctAnswers?: number;
  totalPoints?: number;
}

const ScoreDisplay = ({ 
  score, 
  totalQuestions, 
  timeSpent, 
  feedback, 
  correctAnswers, 
  totalPoints 
}: ScoreDisplayProps) => {
  const maxPoints = totalPoints || totalQuestions * 10;
  const percentage = Math.round((score / maxPoints) * 100);
  
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 90) return { text: 'Excellent', variant: 'default' as const };
    if (percentage >= 80) return { text: 'Great', variant: 'secondary' as const };
    if (percentage >= 70) return { text: 'Good', variant: 'secondary' as const };
    if (percentage >= 60) return { text: 'Fair', variant: 'outline' as const };
    return { text: 'Needs Improvement', variant: 'destructive' as const };
  };

  const scoreBadge = getScoreBadge(percentage);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Main Score Card */}
      <Card className="text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>
              {score}/{maxPoints}
            </div>
            <div className="text-lg text-muted-foreground">
              {percentage}% Correct
            </div>
            <Badge variant={scoreBadge.variant} className="text-sm">
              {scoreBadge.text}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={percentage} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-lg">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div className="text-center">
                <div className="font-semibold">{correctAnswers || score}</div>
                <div className="text-xs text-muted-foreground">Correct</div>
              </div>
            </div>
            {timeSpent && (
              <div className="flex items-center justify-center space-x-2 p-3 bg-muted/50 rounded-lg">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="text-center">
                  <div className="font-semibold">{Math.round(timeSpent / 60)}m</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      {feedback && feedback.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.map((item, index) => (
                <div key={index} className="p-3 bg-muted/30 rounded-lg text-sm">
                  <strong>Question {index + 1}:</strong> {item}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScoreDisplay;
