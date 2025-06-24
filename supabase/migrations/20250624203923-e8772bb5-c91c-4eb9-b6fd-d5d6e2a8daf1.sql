
-- Criar tabela para armazenar funis de vendas
CREATE TABLE public.funnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  canvas_data JSONB DEFAULT '{"nodes": [], "edges": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela funnels
ALTER TABLE public.funnels ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para funnels
CREATE POLICY "Users can view their own funnels" 
  ON public.funnels 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can create their own funnels" 
  ON public.funnels 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own funnels" 
  ON public.funnels 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own funnels" 
  ON public.funnels 
  FOR DELETE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at quando um funnel for modificado
CREATE TRIGGER update_funnels_updated_at 
    BEFORE UPDATE ON public.funnels 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Atualizar a função handle_new_user para inicializar funnel_count corretamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, plan_type, funnel_count)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'name',
    NEW.email,
    'free',
    0
  );
  RETURN NEW;
END;
$$;
