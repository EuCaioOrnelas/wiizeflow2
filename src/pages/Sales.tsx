
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Target, Zap, Users, ArrowRight, BarChart3, 
         MousePointer, Palette, Download, Eye, Lightbulb, Trophy, Shield } from "lucide-react";

const Sales = () => {
  const handleGetStarted = () => {
    window.location.href = '/pricing';
  };

  const features = [
    {
      icon: <MousePointer className="w-8 h-8 text-blue-600" />,
      title: "Editor Visual Intuitivo",
      description: "Arraste, solte e conecte elementos com facilidade. Sem código, sem complicação."
    },
    {
      icon: <Palette className="w-8 h-8 text-green-600" />,
      title: "Templates Profissionais",
      description: "Centenas de templates prontos para diferentes segmentos e objetivos de negócio."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Análise de Conversão",
      description: "Visualize gargalos e oportunidades de otimização em tempo real."
    },
    {
      icon: <Download className="w-8 h-8 text-orange-600" />,
      title: "Exportação Flexível",
      description: "Exporte seus funis como PDF, imagem ou compartilhe online com sua equipe."
    },
    {
      icon: <Eye className="w-8 h-8 text-red-600" />,
      title: "Visualização Clara",
      description: "Entenda toda a jornada do cliente de forma visual e objetiva."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Criação Rápida",
      description: "Crie funis profissionais em minutos, não em horas ou dias."
    }
  ];

  const benefits = [
    {
      icon: <Trophy className="w-6 h-6 text-yellow-600" />,
      title: "Aumente suas Conversões",
      description: "Identifique pontos de abandono e otimize sua estratégia para converter mais."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-600" />,
      title: "Economize Tempo e Dinheiro",
      description: "Pare de contratar agências caras. Crie seus próprios funis em minutos."
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-blue-600" />,
      title: "Tome Decisões Inteligentes",
      description: "Baseie suas estratégias em dados visuais claros e objetivos."
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Empreendedora Digital",
      content: "O FunnelWiize revolucionou minha forma de entender o negócio. Agora vejo claramente onde perco clientes.",
      rating: 5
    },
    {
      name: "João Santos",
      role: "Consultor de Marketing",
      content: "Economizei milhares em agências. Agora crio funis profissionais em casa mesmo.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "E-commerce Owner",
      content: "Triplicou minhas conversões em 2 meses. Ferramenta indispensável para qualquer negócio online.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FunnelWiize</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/'}>
              Início
            </Button>
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Crie Funis de Vendas 
                <span className="text-blue-600 block">Visuais e Profissionais</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Mapeie toda a jornada do seu cliente, identifique gargalos e otimize suas conversões 
                com nossa plataforma visual intuitiva. Sem código, sem complicação.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                >
                  Criar Meu Primeiro Funil
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  Ver Demonstração
                </Button>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-1" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-1" />
                  Começe grátis hoje
                </div>
                <div className="flex items-center">
                  <Check className="w-4 h-4 text-green-600 mr-1" />
                  Cancele quando quiser
                </div>
              </div>
            </div>
            <div className="lg:text-center">
              <div className="bg-white p-6 rounded-2xl shadow-2xl">
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                    <p className="text-gray-600">Preview do Editor Visual</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Interface intuitiva de arrastar e soltar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Você está perdendo clientes e nem sabe onde
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A maioria dos empreendedores não consegue visualizar onde os clientes abandonam o processo de compra
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-xl font-semibold mb-2">Vendas Inconsistentes</h3>
              <p className="text-gray-600">Você não sabe exatamente onde seus clientes desistem de comprar</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl mb-4">🤯</div>
              <h3 className="text-xl font-semibold mb-2">Processos Confusos</h3>
              <p className="text-gray-600">Sua estratégia de vendas é difícil de explicar para a equipe</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-xl font-semibold mb-2">Dinheiro Desperdiçado</h3>
              <p className="text-gray-600">Você gasta com tráfego mas não otimiza as conversões</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Apresentamos o <span className="text-blue-600">FunnelWiize</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A primeira plataforma brasileira para criar funis visuais de forma simples e profissional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Transforme seu negócio com funis visuais
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 mb-8">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MousePointer className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Screenshot do Sistema em Ação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              O que nossos clientes estão dizendo
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para criar seu primeiro funil?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de empreendedores que já transformaram seus negócios
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
          >
            Começar Gratuitamente Agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <p className="text-sm mt-4 opacity-75">
            Sem cartão de crédito • Cancele quando quiser
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preciso saber programar para usar?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Não! O FunnelWiize foi criado para ser usado por qualquer pessoa, sem conhecimento técnico. Tudo é visual e intuitivo.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posso cancelar a qualquer momento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sim, você pode cancelar sua assinatura a qualquer momento. Não há contratos ou taxas de cancelamento.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existe suporte em português?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Sim! Nosso suporte é 100% em português brasileiro, com atendimento rápido e especializado.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sales;
