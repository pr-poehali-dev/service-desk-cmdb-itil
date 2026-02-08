import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const modules = [
    { id: 'dashboard', name: 'Дашборд', icon: 'LayoutDashboard' },
    { id: 'incidents', name: 'Инциденты', icon: 'AlertCircle' },
    { id: 'cmdb', name: 'CMDB', icon: 'Database' },
    { id: 'problems', name: 'Проблемы', icon: 'Bug' },
    { id: 'requests', name: 'Заявки', icon: 'FileText' },
    { id: 'changes', name: 'Изменения', icon: 'GitBranch' },
    { id: 'knowledge', name: 'Знания', icon: 'BookOpen' },
    { id: 'users', name: 'Пользователи', icon: 'Users' },
    { id: 'integrations', name: 'Интеграции', icon: 'Plug' },
  ];

  const dashboardStats = [
    { title: 'Открытые инциденты', value: '24', change: '+3', icon: 'AlertCircle', color: 'text-red-500' },
    { title: 'SLA соблюдено', value: '94%', change: '+2%', icon: 'CheckCircle', color: 'text-green-500' },
    { title: 'Активные заявки', value: '156', change: '-12', icon: 'FileText', color: 'text-blue-500' },
    { title: 'Среднее время решения', value: '4.2ч', change: '-0.5ч', icon: 'Clock', color: 'text-yellow-500' },
  ];

  const incidents = [
    { id: 'INC-001', title: 'Сбой почтового сервера', priority: 'Критический', status: 'В работе', assignee: 'Иванов И.', sla: '2ч 15м', created: '08.02.2026 09:30' },
    { id: 'INC-002', title: 'Медленная работа CRM', priority: 'Высокий', status: 'Назначен', assignee: 'Петрова А.', sla: '4ч 20м', created: '08.02.2026 10:15' },
    { id: 'INC-003', title: 'Нет доступа к файловому хранилищу', priority: 'Средний', status: 'Ожидание', assignee: '-', sla: '8ч 10м', created: '08.02.2026 11:00' },
    { id: 'INC-004', title: 'Принтер не печатает в бухгалтерии', priority: 'Низкий', status: 'Решен', assignee: 'Сидоров П.', sla: 'Соблюдено', created: '08.02.2026 08:45' },
  ];

  const cmdbItems = [
    { id: 'CI-001', name: 'MAIL-SRV-01', type: 'Сервер', status: 'Активен', location: 'ЦОД-1', owner: 'ИТ отдел', lastUpdate: '07.02.2026' },
    { id: 'CI-002', name: 'CRM-APP-PROD', type: 'Приложение', status: 'Активен', location: 'Cloud', owner: 'Отдел продаж', lastUpdate: '05.02.2026' },
    { id: 'CI-003', name: 'SWITCH-FL3-02', type: 'Сеть', status: 'Активен', location: 'Офис, 3 этаж', owner: 'ИТ отдел', lastUpdate: '01.02.2026' },
    { id: 'CI-004', name: 'WS-ACC-15', type: 'Рабочая станция', status: 'В ремонте', location: 'Бухгалтерия', owner: 'Бухгалтерия', lastUpdate: '08.02.2026' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Критический': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'Высокий': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'Средний': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Низкий': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'В работе': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'Назначен': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Ожидание': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'Решен': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'Активен': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'В ремонте': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border backdrop-blur-xl z-50">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-sidebar-foreground">ServiceDesk</h1>
              <p className="text-xs text-muted-foreground">ITIL Service Management</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth ${
                activeModule === module.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon name={module.icon} size={20} />
              <span className="font-medium">{module.name}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-4 bg-sidebar-accent rounded-lg border border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
              АП
            </div>
            <div>
              <p className="text-sm font-medium text-sidebar-foreground">Админ Портала</p>
              <p className="text-xs text-muted-foreground">admin@company.ru</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {modules.find(m => m.id === activeModule)?.name}
              </h2>
              <p className="text-muted-foreground">Управление ИТ-услугами по стандартам ITIL</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Icon name="Download" size={16} />
                Импорт
              </Button>
              <Button variant="outline" className="gap-2">
                <Icon name="Bell" size={16} />
                Уведомления
              </Button>
              <Dialog>
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
                  <div className="space-y-4">
                    <div>
                      <Label>Название инцидента</Label>
                      <Input placeholder="Краткое описание проблемы" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Приоритет</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите приоритет" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Критический</SelectItem>
                            <SelectItem value="high">Высокий</SelectItem>
                            <SelectItem value="medium">Средний</SelectItem>
                            <SelectItem value="low">Низкий</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Категория</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hardware">Оборудование</SelectItem>
                            <SelectItem value="software">ПО</SelectItem>
                            <SelectItem value="network">Сеть</SelectItem>
                            <SelectItem value="access">Доступ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>Описание</Label>
                      <Textarea placeholder="Подробное описание инцидента..." rows={4} />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Отмена</Button>
                      <Button className="bg-gradient-to-r from-primary to-accent">
                        Создать инцидент
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Dashboard Stats */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                  <Card key={index} className="bg-card border-border hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                          <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
                          <p className={`text-sm ${stat.change.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                            {stat.change} за неделю
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color.replace('text-', 'from-')}/20 to-transparent`}>
                          <Icon name={stat.icon} size={24} className={stat.color} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={20} className="text-primary" />
                      Динамика инцидентов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      График будет здесь (подключим аналитику)
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="PieChart" size={20} className="text-accent" />
                      Распределение по приоритетам
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Диаграмма будет здесь (подключим аналитику)
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Incidents Module */}
          {activeModule === 'incidents' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="AlertCircle" size={20} className="text-red-500" />
                    Управление инцидентами
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Поиск инцидентов..." 
                        className="pl-9 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Icon name="Filter" size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Все (24)</TabsTrigger>
                    <TabsTrigger value="active">Активные (18)</TabsTrigger>
                    <TabsTrigger value="resolved">Решенные (6)</TabsTrigger>
                    <TabsTrigger value="overdue">Просроченные (2)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Название</TableHead>
                          <TableHead>Приоритет</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Исполнитель</TableHead>
                          <TableHead>SLA</TableHead>
                          <TableHead>Создан</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.map((incident) => (
                          <TableRow key={incident.id} className="hover:bg-muted/50 transition-smooth">
                            <TableCell className="font-medium">{incident.id}</TableCell>
                            <TableCell className="font-medium">{incident.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getPriorityColor(incident.priority)}>
                                {incident.priority}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(incident.status)}>
                                {incident.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{incident.assignee}</TableCell>
                            <TableCell className={incident.sla === 'Соблюдено' ? 'text-green-400' : 'text-yellow-400'}>
                              {incident.sla}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{incident.created}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                <Icon name="MoreVertical" size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* CMDB Module */}
          {activeModule === 'cmdb' && (
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Database" size={20} className="text-blue-500" />
                    База конфигурационных единиц
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="Поиск в CMDB..." 
                        className="pl-9 w-64"
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Icon name="Filter" size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">Все (248)</TabsTrigger>
                    <TabsTrigger value="servers">Серверы (42)</TabsTrigger>
                    <TabsTrigger value="apps">Приложения (56)</TabsTrigger>
                    <TabsTrigger value="network">Сеть (35)</TabsTrigger>
                    <TabsTrigger value="workstations">Рабочие станции (115)</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Название</TableHead>
                          <TableHead>Тип</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Расположение</TableHead>
                          <TableHead>Владелец</TableHead>
                          <TableHead>Обновлено</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cmdbItems.map((item) => (
                          <TableRow key={item.id} className="hover:bg-muted/50 transition-smooth">
                            <TableCell className="font-medium">{item.id}</TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-muted-foreground">{item.type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{item.location}</TableCell>
                            <TableCell className="text-muted-foreground">{item.owner}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{item.lastUpdate}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                <Icon name="MoreVertical" size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Other Modules Placeholder */}
          {!['dashboard', 'incidents', 'cmdb'].includes(activeModule) && (
            <Card className="bg-card border-border">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <Icon name={modules.find(m => m.id === activeModule)?.icon || 'Zap'} size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {modules.find(m => m.id === activeModule)?.name}
                    </h3>
                    <p className="text-muted-foreground">
                      Модуль в разработке. Напишите, какие функции нужны, и я добавлю.
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">SLA мониторинг</Badge>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">Автоматизация</Badge>
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Аналитика</Badge>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">Уведомления</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;