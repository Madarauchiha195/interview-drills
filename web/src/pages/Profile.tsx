
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Save, Loader2, Calendar, Sparkles } from 'lucide-react';

const Profile = () => {
  const { user, updateUsername } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(user?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    
    try {
      await updateUsername(username.trim());
      toast({
        title: "Success!",
        description: "Username updated successfully! Your greeting will now show the new username.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Format join date
  const formatJoinDate = () => {
    if (!user?.createdAt) return 'Recently joined';
    
    const joinDate = new Date(user.createdAt);
    const now = new Date();
    const daysSinceJoin = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceJoin === 0) return 'Today';
    if (daysSinceJoin === 1) return 'Yesterday';
    if (daysSinceJoin < 7) return `${daysSinceJoin} days ago`;
    if (daysSinceJoin < 30) return `${Math.floor(daysSinceJoin / 7)} weeks ago`;
    if (daysSinceJoin < 365) return `${Math.floor(daysSinceJoin / 30)} months ago`;
    
    return joinDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if user is new
  const isNewUser = () => {
    if (!user?.createdAt) return true;
    const userCreatedAt = new Date(user.createdAt);
    const now = new Date();
    const daysSinceCreation = Math.floor((now.getTime() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCreation <= 7;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-muted-foreground text-lg">
              Manage your account information
            </p>
            {user && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium">
                  Current Greeting: {isNewUser() 
                    ? `Welcome, ${user.username || user.name || user.email.split('@')[0]}! 👋`
                    : `Welcome back, ${user.username || user.name || user.email.split('@')[0]}! 👋`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.picture} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name?.charAt(0) || user?.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground">Signed in via Google</p>
                  {isNewUser() && (
                    <div className="flex items-center gap-1 mt-1">
                      <Sparkles className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-yellow-600 font-medium">New User</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed as it's managed by Google
                </p>
              </div>

              {/* Username Form */}
              <form onSubmit={handleUpdateUsername} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username (Optional)</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={50}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed in your dashboard greeting and profile
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isUpdating || username === (user?.username || '')}
                  className="w-full sm:w-auto"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isUpdating ? 'Updating...' : 'Update Username'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Account Type:</span>
                  <p className="text-muted-foreground">Google Account</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">Member Since:</span>
                    <p className="text-muted-foreground">{formatJoinDate()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Greeting Preview */}
          <Card className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle>Greeting Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  {isNewUser() 
                    ? `Welcome, ${username || user?.name || user?.email.split('@')[0]}! 👋`
                    : `Welcome back, ${username || user?.name || user?.email.split('@')[0]}! 👋`
                  }
                </h3>
                <p className="text-muted-foreground">
                  {isNewUser() 
                    ? 'Ready to start your learning journey?'
                    : 'Ready to continue your learning journey?'
                  }
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                This is how your greeting will appear on the dashboard. Update your username above to see changes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
