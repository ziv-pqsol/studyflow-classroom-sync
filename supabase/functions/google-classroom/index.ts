
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization')!;
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { action, accessToken } = await req.json();

    if (action === 'getCourses') {
      const coursesResponse = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!coursesResponse.ok) {
        throw new Error(`Failed to fetch courses: ${coursesResponse.statusText}`);
      }

      const coursesData = await coursesResponse.json();
      return new Response(JSON.stringify(coursesData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getAssignments') {
      const { courseId } = await req.json();
      
      const assignmentsResponse = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!assignmentsResponse.ok) {
        throw new Error(`Failed to fetch assignments: ${assignmentsResponse.statusText}`);
      }

      const assignmentsData = await assignmentsResponse.json();
      return new Response(JSON.stringify(assignmentsData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'getAllAssignments') {
      // First get all courses
      const coursesResponse = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!coursesResponse.ok) {
        throw new Error(`Failed to fetch courses: ${coursesResponse.statusText}`);
      }

      const coursesData = await coursesResponse.json();
      const courses = coursesData.courses || [];

      // Get assignments for each course
      const allAssignments = [];
      for (const course of courses) {
        try {
          const assignmentsResponse = await fetch(
            `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`,
            {
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );

          if (assignmentsResponse.ok) {
            const assignmentsData = await assignmentsResponse.json();
            const assignments = assignmentsData.courseWork || [];
            
            assignments.forEach((assignment: any) => {
              allAssignments.push({
                id: assignment.id,
                title: assignment.title,
                courseName: course.name,
                courseId: course.id,
                description: assignment.description,
                dueDate: assignment.dueDate,
                dueTime: assignment.dueTime,
                creationTime: assignment.creationTime,
                updateTime: assignment.updateTime,
                state: assignment.state,
                alternateLink: assignment.alternateLink,
              });
            });
          }
        } catch (error) {
          console.error(`Error fetching assignments for course ${course.id}:`, error);
        }
      }

      return new Response(JSON.stringify({ 
        courses: courses,
        assignments: allAssignments 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in google-classroom function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
