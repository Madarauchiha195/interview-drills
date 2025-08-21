
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import TimerDisplay from '@/components/TimerDisplay';
import ScoreDisplay from '@/components/ScoreDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ChevronRight, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTimer } from '@/hooks/useTimer';
import { drillsData } from '@/data/drillsData';
import { Drill, MCQQuestion, DrillAttempt } from '@/types/drill';

const DrillPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [drill, setDrill] = useState<Drill | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [startTime] = useState(Date.now());

  // Timer setup (15 minutes = 900 seconds)
  const timer = useTimer({
    initialTime: 900,
    onTimeUp: () => {
      toast({
        title: "Time's Up!",
        description: "The drill has been automatically submitted.",
        variant: "destructive",
      });
      handleSubmit();
    },
    autoStart: true
  });

  useEffect(() => {
    if (id) {
      const foundDrill = drillsData.find(d => d._id === id);
      if (foundDrill) {
        setDrill(foundDrill);
      } else {
        toast({
          title: "Error",
          description: "Drill not found.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [id, navigate, toast]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    if (!drill) return { score: 0, correctAnswers: 0, feedback: [] };
    
    let score = 0;
    let correctAnswers = 0;
    const feedback: string[] = [];
    
    drill.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        score += question.points;
        correctAnswers++;
        feedback.push(`Question ${index + 1}: Correct! (+${question.points} points)`);
      } else {
        const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
        feedback.push(
          `Question ${index + 1}: Incorrect. Correct answer: ${correctOption?.text || 'N/A'}`
        );
      }
    });
    
    return { score, correctAnswers, feedback };
  };

  const handleSubmit = async () => {
    if (!drill) return;

    const unansweredQuestions = drill.questions.filter(q => !answers[q.id]);
    
    if (unansweredQuestions.length > 0 && timer.timeLeft > 0) {
      toast({
        title: "Incomplete",
        description: `Please answer all questions before submitting. ${unansweredQuestions.length} questions remaining.`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const { score, correctAnswers, feedback } = calculateScore();
      
      // Simulate API call - store in localStorage for now
      const attempt: DrillAttempt = {
        _id: Date.now().toString(),
        drillId: drill._id,
        userId: 'demo-user',
        answers,
        score,
        totalQuestions: drill.questions.length,
        correctAnswers,
        timeSpent,
        createdAt: new Date().toISOString(),
        completed: true
      };
      
      const existingAttempts = JSON.parse(localStorage.getItem('drillAttempts') || '[]');
      existingAttempts.push(attempt);
      localStorage.setItem('drillAttempts', JSON.stringify(existingAttempts));
      
      setResult({
        score,
        totalQuestions: drill.questions.length,
        correctAnswers,
        timeSpent,
        feedback,
        percentage: Math.round((score / drill.totalPoints) * 100)
      });
      
      timer.pause();
      
      toast({
        title: "Success!",
        description: `You scored ${score}/${drill.totalPoints} points!`,
      });
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit answers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!drill) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading drill...</h1>
          </div>
        </div>
      </Layout>
    );
  }

  if (result) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button asChild>
                <Link to="/history">View History</Link>
              </Button>
            </div>

            <ScoreDisplay 
              score={result.score}
              totalQuestions={result.totalQuestions}
              timeSpent={result.timeSpent}
              feedback={result.feedback}
              correctAnswers={result.correctAnswers}
              totalPoints={drill.totalPoints}
            />

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowReview(!showReview)}
              >
                {showReview ? 'Hide Review' : 'Show Review'}
              </Button>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>

            {showReview && (
              <Card>
                <CardHeader>
                  <CardTitle>Answer Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {drill.questions.map((question, index) => {
                    const userAnswer = answers[question.id];
                    const isCorrect = userAnswer === question.correctAnswer;
                    const userOption = question.options.find(opt => opt.id === userAnswer);
                    const correctOption = question.options.find(opt => opt.id === question.correctAnswer);
                    
                    return (
                      <div key={question.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
                          </Badge>
                        </div>
                        <p className="mb-3">{question.prompt}</p>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Your answer:</strong> {userOption?.text || 'Not answered'}
                          </p>
                          <p>
                            <strong>Correct answer:</strong> {correctOption?.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const currentQ = drill.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / drill.questions.length) * 100;
  const allAnswered = drill.questions.every(q => answers[q.id]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in-up">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            
            <TimerDisplay
              timeLeft={timer.timeLeft}
              isRunning={timer.isRunning}
              formatTime={timer.formatTime}
              progress={timer.progress}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
            />
          </div>

          {/* Drill Info */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">{drill.title}</CardTitle>
                  <p className="text-muted-foreground">{drill.description}</p>
                </div>
                <Badge variant="outline" className={`difficulty-${drill.difficulty}`}>
                  {drill.difficulty}
                </Badge>
              </div>
              
              {/* Progress */}
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* Question */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Question {currentQuestion + 1} of {drill.questions.length}
                <Badge variant="outline">{currentQ.points} points</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p className="text-lg leading-relaxed">{currentQ.prompt}</p>
              </div>

              <RadioGroup
                value={answers[currentQ.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {drill.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                        index === currentQuestion
                          ? 'bg-primary text-primary-foreground'
                          : answers[drill.questions[index].id]
                          ? 'bg-success text-success-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {currentQuestion === drill.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!allAnswered || isSubmitting}
                    className="min-w-[100px]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentQuestion(prev => prev + 1)}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Answer Summary */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-lg">Answer Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <span className="text-success font-medium">
                  {Object.values(answers).filter(a => a).length}
                </span>
                {' '}answered, {' '}
                <span className="text-muted-foreground">
                  {drill.questions.length - Object.values(answers).filter(a => a).length}
                </span>
                {' '}remaining
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DrillPage;
