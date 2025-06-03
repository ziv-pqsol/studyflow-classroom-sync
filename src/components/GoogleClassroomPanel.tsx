
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, AlertCircle, BookOpen, Clock, RefreshCw } from 'lucide-react';
import { useGoogleClassroom } from '@/hooks/useGoogleClassroom';

const GoogleClassroomPanel: React.FC = () => {
  const { 
    courses, 
    assignments, 
    loading, 
    isConnected, 
    connectToClassroom, 
    refreshData,
    getAssignmentDueDate,
    getAssignmentStatus 
  } = useGoogleClassroom();

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (assignment: any) => {
    const status = getAssignmentStatus(assignment);
    const dueDate = getAssignmentDueDate(assignment);
    const daysUntil = getDaysUntilDue(dueDate);
    
    if (status === 'late') {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    }
    
    if (daysUntil === 0) {
      return <Badge className="bg-orange-100 text-orange-800">Due Today</Badge>;
    }
    
    if (daysUntil === 1) {
      return <Badge className="bg-yellow-100 text-yellow-800">Due Tomorrow</Badge>;
    }
    
    if (daysUntil && daysUntil > 0) {
      return <Badge className="bg-gray-100 text-gray-800">{daysUntil} days left</Badge>;
    }
    
    return <Badge className="bg-gray-100 text-gray-800">No due date</Badge>;
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
            <p className="text-sm mb-4">Connect to Google Classroom to sync your real assignments and deadlines</p>
          </div>
          <Button 
            onClick={connectToClassroom}
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
                Connect to Classroom
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Google Classroom</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshData}
          disabled={loading}
          className="text-gray-600 hover:text-gray-800"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Courses */}
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Courses ({courses.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm text-gray-900 truncate">{course.name}</h4>
                {course.section && (
                  <p className="text-xs text-gray-600">{course.section}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {course.enrollmentCode && `Code: ${course.enrollmentCode}`}
                  </span>
                  {course.alternateLink && (
                    <a
                      href={course.alternateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No courses found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Assignments */}
      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Assignments ({assignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assignments.length > 0 ? (
            assignments.slice(0, 5).map((assignment) => (
              <div key={assignment.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{assignment.title}</h4>
                    <p className="text-xs text-gray-600">{assignment.courseName}</p>
                    {assignment.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{assignment.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {getAssignmentDueDate(assignment) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {new Date(getAssignmentDueDate(assignment)).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {assignment.alternateLink && (
                        <a
                          href={assignment.alternateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(assignment)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No assignments found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoogleClassroomPanel;
