
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Target, Zap, Users, ArrowRight } from "lucide-react";

const Sales = () => {
  const handleGetStarted = () => {
    window.location.href = '/pricing';
  };

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

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Você está perdendo vendas
            <span className="text-red-600 block">todos os dias e nem sabe disso.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Descubra como transformar sua presença digital em uma máquina de atrair clientes 
            sem gastar com anúncios, agências ou plataformas complicadas.
          </p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Você tem um bom produto ou serviço, mas mesmo assim:
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">😔</div>
                <p className="text-gray-700">As pessoas da sua cidade nem sabem que seu negócio existe.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">🤝</div>
                <p className="text-gray-700">Você depende de indicações ou do "boca a boca".</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-red-500 text-4xl mb-4">🔍</div>
                <p className="text-gray-700">Seu concorrente aparece no Google e você não.</p>
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
              Apresentamos o <span className="text-blue-600">FunnelWiize</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Um passo a passo prático para você colocar sua empresa no topo das buscas do Google, 
              atraindo novos clientes todos os dias, mesmo que você não entenda nada de internet.
            </p>

            {/* Benefits */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Criar ou otimizar seu perfil no Google Meu Negócio</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Aparecer no mapa da sua cidade quando alguém procura por seu serviço</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Receber avaliações e subir nas buscas</p>
              </div>
              <div className="flex items-start space-x-3 text-left">
                <Check className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <p className="text-gray-700">Atrair clientes prontos para comprar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Para quem é isso?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-700 p-6 rounded-lg">
                <Check className="w-8 h-8 text-green-400 mb-4 mx-auto" />
                <p>Empresários locais que não querem depender de redes sociais</p>
              </div>
              <div className="bg-blue-700 p-6 rounded-lg">
                <Check className="w-8 h-8 text-green-400 mb-4 mx-auto" />
                <p>Profissionais que estão cansados de "apostar" em tráfego pago</p>
              </div>
              <div className="bg-blue-700 p-6 rounded-lg">
                <Check className="w-8 h-8 text-green-400 mb-4 mx-auto" />
                <p>Quem quer vender mais, sem complicações</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Baixe agora o FunnelWiize e dê o primeiro passo para aumentar suas vendas
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Com o que você já tem hoje.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Quero Atrair Clientes Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm border-2 border-green-200">
              <Star className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Garantia</h3>
              <p className="text-gray-700 mb-4">
                Funciona para qualquer tipo de negócio físico: barbearia, salão, oficina, 
                consultório, loja, clínica, etc.
              </p>
              <p className="text-gray-700">
                Você aplica hoje e já começa a ver resultado nos próximos dias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sales;
