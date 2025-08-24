# Router de Redirecionamento Simplificado por Parâmetro V

Sistema de redirecionamento inteligente baseado apenas no parâmetro `v` (variant/versão).

## Lógica de Redirecionamento SIMPLIFICADA

### Baseado em Dispositivo Móvel + parâmetro `v`:

- **📱 Mobile + v=a** → **SITE_A** (`https://quiz.pilatesencasa.lat`)
- **📱 Mobile + v=b** → **SITE_B** (`https://chas-bariatricos.vercel.app`)  
- **📱 Mobile + v=c** → **SITE_C** (`https://app.receitaviva.online/`)
- **💻 Desktop (qualquer parâmetro)** → **FALLBACK** (`https://app.receitaviva.online/`)
- **📱 Mobile sem parâmetro v** → **FALLBACK** (`https://app.receitaviva.online/`)
- **📱 Mobile + v=qualquer-outro-valor** → **FALLBACK** (`https://app.receitaviva.online/`)

## URLs Configuradas

```bash
SITE_A_URL=https://quiz.pilatesencasa.lat
SITE_B_URL=https://chas-bariatricos.vercel.app
SITE_C_URL=https://app.receitaviva.online/
FALLBACK_URL=https://app.receitaviva.online/
```

## Exemplos de Uso

### ✅ Mobile - Redireciona para SITE_A (Pilates en Casa)
```
https://seu-dominio.com/?v=a (Mobile)
https://seu-dominio.com/?v=A (Mobile)
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste&v=a (Mobile)
```

### ✅ Mobile - Redireciona para SITE_B (Chás Bariátricos)
```
https://seu-dominio.com/?v=b (Mobile)
https://seu-dominio.com/?v=B (Mobile)
https://seu-dominio.com/?utm_source=google&v=b&other_param=123 (Mobile)
```

### ✅ Mobile - Redireciona para SITE_C (Receita Viva)
```
https://seu-dominio.com/?v=c (Mobile)
https://seu-dominio.com/?v=C (Mobile)
https://seu-dominio.com/?v=c&utm_source=instagram (Mobile)
```

### ❌ Redireciona para FALLBACK (Receita Viva)
```
# Desktop (qualquer parâmetro)
https://seu-dominio.com/?v=a (Desktop)
https://seu-dominio.com/?v=b (Desktop)
https://seu-dominio.com/ (Desktop)

# Mobile sem parâmetro v
https://seu-dominio.com/ (Mobile)
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste (Mobile)

# Mobile com parâmetro v inválido
https://seu-dominio.com/?v=x (Mobile)
https://seu-dominio.com/?v=123 (Mobile)
https://seu-dominio.com/?v= (Mobile)
```

## Cenários Possíveis

| Dispositivo | Parâmetro v | Destino | URL | Observação |
|-------------|-------------|---------|-----|------------|
| 📱 Mobile | `v=a` | SITE_A | https://quiz.pilatesencasa.lat | Case insensitive |
| 📱 Mobile | `v=b` | SITE_B | https://chas-bariatricos.vercel.app | Case insensitive |
| 📱 Mobile | `v=c` | SITE_C | https://app.receitaviva.online/ | Case insensitive |
| 📱 Mobile | Ausente | FALLBACK | https://app.receitaviva.online/ | Mobile sem v |
| 📱 Mobile | Vazio (`v=`) | FALLBACK | https://app.receitaviva.online/ | Tratado como ausente |
| 📱 Mobile | Outro valor | FALLBACK | https://app.receitaviva.online/ | Valor não reconhecido |
| 💻 Desktop | Qualquer | FALLBACK | https://app.receitaviva.online/ | Desktop sempre fallback |

## Expansibilidade

Para adicionar novos sites, basta:

1. **Adicionar nova URL** no `.env`:
```bash
SITE_D_URL=https://novo-site.com
```

2. **Adicionar novo case** no `config/routes.js`:
```javascript
case 'd':
  return this.urls.SITE_D_URL;
```

3. **Exemplo de uso**:
```
https://seu-dominio.com/?v=d → https://novo-site.com
```

## Características Técnicas

- ✅ **Case insensitive**: `v=A` = `v=a`
- ✅ **Trim automático**: Remove espaços em branco
- ✅ **Fallback seguro**: Qualquer erro → FALLBACK_URL
- ✅ **Detecção de dispositivo**: Mobile vs Desktop
- ✅ **Logs detalhados**: Para debug e análise
- ✅ **Headers de segurança**: Cache-Control, Referrer-Policy, etc.
- ✅ **Tempo de resposta**: <30ms 
- ✅ **Lógica simplificada**: Dispositivo + 1 parâmetro
- ✅ **Facilmente expansível**: Novos sites com 1 linha de código

## Endpoints

- `GET /` - Redirecionamento principal
- `GET /debug` - Informações de debug (JSON)
- `GET /health` - Status do sistema

## Logs Simplificados

```
[REDIRECT LOGIC] Mobile: true, v parameter: a
[VARIANT CHECK] Parameter 'v': a (normalized: a)
[VARIANT CHECK] v=a -> SITE_A (Pilates en Casa)
[REDIRECT DECISION] Mobile + v=a -> SITE_A (Pilates en Casa)
```

## Deploy

### Netlify
```bash
# Configure as variáveis de ambiente
SITE_A_URL=https://quiz.pilatesencasa.lat
SITE_B_URL=https://chas-bariatricos.vercel.app
SITE_C_URL=https://app.receitaviva.online/
FALLBACK_URL=https://app.receitaviva.online/
```

### Teste Local
```bash
npm install
npm run dev

# Teste Mobile v=a (SITE_A)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "http://localhost:3000/?v=a"

# Teste Mobile v=b (SITE_B)  
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "http://localhost:3000/?v=b"

# Teste Mobile v=c (SITE_C)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "http://localhost:3000/?v=c"

# Teste Desktop (FALLBACK)
curl "http://localhost:3000/"

# Teste Mobile sem v (FALLBACK)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" "http://localhost:3000/"
```

## Vantagens da Nova Lógica

- 🚀 **Performance**: Rápido (sem validação de UTMs)
- 🎯 **Simplicidade**: Dispositivo + 1 parâmetro para controlar
- 📱 **Segmentação**: Mobile vs Desktop
- 🔧 **Manutenibilidade**: Fácil de adicionar novos sites
- 📊 **Controle**: Controle total sobre o redirecionamento
- 🛡️ **Confiabilidade**: Menos pontos de falha