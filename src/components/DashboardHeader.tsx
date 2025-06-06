
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">StudyFlow</h1>
              <p className="text-sm text-gray-500">Smart Study Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <User className="w-5 h-5 text-gray-600" />
              </Button>
            )}

            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
