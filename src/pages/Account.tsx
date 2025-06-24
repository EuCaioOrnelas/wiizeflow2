
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, LogOut, Camera, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Account = () => {
  const [user, setUser] = useState<any>(null);
  const [funnelsCount, setFunnelsCount] = useState(0);
  const [funnelsLimit, setFunnelsLimit] = useState(2);
  const [currentPlan, setCurrentPlan] = useState('Gratuito');
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      window.location.href = '/';
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setNewName(parsedUser.name);

    // Load user settings
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      setFunnelsCount(funnels.length);
    }

    // Load plan info (simulated - in real app this would come from backend)
    const planInfo = localStorage.getItem('userPlan');
    if (planInfo) {
      const plan = JSON.parse(planInfo);
      setCurrentPlan(plan.name);
      setFunnelsLimit(plan.funnelLimit);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('funnels');
    localStorage.removeItem('userPlan');
    window.location.href = '/';
  };

  const handleSaveProfile = () => {
    if (newName.trim()) {
      const updatedUser = { ...user, name: newName.trim() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    }
  };

  const handleChangePassword = () => {
    if (newPassword.length >= 6) {
      // In a real app, this would make an API call
      setNewPassword('');
      toast({
        title: "Senha alterada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } else {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Gratuito': return 'text-gray-600 bg-gray-100';
      case 'Mensal': return 'text-blue-600 bg-blue-100';
      case 'Anual': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">FunnelWiize</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
              Dashboard
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Minha Conta</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Alterar Foto
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome</Label>
                    {isEditing ? (
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id="name"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                        <Button onClick={handleSaveProfile} size="sm" className="bg-green-600 hover:bg-green-700">Salvar</Button>
                        <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-gray-900">{user.name}</span>
                        <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} disabled className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="password">Nova Senha</Label>
                    <div className="flex space-x-2 mt-1">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite sua nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button onClick={handleChangePassword} size="sm" className="bg-green-600 hover:bg-green-700">
                        Alterar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan & Usage Card */}
            <Card>
              <CardHeader>
                <CardTitle>Plano Atual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPlanColor(currentPlan)}`}>
                  {currentPlan}
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Funis criados</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{funnelsCount}</span>
                    <span className="text-sm text-gray-500">
                      {typeof funnelsLimit === 'number' ? `de ${funnelsLimit}` : funnelsLimit}
                    </span>
                  </div>
                  {typeof funnelsLimit === 'number' && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(funnelsCount / funnelsLimit) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>

                {typeof funnelsLimit === 'number' && funnelsCount >= funnelsLimit && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-800 text-sm">
                      Você atingiu o limite do seu plano. Faça upgrade para continuar criando funis.
                    </p>
                  </div>
                )}

                <Button onClick={handleUpgrade} className="w-full bg-green-600 hover:bg-green-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {currentPlan === 'Gratuito' ? 'Fazer Upgrade' : 'Gerenciar Plano'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Account;
