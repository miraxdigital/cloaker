# Router de Redirecionamento Simplificado por Parâmetro V

Sistema de redirecionamento inteligente baseado apenas no parâmetro `v` (variant/versão).

## Lógica de Redirecionamento SIMPLIFICADA

### Baseado APENAS no parâmetro `v`:

- **v=a** → **SITE_A** (`https://quiz.pilatesencasa.lat`)
- **v=b** → **SITE_B** (`https://chas-bariatricos.vercel.app`)  
- **v=c** → **SITE_C** (`https://app.receitaviva.online/`)
- **Sem parâmetro v** → **FALLBACK** (`https://app.receitaviva.online/`)
- **v=qualquer-outro-valor** → **FALLBACK** (`https://app.receitaviva.online/`)

## URLs Configuradas

```bash
SITE_A_URL=https://quiz.pilatesencasa.lat
SITE_B_URL=https://chas-bariatricos.vercel.app
SITE_C_URL=https://app.receitaviva.online/
FALLBACK_URL=https://app.receitaviva.online/
```

## Exemplos de Uso

### ✅ Redireciona para SITE_A (Pilates en Casa)
```
https://seu-dominio.com/?v=a
https://seu-dominio.com/?v=A
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste&v=a
```

### ✅ Redireciona para SITE_B (Chás Bariátricos)
```
https://seu-dominio.com/?v=b
https://seu-dominio.com/?v=B
https://seu-dominio.com/?utm_source=google&v=b&other_param=123
```

### ✅ Redireciona para SITE_C (Receita Viva)
```
https://seu-dominio.com/?v=c
https://seu-dominio.com/?v=C
https://seu-dominio.com/?v=c&utm_source=instagram
```

### ❌ Redireciona para FALLBACK (Receita Viva)
```
# Sem parâmetro v
https://seu-dominio.com/
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste

# Parâmetro v com valor não reconhecido
https://seu-dominio.com/?v=x
https://seu-dominio.com/?v=123
https://seu-dominio.com/?v=test

# Parâmetro v vazio
https://seu-dominio.com/?v=
```

## Cenários Possíveis

| Parâmetro v | Destino | URL | Observação |
|-------------|---------|-----|------------|
| `v=a` | SITE_A | https://quiz.pilatesencasa.lat | Case insensitive |
| `v=b` | SITE_B | https://chas-bariatricos.vercel.app | Case insensitive |
| `v=c` | SITE_C | https://app.receitaviva.online/ | Case insensitive |
| Ausente | FALLBACK | https://app.receitaviva.online/ | Padrão |
| Vazio (`v=`) | FALLBACK | https://app.receitaviva.online/ | Tratado como ausente |
| Outro valor | FALLBACK | https://app.receitaviva.online/ | Valor não reconhecido |

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
- ✅ **Logs detalhados**: Para debug e análise
- ✅ **Headers de segurança**: Cache-Control, Referrer-Policy, etc.
- ✅ **Tempo de resposta**: <20ms (muito mais rápido)
- ✅ **Lógica simplificada**: Apenas 1 parâmetro para validar
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
[REDIRECT DECISION] Target: SITE_A (Pilates en Casa)
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

# Teste v=a (SITE_A)
curl "http://localhost:3000/?v=a"

# Teste v=b (SITE_B)  
curl "http://localhost:3000/?v=b"

# Teste v=c (SITE_C)
curl "http://localhost:3000/?v=c"

# Teste sem v (FALLBACK)
curl "http://localhost:3000/"
```

## Vantagens da Nova Lógica

- 🚀 **Performance**: Muito mais rápido (sem validação de UTMs)
- 🎯 **Simplicidade**: Apenas 1 parâmetro para controlar
- 🔧 **Manutenibilidade**: Fácil de adicionar novos sites
- 📊 **Controle**: Controle total sobre o redirecionamento
- 🛡️ **Confiabilidade**: Menos pontos de falha