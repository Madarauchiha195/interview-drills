
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

interface TimerDisplayProps {
  timeLeft: number;
  isRunning: boolean;
  formatTime: string;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  className?: string;
}

const TimerDisplay = ({
  timeLeft,
  isRunning,
  formatTime,
  progress,
  onStart,
  onPause,
  onReset,
  className
}: TimerDisplayProps) => {
  const getTimeColor = () => {
    if (timeLeft < 60) return 'text-destructive';
    if (timeLeft < 300) return 'text-warning';
    return 'text-foreground';
  };

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={`text-lg font-mono font-bold ${getTimeColor()}`}>
              {formatTime}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={isRunning ? onPause : onStart}
            >
              {isRunning ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <Progress 
          value={progress} 
          className="mt-2 h-2" 
        />
      </CardContent>
    </Card>
  );
};

export default TimerDisplay;
