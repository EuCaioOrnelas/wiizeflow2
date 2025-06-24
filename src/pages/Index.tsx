
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Target, Zap, Users, ArrowRight, BarChart3, 
         TrendingUp, Heart, Clock, Globe, Shield, Award, 
         Play, ChevronRight, MessageCircle, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { usePayment } from "@/hooks/usePayment";

const Index = () => {
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' as 'login' | 'signup' });
  const [user, setUser] = useState<any>(null);
  const { createPayment, loading } = usePayment();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/3b925cd0-3804-4ad5-a91c-5ca756868f59.png" alt="WiizeFlow Logo" className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-900">WiizeFlow</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => window.location.href = '/contact'}>
              Contato
            </Button>
            <Button variant="outline" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>
              Login
            </Button>
            <Button onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} className="bg-green-600 hover:bg-green-700">
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-8">
            <img src="/lovable-uploads/3b925cd0-3804-4ad5-a91c-5ca756868f59.png" alt="WiizeFlow Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crie Funis Visuais de Alta Conversão
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Transforme suas ideias em funis de vendas poderosos com nossa ferramenta intuitiva de
            arrastar e soltar.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} className="bg-green-600 hover:bg-green-700">
              Começar Grátis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/pricing'}>
              Ver Planos
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Por que escolher o WiizeFlow?
            </h2>
            <p className="text-gray-600">
              Nossa plataforma oferece tudo que você precisa para criar funis de vendas eficazes e
              aumentar suas conversões.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-center">Análise de Métricas</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Acompanhe o desempenho do seu funil em tempo real e tome decisões baseadas em dados.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <TrendingUp className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-center">Otimização Contínua</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Identifique gargalos e oportunidades de melhoria para maximizar suas conversões.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Heart className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <CardTitle className="text-center">Fácil de Usar</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Interface intuitiva e amigável, perfeita para quem não tem experiência em design ou
                programação.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="w-10 h-10 text-yellow-600 mx-auto mb-4" />
                <CardTitle className="text-center">Economize Tempo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Crie funis completos em minutos, sem precisar gastar horas em tarefas complexas.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Globe className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-center">Acesso de Qualquer Lugar</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Plataforma 100% online, acesse seus funis de qualquer dispositivo com conexão à
                internet.
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
                <CardTitle className="text-center">Segurança Garantida</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                Seus dados estão protegidos com a mais alta tecnologia de segurança.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              O que nossos clientes estão dizendo
            </h2>
            <p className="text-gray-600">
              Veja como o WiizeFlow tem ajudado empresas de todos os portes a aumentar suas vendas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <CardTitle>Maria Silva</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                "O WiizeFlow me ajudou a organizar minhas ideias e criar um funil de vendas que realmente
                funciona. Recomendo!"
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <CardTitle>João Santos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                "Nunca foi tão fácil criar um funil de vendas. Com o WiizeFlow, consigo visualizar todo
                o processo e otimizar cada etapa."
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Comece a criar seus funis de vendas agora mesmo!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Experimente o WiizeFlow gratuitamente e descubra como é fácil transformar suas ideias em
            resultados.
          </p>
          <Button size="lg" onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} className="bg-green-600 hover:bg-green-700">
            Começar Grátis
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nossos planos
            </h2>
            <p className="text-gray-600">
              Escolha o plano que melhor se adapta às suas necessidades e comece a aumentar suas
              vendas hoje mesmo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Plano Gratuito</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Ideal para quem está começando e quer experimentar a plataforma.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Até 2 funis</li>
                  <li>Recursos básicos</li>
                  <li>Suporte limitado</li>
                </ul>
                <Button onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })} className="w-full bg-green-600 hover:bg-green-700">Começar Grátis</Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Plano Premium</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Para quem precisa de mais recursos e suporte prioritário.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Funis ilimitados</li>
                  <li>Recursos avançados</li>
                  <li>Suporte prioritário</li>
                </ul>
                <Button onClick={() => window.location.href = '/pricing'} className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-center">Plano Business</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">
                  Solução completa para empresas que querem escalar suas vendas.
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6">
                  <li>Funis ilimitados</li>
                  <li>Recursos avançados</li>
                  <li>Suporte VIP</li>
                </ul>
                <Button onClick={() => window.location.href = '/pricing'} className="w-full bg-green-600 hover:bg-green-700">Ver Detalhes</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/lovable-uploads/3b925cd0-3804-4ad5-a91c-5ca756868f59.png" alt="WiizeFlow Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold">WiizeFlow</span>
              </div>
              <p className="text-gray-300 mb-4 leading-relaxed">
                A primeira plataforma brasileira para criar funis de vendas visuais e profissionais.
              </p>
              <div className="space-y-2">
                <p className="text-gray-300">
                  <strong>Vendas:</strong> vendas@wiizeflow.com
                </p>
                <p className="text-gray-300">
                  <strong>Suporte:</strong> suporte@wiizeflow.com
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Links Úteis</h3>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Início</a></li>
                <li><a href="/pricing" className="text-gray-300 hover:text-blue-400 transition-colors">Planos</a></li>
                <li>{user ? <a href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">Dashboard</a> : <Button variant="link" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>Dashboard</Button>}</li>
                <li>{user ? <a href="/account" className="text-gray-300 hover:text-blue-400 transition-colors">Minha Conta</a> : <Button variant="link" onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}>Minha Conta</Button>}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-300 hover:text-blue-400 transition-colors">Termos de Uso</a></li>
                <li><a href="/privacy" className="text-gray-300 hover:text-blue-400 transition-colors">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} WiizeFlow. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        mode={authModal.mode} 
        onSwitchMode={(mode) => setAuthModal({ isOpen: true, mode })} 
      />
    </div>
  );
};

export default Index;
