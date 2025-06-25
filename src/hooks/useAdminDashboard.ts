
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
        setLoading(false);
        navigate('/admin-auth');
        return;
      }

      const { data: adminCheck } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .single();

      setIsAdmin(!!adminCheck);
      setLoading(false);

      if (!adminCheck) {
        toast({
          title: "Acesso Negado",
          description: "Você não tem permissão para acessar esta área.",
          variant: "destructive",
        });
        navigate('/admin-auth');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setLoading(false);
      navigate('/admin-auth');
    }
  };

  const loadDashboardStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_admin_dashboard_stats');

      if (error) {
        console.error('Error loading dashboard stats:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as estatísticas.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        setStats({
          online_users: Number(data[0].online_users),
          total_users: Number(data[0].total_users),
          free_users: Number(data[0].free_users),
          monthly_users: Number(data[0].monthly_users),
          annual_users: Number(data[0].annual_users),
          projected_monthly_revenue: Number(data[0].projected_monthly_revenue),
        });
      }
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
