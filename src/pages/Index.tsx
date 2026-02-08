import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
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
import CreateIncidentDialog from '@/components/CreateIncidentDialog';

const API_URL = 'https://functions.poehali.dev/c2bdd105-8811-4bd7-9c13-a84fec86834c';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [incidents, setIncidents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [cmdbItems, setCmdbItems] = useState([]);
  const [stats, setStats] = useState({ open_incidents: 0, active_requests: 0, sla_percentage: 0, active_ci: 0 });
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

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

  // Загружаем данные из API
  const loadData = async () => {
    setLoading(true);
    try {
      if (activeModule === 'dashboard' || activeModule === 'incidents') {
        const incidentsRes = await fetch(`${API_URL}?path=/incidents`);
        const incidentsData = await incidentsRes.json();
        setIncidents(incidentsData.data || []);
      }

      if (activeModule === 'dashboard' || activeModule === 'requests') {
        const requestsRes = await fetch(`${API_URL}?path=/requests`);
        const requestsData = await requestsRes.json();
        setRequests(requestsData.data || []);
      }

      if (activeModule === 'dashboard' || activeModule === 'cmdb') {
        const cmdbRes = await fetch(`${API_URL}?path=/cmdb`);
        const cmdbData = await cmdbRes.json();
        setCmdbItems(cmdbData.data || []);
      }

      if (activeModule === 'dashboard') {
        const statsRes = await fetch(`${API_URL}?path=/stats`);
        const statsData = await statsRes.json();
        setStats(statsData.data || {});
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModule]);

  const handleCreateIncident = async (formData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_URL}?path=/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Инцидент создан',
        });
        setDialogOpen(false);
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать инцидент',
        variant: 'destructive',
      });
    }
  };

  const handleCreateRequest = async (formData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_URL}?path=/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Заявка создана',
        });
        setDialogOpen(false);
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать заявку',
        variant: 'destructive',
      });
    }
  };

  const handleCreateCMDB = async (formData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_URL}?path=/cmdb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'CI добавлена',
        });
        setDialogOpen(false);
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить CI',
        variant: 'destructive',
      });
    }
  };

  const dashboardStats = [
    { title: 'Открытые инциденты', value: stats.open_incidents?.toString() || '0', change: '+3', icon: 'AlertCircle', color: 'text-red-500' },
    { title: 'SLA соблюдено', value: `${stats.sla_percentage || 0}%`, change: '+2%', icon: 'CheckCircle', color: 'text-green-500' },
    { title: 'Активные заявки', value: stats.active_requests?.toString() || '0', change: '-12', icon: 'FileText', color: 'text-blue-500' },
    { title: 'Активные CI', value: stats.active_ci?.toString() || '0', change: '+5', icon: 'Database', color: 'text-yellow-500' },
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              <CreateIncidentDialog onSubmit={handleCreateIncident} />
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
                    <TabsTrigger value="all">Все ({incidents.length})</TabsTrigger>
                    <TabsTrigger value="active">Активные</TabsTrigger>
                    <TabsTrigger value="resolved">Решенные</TabsTrigger>
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
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Загрузка...
                            </TableCell>
                          </TableRow>
                        ) : incidents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Инцидентов нет
                            </TableCell>
                          </TableRow>
                        ) : (
                          incidents.map((incident: Record<string, unknown>) => (
                            <TableRow key={incident.incident_id as string} className="hover:bg-muted/50 transition-smooth">
                              <TableCell className="font-medium">{incident.incident_id as string}</TableCell>
                              <TableCell className="font-medium">{incident.title as string}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getPriorityColor(incident.priority as string)}>
                                  {incident.priority as string}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(incident.status as string)}>
                                  {incident.status as string}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{incident.assignee as string || '-'}</TableCell>
                              <TableCell className="text-yellow-400">
                                {incident.sla_deadline ? formatDate(incident.sla_deadline as string) : '-'}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">{formatDate(incident.created_at as string)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                  <Icon name="MoreVertical" size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
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
                    <TabsTrigger value="all">Все ({cmdbItems.length})</TabsTrigger>
                    <TabsTrigger value="servers">Серверы</TabsTrigger>
                    <TabsTrigger value="apps">Приложения</TabsTrigger>
                    <TabsTrigger value="network">Сеть</TabsTrigger>
                    <TabsTrigger value="workstations">Рабочие станции</TabsTrigger>
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
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              Загрузка...
                            </TableCell>
                          </TableRow>
                        ) : cmdbItems.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                              CI не найдены
                            </TableCell>
                          </TableRow>
                        ) : (
                          cmdbItems.map((item: Record<string, unknown>) => (
                            <TableRow key={item.ci_id as string} className="hover:bg-muted/50 transition-smooth">
                              <TableCell className="font-medium">{item.ci_id as string}</TableCell>
                              <TableCell className="font-medium">{item.name as string}</TableCell>
                              <TableCell className="text-muted-foreground">{item.type as string}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(item.status as string)}>
                                  {item.status as string}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{item.location as string || '-'}</TableCell>
                              <TableCell className="text-muted-foreground">{item.owner as string || '-'}</TableCell>
                              <TableCell className="text-muted-foreground text-sm">{formatDate(item.updated_at as string)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                                  <Icon name="MoreVertical" size={16} />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
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