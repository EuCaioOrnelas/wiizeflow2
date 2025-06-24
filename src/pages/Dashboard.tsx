import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Target, LogOut, Edit3, User, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [funnels, setFunnels] = useState<any[]>([]);
  const [funnelsLimit, setFunnelsLimit] = useState<number | string>(2);
  const [currentPlan, setCurrentPlan] = useState('Gratuito');
  const [hasTemplateAccess, setHasTemplateAccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load saved funnels
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      setFunnels(JSON.parse(savedFunnels));
    }

    // Load plan info (simulated - in real app this would come from backend)
    const planInfo = localStorage.getItem('userPlan');
    if (planInfo) {
      const plan = JSON.parse(planInfo);
      setCurrentPlan(plan.name);
      setFunnelsLimit(plan.funnelLimit);
      setHasTemplateAccess(plan.hasTemplateAccess);
    } else {
      // Default free plan
      setCurrentPlan('Gratuito');
      setFunnelsLimit(2);
      setHasTemplateAccess(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('funnels');
    localStorage.removeItem('userPlan');
    window.location.href = '/';
  };

  const createNewFunnel = () => {
    const isLimitReached = typeof funnelsLimit === 'number' && funnels.length >= funnelsLimit;
    
    if (isLimitReached) {
      toast({
        title: "Limite atingido",
        description: "Você atingiu o limite do seu plano gratuito. Faça upgrade para continuar criando funis.",
        variant: "destructive",
      });
      return;
    }

    const newFunnel = {
      id: Date.now().toString(),
      name: `Funil ${funnels.length + 1}`,
      createdAt: new Date().toISOString(),
      blocks: [],
      connections: []
    };
    
    const updatedFunnels = [...funnels, newFunnel];
    setFunnels(updatedFunnels);
    localStorage.setItem('funnels', JSON.stringify(updatedFunnels));
    
    // Redirect to builder
    window.location.href = `/builder/${newFunnel.id}`;
  };

  const openFunnel = (funnelId: string) => {
    window.location.href = `/builder/${funnelId}`;
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const handleAccount = () => {
    window.location.href = '/account';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Gratuito': return 'text-gray-600 bg-gray-100';
      case 'Mensal': return 'text-blue-600 bg-blue-100';
      case 'Anual': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPlanBenefits = (plan: string) => {
    switch (plan) {
      case 'Gratuito':
        return {
          funnelLimit: 2,
          templates: false,
          support: 'Email básico'
        };
      case 'Mensal':
        return {
          funnelLimit: 'Ilimitados',
          templates: true,
          support: 'Prioritário'
        };
      case 'Anual':
        return {
          funnelLimit: 'Ilimitados',
          templates: true,
          support: 'VIP + Consultoria'
        };
      default:
        return {
          funnelLimit: 2,
          templates: false,
          support: 'Email básico'
        };
    }
  };

  const getRemainingFunnels = () => {
    if (typeof funnelsLimit === 'string') {
      return "∞";
    }
    return Math.max(0, funnelsLimit - funnels.length);
  };

  const getProgressPercentage = () => {
    if (typeof funnelsLimit === 'string') {
      return 0;
    }
    return (funnels.length / funnelsLimit) * 100;
  };

  const isAtLimit = () => {
    return typeof funnelsLimit === 'number' && funnels.length >= funnelsLimit;
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  const planBenefits = getPlanBenefits(currentPlan);

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white border-b transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FunnelWiize</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanColor(currentPlan)}`}>
              Plano {currentPlan}
            </div>
            <span className="text-gray-600">Olá, {user.name}!</span>
            <Button variant="outline" onClick={handleAccount} size="sm">
              <User className="w-4 h-4 mr-2" />
              Conta
            </Button>
            <Button variant="outline" onClick={handleLogout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Funis Criados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{funnels.length}</span>
                <span className="text-sm text-gray-500">de {funnelsLimit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              {isAtLimit() && (
                <p className="text-xs text-orange-600 mt-2">Limite atingido</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Plano Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold">{currentPlan}</span>
                <Button onClick={handleUpgrade} size="sm" variant="outline">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Upgrade
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-xl font-bold">
                {hasTemplateAccess ? 'Disponível' : 'Bloqueado'}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {hasTemplateAccess ? 'Acesso completo' : 'Upgrade para usar'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-lg font-bold">
                {planBenefits.support}
              </span>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Funis</h1>
            <p className="text-gray-600">Crie e gerencie seus funis de vendas</p>
          </div>
          
          <Button 
            onClick={createNewFunnel} 
            className={`${isAtLimit() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={isAtLimit()}
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Funil
          </Button>
        </div>

        {/* Upgrade Banner for Free Plan */}
        {currentPlan === 'Gratuito' && (
          <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">🚀 Desbloqueie todo o potencial</h3>
                <p className="mb-2">Com os planos pagos você tem:</p>
                <ul className="text-sm space-y-1">
                  <li>• Funis ilimitados</li>
                  <li>• Acesso a todos os templates</li>
                  <li>• Suporte prioritário</li>
                  <li>• Análises detalhadas</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-white/20 p-4 rounded-lg mb-3">
                  <div className="text-2xl font-bold">R$ 47</div>
                  <div className="text-sm">por mês</div>
                </div>
                <Button onClick={handleUpgrade} variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                  Ver Planos
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Banner for Limit Reached */}
        {isAtLimit() && (
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Limite de funis atingido!</h3>
                <p>Você atingiu o limite do plano {currentPlan}. Faça upgrade para continuar criando funis!</p>
              </div>
              <Button onClick={handleUpgrade} variant="secondary">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Funnels Grid */}
        {funnels.length === 0 ? (
          <div className="text-center py-16">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhum funil criado ainda
            </h3>
            <p className="text-gray-500 mb-6">
              Comece criando seu primeiro funil de vendas
            </p>
            <Button onClick={createNewFunnel} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Funil
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {funnels.map((funnel) => (
              <Card key={funnel.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{funnel.name}</span>
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    Criado em {new Date(funnel.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    {funnel.blocks?.length || 0} blocos
                  </p>
                  <Button 
                    onClick={() => openFunnel(funnel.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                    variant="outline"
                  >
                    Abrir Funil
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
