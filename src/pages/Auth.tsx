
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Target, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Validação de senha forte
  const passwordValidation = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Configurar listener de mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (!isMounted) return;
            
            console.log('Auth state changed:', event, session?.user?.id);
            setSession(session);
            setUser(session?.user ?? null);
            
            if (session?.user && event !== 'SIGNED_OUT') {
              console.log('User authenticated, redirecting to dashboard');
              navigate('/dashboard', { replace: true });
            }
          }
        );

        // Verificar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          console.log('Existing session found, redirecting to dashboard');
          setSession(session);
          setUser(session.user);
          navigate('/dashboard', { replace: true });
          return;
        }
        
        setIsInitializing(false);
        
        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeAuth();
    
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const updateProgress = (progress: number) => {
    setLoadingProgress(progress);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingProgress(0);

    try {
      updateProgress(20);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      updateProgress(60);

      if (error) {
        updateProgress(100);
        setLoading(false);
        
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erro de Login",
            description: "Email ou senha incorretos. Verifique suas credenciais e tente novamente.",
            variant: "destructive",
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de Login",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      updateProgress(80);

      if (data.user) {
        updateProgress(90);
        toast({
          title: "Login realizado!",
          description: "Redirecionando para o dashboard...",
        });
        
        updateProgress(100);
        
        // Aguardar um pouco para mostrar o progresso completo
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 500);
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      updateProgress(100);
      setLoading(false);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast({
        title: "Senha inválida",
        description: "Por favor, atenda a todos os requisitos de senha.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setLoadingProgress(0);

    try {
      updateProgress(20);
      
      const redirectUrl = `${window.location.origin}/`;
      
      updateProgress(40);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      updateProgress(80);

      if (error) {
        updateProgress(100);
        setLoading(false);
        
        if (error.message.includes('User already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está registrado. Tente fazer login ou use outro email.",
            variant: "destructive",
          });
        } else if (error.message.includes('Password should be at least')) {
          toast({
            title: "Senha muito fraca",
            description: "A senha deve atender aos requisitos de segurança.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message,
            variant: "destructive",
          });
        }
        return;
      }

      updateProgress(100);

      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar sua conta e fazer login.",
      });
      
      // Limpar formulário e voltar para login
      setEmail("");
      setPassword("");
      setName("");
      setIsLogin(true);
      setLoading(false);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      updateProgress(100);
      setLoading(false);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <div className="text-center">
          <Target className="w-12 h-12 text-green-600 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Inicializando...
          </h2>
          <p className="text-gray-600">
            Verificando sua sessão de autenticação.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Target className="w-10 h-10 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">Wiizeflow</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Fazer Login' : 'Criar Conta Gratuita'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Acesse sua conta e continue criando seus funis' 
              : 'Comece gratuitamente e transforme suas ideias em estratégias visuais'
            }
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                
                {!isLogin && password && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {passwordValidation.minLength ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.minLength ? 'text-green-600' : 'text-red-600'}`}>
                          Mínimo 8 caracteres
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasUpperCase ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 letra maiúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasLowerCase ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 letra minúscula
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasNumber ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 número
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {passwordValidation.hasSpecialChar ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                          Pelo menos 1 caractere especial (!@#$%^&*)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Barra de progresso durante carregamento */}
              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{isLogin ? 'Fazendo login...' : 'Criando conta...'}</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  <Progress value={loadingProgress} className="w-full" />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || (!isLogin && !isPasswordValid)}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>{isLogin ? 'Entrando...' : 'Criando...'}</span>
                  </div>
                ) : (
                  isLogin ? 'Entrar' : 'Criar Conta Gratuita'
                )}
              </Button>
            </form>
            
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  if (loading) return;
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setName("");
                  setLoadingProgress(0);
                }}
                className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
                disabled={loading}
              >
                {isLogin 
                  ? 'Não tem conta? Criar conta gratuita' 
                  : 'Já tem conta? Fazer login'
                }
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 text-sm disabled:opacity-50"
                disabled={loading}
              >
                Voltar para página inicial
              </button>
            </div>
          </CardContent>
        </Card>

        {!isLogin && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ao criar uma conta, você concorda com nossos{' '}
              <a href="/terms" className="text-green-600 hover:text-green-700">
                Termos de Uso
              </a>{' '}
              e{' '}
              <a href="/privacy" className="text-green-600 hover:text-green-700">
                Política de Privacidade
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
