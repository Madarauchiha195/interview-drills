
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Brain, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Landing = () => {
  const { user, loading, login } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      icon: Brain,
      title: "Smart Drills",
      description: "AI-powered practice questions tailored to your learning goals"
    },
    {
      icon: Target,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and insights"
    },
    {
      icon: TrendingUp,
      title: "Skill Building",
      description: "Build expertise through structured, progressive challenges"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EduDrill</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Hero Content */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Master Skills with
              <span className="text-primary block">Smart Practice</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your learning with intelligent drill exercises designed to help you 
              build expertise and track your progress effectively.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={login}
              className="text-lg px-8 py-6 educational-gradient hover:opacity-90 transition-all duration-200 group"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose EduDrill?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform combines modern learning techniques with intelligent practice to accelerate your growth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="text-center p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <div className="bg-card border rounded-2xl p-12 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of learners who are already improving their skills with EduDrill
            </p>
            <Button size="lg" onClick={login} className="educational-gradient hover:opacity-90">
              Get Started Free
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
