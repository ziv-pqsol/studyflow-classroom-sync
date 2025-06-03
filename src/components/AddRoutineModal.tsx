
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoutineItem } from '@/pages/Index';

interface AddRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (routine: Omit<RoutineItem, 'id'>) => void;
}

const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    time: '',
    title: '',
    description: '',
    category: 'study' as RoutineItem['category'],
    duration: 60
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.time || !formData.title) return;

    onAdd(formData);
    setFormData({
      time: '',
      title: '',
      description: '',
      category: 'study',
      duration: 60
    });
    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add New Routine
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium text-gray-700">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="480"
                step="5"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                className="w-full"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Morning Study Session"
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              Category
            </Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="study">📚 Study</SelectItem>
                <SelectItem value="class">🎓 Class</SelectItem>
                <SelectItem value="rest">☕ Rest</SelectItem>
                <SelectItem value="exercise">💪 Exercise</SelectItem>
                <SelectItem value="meal">🍽️ Meal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description (optional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add any notes or details..."
              className="w-full resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Add Routine
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoutineModal;
