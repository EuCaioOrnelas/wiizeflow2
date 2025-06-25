
# Deploy no Vercel - Configuração Completa

## 1. Configurações no Supabase Dashboard

Acesse: https://supabase.com/dashboard/project/ndrxhyrjjybnsohxykbq/auth/url-configuration

### Site URL
```
https://seu-projeto.vercel.app
```

### Redirect URLs (adicione todas estas URLs):
```
https://seu-projeto.vercel.app/
https://seu-projeto.vercel.app/**
https://seu-projeto.vercel.app/auth
https://seu-projeto.vercel.app/dashboard
http://localhost:5173/**
http://localhost:3000/**
```

## 2. Variáveis de Ambiente no Vercel

No seu projeto no Vercel, vá para Settings > Environment Variables e adicione:

```
VITE_SUPABASE_URL=https://ndrxhyrjjybnsohxykbq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kcnhoeXJqanlibnNvaHh5a2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTUwNDUsImV4cCI6MjA2NjM3MTA0NX0.4-Vnbjv4EzCs38O8GrcqqiPrU4_trJEP-n463jwoqZs
```

## 3. Secrets do Supabase (Edge Functions)

Verifique se estas secrets estão configuradas:
- STRIPE_SECRET_KEY
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

## 4. Comandos de Deploy

```bash
# 1. Fazer commit das mudanças
git add .
git commit -m "Configure for Vercel deployment"

# 2. Push para seu repositório
git push origin main

# 3. Conectar no Vercel (se ainda não conectou)
# Vá para vercel.com e conecte seu repositório GitHub
```

## 5. Após o Deploy

1. Atualize a Site URL no Supabase com sua URL real do Vercel
2. Teste o login/registro
3. Teste os pagamentos

## 6. Troubleshooting

### Erro "Invalid URL" ou "Redirect URL not allowed"
- Verifique se adicionou todas as URLs de redirecionamento no Supabase
- Certifique-se que a Site URL está correta

### Edge Functions não funcionam
- Verifique se as secrets estão configuradas no Supabase
- Verifique os logs das Edge Functions no dashboard

### Emails de confirmação com links errados
- Verifique se a Site URL no Supabase está correta
- Para desenvolvimento, use localhost:5173
- Para produção, use sua URL do Vercel

## URLs Importantes

- Supabase Dashboard: https://supabase.com/dashboard/project/ndrxhyrjjybnsohxykbq
- URL Configuration: https://supabase.com/dashboard/project/ndrxhyrjjybnsohxykbq/auth/url-configuration
- Edge Functions: https://supabase.com/dashboard/project/ndrxhyrjjybnsohxykbq/functions
- Secrets: https://supabase.com/dashboard/project/ndrxhyrjjybnsohxykbq/settings/functions
```
