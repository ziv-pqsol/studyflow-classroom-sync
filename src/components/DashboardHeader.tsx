
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  isGoogleConnected: boolean;
  onGoogleConnect: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isGoogleConnected, 
  onGoogleConnect 
}) => {
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
            <Button
              variant={isGoogleConnected ? "default" : "outline"}
              onClick={onGoogleConnect}
              className={`hidden sm:flex ${
                isGoogleConnected 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "border-blue-300 text-blue-600 hover:bg-blue-50"
              }`}
            >
              {isGoogleConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-300 rounded-full mr-2" />
                  Google Connected
                </>
              ) : (
                <>
                  Connect Google
                </>
              )}
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <User className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
