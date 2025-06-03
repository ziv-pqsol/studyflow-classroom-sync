
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit2, Trash2, BookOpen, Coffee, GraduationCap, Dumbbell, Utensils } from 'lucide-react';
import { RoutineItem } from '@/pages/Index';

interface RoutineTimelineProps {
  routines: RoutineItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string, routine: Partial<RoutineItem>) => void;
}

const categoryConfig = {
  study: { color: 'bg-blue-500', icon: BookOpen, label: 'Study', badgeClass: 'bg-blue-100 text-blue-800' },
  rest: { color: 'bg-green-500', icon: Coffee, label: 'Rest', badgeClass: 'bg-green-100 text-green-800' },
  class: { color: 'bg-purple-500', icon: GraduationCap, label: 'Class', badgeClass: 'bg-purple-100 text-purple-800' },
  exercise: { color: 'bg-orange-500', icon: Dumbbell, label: 'Exercise', badgeClass: 'bg-orange-100 text-orange-800' },
  meal: { color: 'bg-yellow-500', icon: Utensils, label: 'Meal', badgeClass: 'bg-yellow-100 text-yellow-800' }
};

const RoutineTimeline: React.FC<RoutineTimelineProps> = ({ routines, onDelete, onEdit }) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const isCurrentTime = (routineTime: string, duration: number) => {
    const current = getCurrentTime();
    const endTime = new Date();
    const [hours, minutes] = routineTime.split(':').map(Number);
    endTime.setHours(hours, minutes + duration, 0, 0);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
    return current >= routineTime && current <= endTimeStr;
  };

  return (
    <div className="space-y-4">
      {routines.length === 0 ? (
        <Card className="text-center py-12 border-dashed border-2 border-gray-300">
          <CardContent>
            <div className="text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No routines yet</h3>
              <p className="text-sm">Start by adding your first daily routine!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        routines.map((routine, index) => {
          const config = categoryConfig[routine.category];
          const Icon = config.icon;
          const isActive = isCurrentTime(routine.time, routine.duration);
          
          return (
            <Card 
              key={routine.id} 
              className={`transition-all duration-200 hover:shadow-md ${
                isActive ? 'ring-2 ring-blue-400 shadow-lg bg-blue-50/50' : 'bg-white/70'
              } backdrop-blur-sm border-0`}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Time indicator */}
                  <div className="w-20 sm:w-24 flex-shrink-0 p-4 border-r border-gray-100">
                    <div className="text-center">
                      <div className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                        {routine.time}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDuration(routine.duration)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-8 h-8 ${config.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-semibold truncate ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                              {routine.title}
                            </h3>
                            <Badge variant="secondary" className={`${config.badgeClass} text-xs mt-1`}>
                              {config.label}
                            </Badge>
                          </div>
                        </div>
                        
                        {routine.description && (
                          <p className="text-sm text-gray-600 ml-11 line-clamp-2">
                            {routine.description}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(routine.id)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(routine.id)}
                          className="p-2 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress indicator for current activity */}
                {isActive && (
                  <div className="px-4 pb-3">
                    <div className="w-full bg-blue-200 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1 font-medium">Currently active</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default RoutineTimeline;
