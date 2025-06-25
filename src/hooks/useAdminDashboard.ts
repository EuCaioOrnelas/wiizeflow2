
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminStats {
  online_users: number;
  total_users: number;
  free_users: number;
  monthly_users: number;
  annual_users: number;
  projected_monthly_revenue: number;
}

export const useAdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardStats();
      // Refresh stats every 30 seconds
      const interval = setInterval(loadDashboardStats, 30000);
      return () => clearInterval(interval);
    } else if (loading === false && !isAdmin) {
      // Se não é admin e terminou de carregar, redirecionar para login admin
      navigate('/admin-auth');
    }
  }, [isAdmin, loading, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        setLoading(false);
        navigate('/admin-auth');
        return;
      }

      console.log('Checking admin status for user:', user.email);

      // Verificar diretamente se o email é o admin
      if (user.email === 'adminwiize@wiizeflow.com.br') {
        console.log('Admin user detected by email');
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Tentar verificar na tabela admin_users usando uma consulta SQL direta
      const { data: adminCheck, error } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Admin check result:', adminCheck, 'Error:', error);

      if (error) {
        console.error('Error checking admin status:', error);
        // Se houver erro na consulta, mas é o email admin, permitir acesso
        if (user.email === 'adminwiize@wiizeflow.com.br') {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
      }

      setIsAdmin(!!adminCheck);
      setLoading(false);

      if (!adminCheck && user.email !== 'adminwiize@wiizeflow.com.br') {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        navigate('/admin-auth');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      
      // Verificar se é o email admin mesmo com erro
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'adminwiize@wiizeflow.com.br') {
        setIsAdmin(true);
      }
      
      setLoading(false);
      
      if (!user || user.email !== 'adminwiize@wiizeflow.com.br') {
        navigate('/admin-auth');
      }
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Carregar estatísticas usando consultas diretas para evitar problemas de RLS
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('plan_type');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        // Usar dados mock se houver erro
        setStats({
          online_users: 0,
          total_users: 0,
          free_users: 0,
          monthly_users: 0,
          annual_users: 0,
          projected_monthly_revenue: 0,
        });
        return;
      }

      // Calcular estatísticas manualmente
      const totalUsers = profiles?.length || 0;
      const freeUsers = profiles?.filter(p => p.plan_type === 'free').length || 0;
      const monthlyUsers = profiles?.filter(p => p.plan_type === 'monthly').length || 0;
      const annualUsers = profiles?.filter(p => p.plan_type === 'annual').length || 0;
      
      const projectedRevenue = (monthlyUsers * 29.90) + (annualUsers * (299.90 / 12));

      setStats({
        online_users: 1, // Simulado
        total_users: totalUsers,
        free_users: freeUsers,
        monthly_users: monthlyUsers,
        annual_users: annualUsers,
        projected_monthly_revenue: projectedRevenue,
      });

    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar estatísticas.",
        variant: "destructive",
      });
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  return {
    stats,
    loading,
    isAdmin,
    logout,
    refreshStats: loadDashboardStats
  };
};
