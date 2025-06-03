
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Chrome } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to StudyFlow
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Smart Study Management for Students
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-6">
              Sign in with your Google account to get started with managing your study routines and accessing Google Classroom integration.
            </p>
            
            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
              size="lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-3" />
              ) : (
                <Chrome className="w-5 h-5 mr-3" />
              )}
              Continue with Google
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
