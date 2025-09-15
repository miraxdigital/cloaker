# Router de Redirecionamento

Sistema de redirecionamento baseado em parâmetros de query, otimizado para deploy serverless.

## Como Usar

### URLs de Acesso
- `https://seu-dominio.com/` - Redirecionamento padrão
- `https://seu-dominio.com/?source=A` - Redireciona para SITE_A_URL
- `https://seu-dominio.com/?source=B` - Redireciona para SITE_B_URL
- `https://seu-dominio.com/health` - Status do sistema

### Parâmetros Suportados
- `source=A` ou `source=landing` → SITE_A_URL
- `source=B` ou `source=quiz` → SITE_B_URL
- Sem parâmetro → SITE_A_URL (padrão)

## Configuração

### Variáveis de Ambiente
```bash
SITE_A_URL=https://seu-site-principal.com
SITE_B_URL=https://seu-site-quiz.com
PORT=3000
```

### Deploy Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel Vercel
3. Deploy automático

### Deploy Netlify
1. Configure as variáveis no painel Netlify
2. Use comando de build: `npm install`
3. Diretório de publicação: `./`

## Estrutura

```
/router-project
  ├── index.js              # Servidor principal
  ├── middleware/
  │   ├── detection.js      # Detecção e análise de requisições
  │   └── logger.js         # Sistema de logs
  ├── config/
  │   └── routes.js         # Configuração de rotas
  ├── vercel.json           # Configuração Vercel
  └── .env.example          # Exemplo de variáveis
```

## Características Técnicas

- ✅ Redirecionamentos 302 (temporários)
- ✅ Headers de segurança (no-cache, no-referrer)
- ✅ Logs detalhados de requisições
- ✅ Tempo de resposta < 200ms
- ✅ Configuração via variáveis de ambiente
- ✅ Health check endpoint
- ✅ Tratamento de erros

## Logs

O sistema registra:
- IP e User-Agent dos visitantes
- Source parameter utilizado
- URLs de redirecionamento
- Tempo de resposta
- Erros e 404s

## Desenvolvimento Local

```bash
npm install
npm run dev
```

Acesse: `http://localhost:3000/?source=A`