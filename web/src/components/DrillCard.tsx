
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ArrowRight } from 'lucide-react';

interface DrillCardProps {
  drill: {
    _id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    tags: string[];
    estimatedTime?: number;
    questionsCount?: number;
  };
}

const DrillCard = ({ drill }: DrillCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return 'difficulty-easy';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in-up">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {drill.title}
            </CardTitle>
            <CardDescription className="text-sm">
              {drill.description}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getDifficultyColor(drill.difficulty)} font-medium`}
          >
            {drill.difficulty}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {drill.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {drill.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{drill.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {drill.estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{drill.estimatedTime} min</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{drill.questionsCount || 5} questions</span>
            </div>
          </div>

          {/* Action Button */}
          <Button asChild className="w-full group/btn">
            <Link to={`/drill/${drill._id}`}>
              <span>Start Drill</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrillCard;
