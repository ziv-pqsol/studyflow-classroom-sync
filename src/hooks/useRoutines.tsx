
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  category: 'study' | 'rest' | 'class' | 'exercise' | 'meal';
  duration: number;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useRoutines = () => {
  const [routines, setRoutines] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRoutines = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .order('time', { ascending: true });

      if (error) throw error;

      // Type cast the data to match our RoutineItem interface
      const typedRoutines: RoutineItem[] = (data || []).map(routine => ({
        ...routine,
        category: routine.category as RoutineItem['category']
      }));

      setRoutines(typedRoutines);
    } catch (error) {
      console.error('Error fetching routines:', error);
      toast({
        title: "Error fetching routines",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addRoutine = async (routine: Omit<RoutineItem, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('routines')
        .insert({
          ...routine,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Type cast the returned data
      const typedRoutine: RoutineItem = {
        ...data,
        category: data.category as RoutineItem['category']
      };

      setRoutines(prev => [...prev, typedRoutine].sort((a, b) => a.time.localeCompare(b.time)));
      
      toast({
        title: "Routine added",
        description: "Your new routine has been saved successfully.",
      });
    } catch (error) {
      console.error('Error adding routine:', error);
      toast({
        title: "Error adding routine",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const updateRoutine = async (id: string, updates: Partial<RoutineItem>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('routines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Type cast the returned data
      const typedRoutine: RoutineItem = {
        ...data,
        category: data.category as RoutineItem['category']
      };

      setRoutines(prev => 
        prev.map(routine => 
          routine.id === id ? { ...routine, ...typedRoutine } : routine
        ).sort((a, b) => a.time.localeCompare(b.time))
      );

      toast({
        title: "Routine updated",
        description: "Your routine has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating routine:', error);
      toast({
        title: "Error updating routine",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const deleteRoutine = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('routines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRoutines(prev => prev.filter(routine => routine.id !== id));
      
      toast({
        title: "Routine deleted",
        description: "Your routine has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast({
        title: "Error deleting routine",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchRoutines();
    } else {
      setRoutines([]);
      setLoading(false);
    }
  }, [user]);

  return {
    routines,
    loading,
    addRoutine,
    updateRoutine,
    deleteRoutine,
    refetch: fetchRoutines,
  };
};
