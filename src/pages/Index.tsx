
import React, { useState } from 'react';
import { Calendar, Clock, Plus, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRoutines } from '@/hooks/useRoutines';
import DashboardHeader from '@/components/DashboardHeader';
import RoutineTimeline from '@/components/RoutineTimeline';
import AddRoutineModal from '@/components/AddRoutineModal';
import GoogleClassroomPanel from '@/components/GoogleClassroomPanel';
import LoginPage from '@/components/LoginPage';

const StudyFlow = () => {
  const { user, loading } = useAuth();
  const { routines, loading: routinesLoading, addRoutine, deleteRoutine, updateRoutine } = useRoutines();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <DashboardHeader 
        isGoogleConnected={isGoogleConnected}
        onGoogleConnect={() => setIsGoogleConnected(!isGoogleConnected)}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Schedule</h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Routine
              </Button>
            </div>

            <RoutineTimeline 
              routines={routines}
              loading={routinesLoading}
              onDelete={deleteRoutine}
              onEdit={updateRoutine}
            />
          </div>

          {/* Sidebar - Google Classroom & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-800">Today's Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Total Study Time</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {Math.floor(routines.filter(r => r.category === 'study').reduce((sum, r) => sum + r.duration, 0) / 60)}h
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Classes</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {routines.filter(r => r.category === 'class').length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">Activities</span>
                  </div>
                  <span className="font-semibold text-purple-600">
                    {routines.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Google Classroom Integration */}
            <GoogleClassroomPanel 
              isConnected={isGoogleConnected}
              onConnect={() => setIsGoogleConnected(true)}
            />
          </div>
        </div>
      </main>

      <AddRoutineModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addRoutine}
      />
    </div>
  );
};

export default StudyFlow;
