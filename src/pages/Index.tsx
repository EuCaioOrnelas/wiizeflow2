
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthModal from "@/components/AuthModal";
import { ArrowRight, Target, Zap, Users, Check } from "lucide-react";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  const plans = [
    {
      name: "Gratuito",
      price: "R$0",
      period: "/sempre",
      funnelLimit: 2,
      features: [
        "Até 2 funis",
        "Editor visual básico",
        "Exportar como imagem/PDF",
        "Suporte por email"
      ],
      restrictions: [
        "Sem acesso aos templates"
      ],
      buttonText: "Começar grátis",
      buttonAction: handleGetStarted,
      popular: false
    },
    {
      name: "Mensal",
      price: "R$47",
      period: "/mês",
      funnelLimit: "Ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os templates inclusos",
        "Editor visual completo",
        "Suporte prioritário",
        "Análises detalhadas"
      ],
      restrictions: [],
      buttonText: "Assinar Mensal",
      buttonAction: () => window.location.href = '/sales',
      popular: false
    },
    {
      name: "Anual",
      price: "R$397",
      period: "/ano",
      originalPrice: "R$564",
      savings: "30% OFF",
      funnelLimit: "Ilimitados",
      features: [
        "Funis ilimitados",
        "Todos os templates inclusos", 
        "Editor visual completo",
        "Suporte prioritário VIP",
        "Análises detalhadas",
        "Consultoria personalizada",
        "Acesso antecipado"
      ],
      restrictions: [],
      buttonText: "Assinar Anual",
      buttonAction: () => window.location.href = '/sales',
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">Wiizeflow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={handleLogin}
              className="hover:bg-green-50 border-green-200"
            >
              Fazer Login
            </Button>
            <Button 
              onClick={handleGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Criar Conta
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme Suas Ideias em
            <span className="text-green-600 block">Estratégias de Vendas Visuais</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie funis de vendas profissionais e planeje suas estratégias de marketing de forma visual e intuitiva. 
            Transforme visitantes em clientes com o poder da visualização estratégica.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Começar Grátis Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Você tem um bom produto ou serviço, mas:
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">😔</div>
                <p className="text-gray-700">Suas estratégias de marketing não estão organizadas</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">🤯</div>
                <p className="text-gray-700">Você não consegue visualizar o caminho do cliente</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">📉</div>
                <p className="text-gray-700">Suas conversões estão abaixo do esperado</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Apresentamos o <span className="text-green-600">Wiizeflow</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              A ferramenta visual que ajuda empresários a planejar suas estratégias de marketing e 
              criar funis de vendas eficazes, mesmo sem conhecimento técnico.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Visualize toda sua estratégia de marketing em um só lugar</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Crie funis de vendas profissionais com drag & drop</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Planeje o caminho completo do seu cliente</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Identifique pontos de melhoria na sua estratégia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Interface Intuitiva</h3>
              <p className="text-green-100">
                Arraste e solte blocos para criar seus funis de forma visual e simples.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Planejamento Estratégico</h3>
              <p className="text-green-100">
                Organize suas ideias e transforme-as em estratégias concretas de marketing.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Foco no Cliente</h3>
              <p className="text-green-100">
                Mapeie a jornada completa do cliente e otimize cada ponto de contato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano e comece a criar seus funis agora mesmo
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis e escale conforme seu negócio cresce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-green-500 scale-105' : 'border border-gray-200'} hover:shadow-lg transition-all duration-200`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  
                  {plan.originalPrice && (
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-sm text-gray-400 line-through">{plan.originalPrice}</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                        {plan.savings}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {typeof plan.funnelLimit === 'number' ? `Até ${plan.funnelLimit} funis` : plan.funnelLimit + ' funis'}
                  </p>
                </CardHeader>

                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.restrictions?.map((restriction, restrictionIndex) => (
                      <li key={restrictionIndex} className="flex items-start">
                        <span className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-500">✗</span>
                        <span className="text-gray-500 text-sm">{restriction}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={plan.buttonAction}
                    className={`w-full ${plan.popular ? 'bg-green-600 hover:bg-green-700' : plan.name === 'Gratuito' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para transformar sua estratégia de marketing?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Comece gratuitamente e descubra como visualizar pode revolucionar seus resultados.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-green-600 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg"
          >
            Criar Conta Gratuita
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold">Wiizeflow</span>
              </div>
              <p className="text-gray-300 mb-4">
                A ferramenta visual que ajuda empresários a planejar estratégias de marketing e 
                criar funis de vendas eficazes. Transforme suas ideias em resultados concretos.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Contato:</strong> contato@wiizeflow.com
                </p>
                <p className="text-gray-300">
                  <strong>Suporte:</strong> suporte@wiizeflow.com
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-300 hover:text-green-400 transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="/sales" className="text-gray-300 hover:text-green-400 transition-colors">
                    Planos
                  </a>
                </li>
                <li>
                  <a href="/dashboard" className="text-gray-300 hover:text-green-400 transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/account" className="text-gray-300 hover:text-green-400 transition-colors">
                    Minha Conta
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/terms" className="text-gray-300 hover:text-green-400 transition-colors">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-300 hover:text-green-400 transition-colors">
                    Política de Privacidade
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Wiizeflow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        mode={authMode}
        onSwitchMode={(mode) => setAuthMode(mode)}
      />
    </div>
  );
};

export default Index;
