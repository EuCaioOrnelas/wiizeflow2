
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Target, LogOut, Users, BarChart3, Activity, Eye, Crown } from "lucide-react";
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
    onlineUsers: 0
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const { toast } = useToast();

  const ADMIN_EMAIL = "admin@wiizeflow.com";
  const ADMIN_PASSWORD = "WiizeAdmin2024!";

  useEffect(() => {
    checkAuthStatus();
  }, []);

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
    try {
      // Buscar todos os perfis de usuários
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading profiles:', error);
        return;
      }

      setUsers(profiles || []);

      // Calcular estatísticas
      const totalUsers = profiles?.length || 0;
      const freeUsers = profiles?.filter(p => p.plan_type === 'free').length || 0;
      const paidUsers = profiles?.filter(p => p.plan_type !== 'free').length || 0;
      const totalFunnels = profiles?.reduce((sum, p) => sum + (p.funnel_count || 0), 0) || 0;
      
      // Simular usuários online (em uma aplicação real, isso viria de um sistema de presença)
      const onlineUsers = Math.floor(totalUsers * 0.15); // 15% dos usuários online

      setStats({
        totalUsers,
        activeUsers: totalUsers, // Assumindo que todos são ativos por enquanto
        freeUsers,
        paidUsers,
        totalFunnels,
        onlineUsers
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados administrativos",
        variant: "destructive",
      });
    }
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
        {/* Header */}
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

        {/* Login Form */}
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
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-gray-900">Wiizeflow Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Administrador</span>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-600">Visão geral e controle do Wiizeflow</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
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
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Usuários Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Plano</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Funis</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cadastro</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-gray-600">
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{user.name || 'Sem nome'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPlanBadgeColor(user.plan_type)}`}>
                          {getPlanName(user.plan_type)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.funnel_count || 0}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum usuário encontrado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
