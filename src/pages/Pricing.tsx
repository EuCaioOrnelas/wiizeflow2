
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Target, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "R$0",
      period: "/mês",
      funnelLimit: 2,
      features: [
        "Até 2 funis",
        "Sem cartão de crédito",
        "Funcionalidades básicas"
      ],
      buttonText: "Começar grátis",
      buttonAction: () => window.location.href = '/',
      popular: false
    },
    {
      name: "Start",
      price: "R$9",
      period: "/mês",
      funnelLimit: 5,
      features: [
        "Até 5 funis",
        "Suporte básico",
        "Templates inclusos"
      ],
      buttonText: "Assinar com Stripe",
      buttonAction: () => alert("Integração com Stripe em breve"),
      popular: false
    },
    {
      name: "Pro",
      price: "R$19",
      period: "/mês",
      funnelLimit: 10,
      features: [
        "Até 10 funis",
        "Suporte priorizado",
        "Analytics avançado"
      ],
      buttonText: "Assinar com Stripe",
      buttonAction: () => alert("Integração com Stripe em breve"),
      popular: true
    },
    {
      name: "Wiize Max",
      price: "R$39",
      period: "/mês",
      funnelLimit: "Ilimitados",
      features: [
        "Funis ilimitados",
        "Suporte completo",
        "Acesso antecipado a funções novas",
        "Consultoria personalizada"
      ],
      buttonText: "Assinar com Stripe",
      buttonAction: () => alert("Integração com Stripe em breve"),
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Target className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FunnelWiize</span>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="hover:bg-blue-50"
          >
            Voltar ao Início
          </Button>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano e comece a criar seus funis agora mesmo
          </h1>
          <p className="text-xl text-gray-600">
            Planos flexíveis para todos os tipos de negócio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 scale-105' : 'border border-gray-200'} hover:shadow-lg transition-all duration-200`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">{plan.period}</span>
                </div>
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
                </ul>

                <Button 
                  onClick={plan.buttonAction}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : plan.name === 'Free' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 max-w-3xl mx-auto">
          <p className="text-gray-600 mb-4">
            ✨ Todos os planos incluem acesso completo às funcionalidades de criação de funis
          </p>
          <p className="text-gray-600">
            🔒 Pagamento seguro processado pelo Stripe • Cancele a qualquer momento
          </p>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
