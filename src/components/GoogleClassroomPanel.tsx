
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, AlertCircle, BookOpen, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GoogleClassroomPanelProps {
  isConnected: boolean;
  onConnect: () => void;
}

interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'late';
}

interface Course {
  id: string;
  name: string;
  teacher: string;
  enrollmentCode?: string;
}

const GoogleClassroomPanel: React.FC<GoogleClassroomPanelProps> = ({ isConnected, onConnect }) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockCourses: Course[] = [
    { id: '1', name: 'Advanced Mathematics', teacher: 'Dr. Smith' },
    { id: '2', name: 'Physics 101', teacher: 'Prof. Johnson' },
    { id: '3', name: 'Computer Science', teacher: 'Ms. Davis' }
  ];

  const mockAssignments: Assignment[] = [
    {
      id: '1',
      title: 'Linear Algebra Problem Set',
      courseName: 'Advanced Mathematics',
      dueDate: '2024-06-05',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Physics Lab Report',
      courseName: 'Physics 101',
      dueDate: '2024-06-04',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Programming Assignment 3',
      courseName: 'Computer Science',
      dueDate: '2024-06-06',
      status: 'pending'
    }
  ];

  const connectToGoogle = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth flow
      setTimeout(() => {
        onConnect();
        setCourses(mockCourses);
        setAssignments(mockAssignments);
        setLoading(false);
        toast({
          title: "Connected to Google Classroom!",
          description: "Your courses and assignments have been synced.",
        });
      }, 2000);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Connection failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (assignment: Assignment) => {
    const daysUntil = getDaysUntilDue(assignment.dueDate);
    
    if (assignment.status === 'submitted') {
      return <Badge className="bg-green-100 text-green-800">Submitted</Badge>;
    }
    
    if (daysUntil < 0) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
    
    if (daysUntil === 0) {
      return <Badge className="bg-orange-100 text-orange-800">Due Today</Badge>;
    }
    
    if (daysUntil === 1) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due Tomorrow</Badge>;
    }
    
    return <Badge className="bg-gray-100 text-gray-800">{daysUntil} days left</Badge>;
  };

  if (!isConnected) {
    return (
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5" />
            Google Classroom
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm mb-4">Connect your Google Classroom to sync assignments and deadlines</p>
          </div>
          <Button 
            onClick={connectToGoogle}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Connect Google
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Courses */}
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Courses
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {courses.map((course) => (
            <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm text-gray-900 truncate">{course.name}</h4>
              <p className="text-xs text-gray-600">{course.teacher}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Assignments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.slice(0, 3).map((assignment) => (
            <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{assignment.title}</h4>
                  <p className="text-xs text-gray-600">{assignment.courseName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {getStatusBadge(assignment)}
                </div>
              </div>
            </div>
          ))}
          
          {assignments.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No upcoming assignments</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleClassroomPanel;
