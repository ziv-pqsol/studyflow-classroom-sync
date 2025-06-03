
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface GoogleCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  ownerId: string;
  creationTime: string;
  updateTime: string;
  enrollmentCode?: string;
  courseState: string;
  alternateLink: string;
  teacherFolder?: {
    id: string;
    title: string;
    alternateLink: string;
  };
  courseMaterialSets?: any[];
  guardiansEnabled?: boolean;
  calendarId?: string;
}

export interface GoogleAssignment {
  id: string;
  title: string;
  courseName: string;
  courseId: string;
  description?: string;
  dueDate?: {
    year: number;
    month: number;
    day: number;
  };
  dueTime?: {
    hours: number;
    minutes: number;
  };
  creationTime: string;
  updateTime: string;
  state: string;
  alternateLink: string;
}

export const useGoogleClassroom = () => {
  const [courses, setCourses] = useState<GoogleCourse[]>([]);
  const [assignments, setAssignments] = useState<GoogleAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { user, session } = useAuth();

  const getGoogleAccessToken = async () => {
    if (!session?.provider_token) {
      console.log('No provider token available');
      return null;
    }
    return session.provider_token;
  };

  const connectToClassroom = async () => {
    try {
      setLoading(true);
      
      // Get the access token from the session
      const token = await getGoogleAccessToken();
      if (!token) {
        toast({
          title: "Authentication required",
          description: "Please sign in with Google to access Classroom.",
          variant: "destructive",
        });
        return;
      }

      setAccessToken(token);
      await fetchClassroomData(token);
      setIsConnected(true);
      
      toast({
        title: "Connected to Google Classroom!",
        description: "Your courses and assignments have been synced.",
      });
    } catch (error) {
      console.error('Error connecting to Classroom:', error);
      toast({
        title: "Connection failed",
        description: "Please check your permissions and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClassroomData = async (token: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('google-classroom', {
        body: {
          action: 'getAllAssignments',
          accessToken: token,
        },
      });

      if (error) throw error;

      setCourses(data.courses || []);
      setAssignments(data.assignments || []);
      
      console.log('Fetched courses:', data.courses?.length || 0);
      console.log('Fetched assignments:', data.assignments?.length || 0);
    } catch (error) {
      console.error('Error fetching classroom data:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (!accessToken) return;
    
    setLoading(true);
    try {
      await fetchClassroomData(accessToken);
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh classroom data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto-connect when user is authenticated and has Google provider token
  useEffect(() => {
    if (user && session?.provider_token && !isConnected) {
      connectToClassroom();
    }
  }, [user, session?.provider_token, isConnected]);

  const getAssignmentDueDate = (assignment: GoogleAssignment): string => {
    if (!assignment.dueDate) return '';
    
    const { year, month, day } = assignment.dueDate;
    const date = new Date(year, month - 1, day);
    
    if (assignment.dueTime) {
      const { hours, minutes } = assignment.dueTime;
      date.setHours(hours, minutes);
    }
    
    return date.toISOString().split('T')[0];
  };

  const getAssignmentStatus = (assignment: GoogleAssignment): 'pending' | 'submitted' | 'late' => {
    if (!assignment.dueDate) return 'pending';
    
    const dueDate = new Date(assignment.dueDate.year, assignment.dueDate.month - 1, assignment.dueDate.day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      return 'late';
    }
    
    return 'pending';
  };

  return {
    courses,
    assignments,
    loading,
    isConnected,
    connectToClassroom,
    refreshData,
    getAssignmentDueDate,
    getAssignmentStatus,
  };
};
