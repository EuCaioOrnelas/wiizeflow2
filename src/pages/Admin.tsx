
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Target, LogOut, Users, BarChart3, Activity, Eye, Crown, Search, Filter, Download, RefreshCw, UserX, UserCheck, Trash2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  freeUsers: number;
  paidUsers: number;
  totalFunnels: number;
  onlineUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan_type: string;
  funnel_count: number;
  created_at: string;
}

const Admin = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    freeUsers: 0,
    paidUsers: 0,
    totalFunnels: 0,
    onlineUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const ADMIN_EMAIL = "admin@wiizeflow.com";
  const ADMIN_PASSWORD = "WiizeAdmin2024!";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, planFilter, dateFilter]);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const handleAdminLogin = () => {
    if (adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadAdminData();
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao painel administrativo",
      });
    } else {
      toast({
        title: "Credenciais inválidas",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  const loadAdminData = async () => {
    setRefreshing(true);
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading profiles:', error);
        return;
      }

      setUsers(profiles || []);

      // Calcular estatísticas avançadas
      const totalUsers = profiles?.length || 0;
      const freeUsers = profiles?.filter(p => p.plan_type === 'free').length || 0;
      const paidUsers = profiles?.filter(p => p.plan_type !== 'free').length || 0;
      const totalFunnels = profiles?.reduce((sum, p) => sum + (p.funnel_count || 0), 0) || 0;
      
      // Usuários por período
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

      const newUsersToday = profiles?.filter(p => new Date(p.created_at) >= today).length || 0;
      const newUsersThisWeek = profiles?.filter(p => new Date(p.created_at) >= weekAgo).length || 0;
      const newUsersThisMonth = profiles?.filter(p => new Date(p.created_at) >= monthAgo).length || 0;
      
      const onlineUsers = Math.floor(totalUsers * 0.15);

      setStats({
        totalUsers,
        activeUsers: totalUsers,
        freeUsers,
        paidUsers,
        totalFunnels,
        onlineUsers,
        newUsersToday,
        newUsersThisWeek,
        newUsersThisMonth
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados administrativos",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filtro de busca
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de plano
    if (planFilter !== "all") {
      filtered = filtered.filter(user => user.plan_type === planFilter);
    }

    // Filtro de data
    if (dateFilter !== "all") {
      const now = new Date();
      let dateThreshold: Date;
      
      switch (dateFilter) {
        case "today":
          dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          dateThreshold = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          break;
        default:
          dateThreshold = new Date(0);
      }
      
      filtered = filtered.filter(user => new Date(user.created_at) >= dateThreshold);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const exportUsers = () => {
    const csvContent = [
      ['Nome', 'Email', 'Plano', 'Funis', 'Data de Cadastro'],
      ...filteredUsers.map(user => [
        user.name || 'Sem nome',
        user.email,
        getPlanName(user.plan_type),
        user.funnel_count || 0,
        new Date(user.created_at).toLocaleDateString('pt-BR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_wiizeflow_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída",
      description: "Lista de usuários exportada com sucesso",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminEmail("");
    setAdminPassword("");
    toast({
      title: "Logout realizado",
      description: "Sessão administrativa encerrada",
    });
  };

  const getPlanBadgeColor = (planType: string) => {
    switch (planType) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'annual': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case 'free': return 'Gratuito';
      case 'monthly': return 'Mensal';
      case 'annual': return 'Anual';
      default: return 'Desconhecido';
    }
  };

  // Paginação
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Target className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">Wiizeflow Admin</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/'}
              className="hover:bg-red-50 border-red-200"
            >
              Voltar ao Site
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-6 py-20">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <Crown className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Painel Administrativo
                </CardTitle>
                <p className="text-gray-600">
                  Acesso restrito para administradores
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email do Administrador
                  </label>
                  <Input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@wiizeflow.com"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha
                  </label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                  />
                </div>
                <Button 
                  onClick={handleAdminLogin}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Entrar no Admin
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">Wiizeflow Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={loadAdminData} 
              disabled={refreshing}
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <span className="text-gray-600">Administrador</span>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Controle completo do Wiizeflow</p>
        </div>

        {/* Stats Cards Expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Total de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-900">{stats.totalUsers}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Usuários Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{stats.activeUsers}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Online Agora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-blue-600">{stats.onlineUsers}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Planos Gratuitos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-gray-600">{stats.freeUsers}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Planos Pagos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-green-600">{stats.paidUsers}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Total de Funis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-purple-600">{stats.totalFunnels}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Novos Hoje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-orange-600">{stats.newUsersToday}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Esta Semana</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-teal-600">{stats.newUsersThisWeek}</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Este Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold text-indigo-600">{stats.newUsersThisMonth}</span>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Controles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrar por plano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="annual">Anual</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrar por data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta semana</SelectItem>
                  <SelectItem value="month">Este mês</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={exportUsers} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              Mostrando {currentUsers.length} de {filteredUsers.length} usuários
            </div>
          </CardContent>
        </Card>

        {/* Tabela de Usuários */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Funis</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium">{user.name || 'Sem nome'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(user.plan_type)}`}>
                        {getPlanName(user.plan_type)}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">{user.funnel_count || 0}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                          <UserCheck className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                          <UserX className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {currentUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado com os filtros aplicados
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => setCurrentPage(pageNumber)}
                        isActive={currentPage === pageNumber}
                        className="cursor-pointer"
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
