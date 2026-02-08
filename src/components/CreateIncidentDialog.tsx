import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface CreateIncidentDialogProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const CreateIncidentDialog = ({ onSubmit }: CreateIncidentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Средний',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setOpen(false);
    setFormData({ title: '', description: '', priority: 'Средний', category: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-smooth">
          <Icon name="Plus" size={16} />
          Создать
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создать инцидент</DialogTitle>
          <DialogDescription>
            Заполните информацию для регистрации нового инцидента
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Название инцидента</Label>
            <Input
              placeholder="Краткое описание проблемы"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Приоритет</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Критический">Критический</SelectItem>
                  <SelectItem value="Высокий">Высокий</SelectItem>
                  <SelectItem value="Средний">Средний</SelectItem>
                  <SelectItem value="Низкий">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Категория</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Оборудование">Оборудование</SelectItem>
                  <SelectItem value="ПО">ПО</SelectItem>
                  <SelectItem value="Сеть">Сеть</SelectItem>
                  <SelectItem value="Доступ">Доступ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Описание</Label>
            <Textarea
              placeholder="Подробное описание инцидента..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              Создать инцидент
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIncidentDialog;
