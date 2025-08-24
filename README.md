# Router de Redirecionamento Mobile + UTM

Sistema de redirecionamento inteligente baseado em detecção de dispositivo móvel, parâmetros UTM e variante.

## Lógica de Redirecionamento SIMPLIFICADA

### SITE_B_URL (Rutina Tés Bariátricos) - Condições:
✅ **Dispositivo móvel** (Android, iOS, etc.) **E**  
✅ **Parâmetros UTM obrigatórios**: `utm_source`, `utm_campaign`, `utm_medium`, `utm_content` **E**  
✅ **Parâmetro 'v'**: Qualquer valor (ex: `v=1`, `v=test`, `v=abc`)

### SITE_C_URL (Chás Bariátricos Vercel) - Condições:
✅ **Dispositivo móvel** (Android, iOS, etc.) **E**  
✅ **Parâmetros UTM obrigatórios**: `utm_source`, `utm_campaign`, `utm_medium`, `utm_content` **E**  
❌ **SEM parâmetro 'v'**

### SITE_A_URL (Receita Viva) - Casos:
- Desktop (qualquer condição)
- Mobile sem UTMs completos
- Qualquer erro ou condição não atendida

## URLs Configuradas

```bash
SITE_A_URL=https://app.receitaviva.online/
SITE_B_URL=https://deskfunnel.site/mounjaro-brasileno
SITE_C_URL=https://chas-bariatricos.vercel.app/
```

## Exemplos de Uso

### ✅ Redireciona para SITE_B (Mounjaro Brasileno)
```
# Mobile + UTMs completos + parâmetro 'v' com qualquer valor
https://deskfunnel.site/mounjaro-brasileno/?utm_source=FB&utm_campaign=teste&utm_medium=social&utm_content=ad1&v=1

# Mobile + UTMs + v=test
https://deskfunnel.site/mounjaro-brasileno/?utm_source=FB&utm_campaign=teste&utm_medium=social&utm_content=ad1&v=test

# Mobile + UTMs + v=abc
https://deskfunnel.site/mounjaro-brasileno/?utm_source=FB&utm_campaign=teste&utm_medium=social&utm_content=ad1&v=abc
```

### ✅ Redireciona para SITE_C (Chás Bariátricos Vercel)
```
# Mobile + UTMs completos (sem parâmetro 'v')
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste&utm_medium=social&utm_content=ad1
```

### ❌ Redireciona para SITE_A (Receita Viva)
```
# Desktop (mesmo com UTMs e 'v')
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste&utm_medium=social&utm_content=ad1&v=1

# Mobile sem UTMs
https://seu-dominio.com/

# Mobile com UTMs incompletos
https://seu-dominio.com/?utm_source=FB&utm_campaign=teste&v=1
```

## Cenários Possíveis

| Dispositivo | UTM Completo* | Parâmetro 'v' | Destino | Motivo |
|-------------|---------------|----------------|---------|---------|
| 📱 Mobile | ✅ Sim | ✅ Presente | SITE_B | Todas condições atendidas |
| 📱 Mobile | ✅ Sim | ❌ Ausente | SITE_C | Mobile + UTM sem variante |
| 📱 Mobile | ❌ Não | ✅ Presente | SITE_A | UTMs incompletos |
| 💻 Desktop | ✅ Sim | ✅ Presente | SITE_A | Não é mobile |
| 💻 Desktop | ✅ Sim | ❌ Ausente | SITE_A | Não é mobile |
| 📱 Mobile | ❌ Não | ❌ Ausente | SITE_A | UTMs incompletos |

*UTM Completo = `utm_source` + `utm_campaign` + `utm_medium` + `utm_content`

## Parâmetro de Diferenciação

**Parâmetro 'v' (variant/versão):**
- Pode ter **qualquer valor**: `v=1`, `v=test`, `v=abc`, `v=qualquer-coisa`
- Se estiver **presente** (com qualquer valor) + Mobile + UTMs = **SITE_B**
- Se estiver **ausente** + Mobile + UTMs = **SITE_C**

## Detecção Mobile

O sistema detecta os seguintes dispositivos como móveis:
- Android
- iPhone/iPad/iPod
- Windows Mobile
- BlackBerry
- Opera Mini
- Outros navegadores mobile

## Endpoints

- `GET /` - Redirecionamento principal
- `GET /debug` - Informações de debug (JSON)
- `GET /health` - Status do sistema

## Logs Detalhados

O sistema registra:
- Detecção de dispositivo móvel
- Parâmetros UTM recebidos
- Presença do parâmetro 'v'
- Decisão de redirecionamento
- Tempo de resposta
- IPs e User-Agents

## Deploy

### Netlify
```bash
# Configure as variáveis de ambiente
SITE_A_URL=https://app.receitaviva.online/
SITE_B_URL=https://4m025y0l.xquiz.io/
SITE_C_URL=https://chas-bariatricos.vercel.app/
```

### Teste Local
```bash
npm install
npm run dev

# Teste mobile + UTM (SITE_C)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
"http://localhost:3000/?utm_source=FB&utm_campaign=test&utm_medium=social&utm_content=ad1"

# Teste mobile + UTM + variant (SITE_B)
curl -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" \
"http://localhost:3000/?utm_source=FB&utm_campaign=test&utm_medium=social&utm_content=ad1&v=1"
```

## Características Técnicas

- ✅ Detecção precisa de dispositivos móveis
- ✅ Validação rigorosa de parâmetros UTM
- ✅ Diferenciação simples via parâmetro 'v'
- ✅ Redirecionamentos 302 (temporários)
- ✅ Headers de segurança
- ✅ Logs detalhados para análise
- ✅ Fallback seguro para SITE_A em caso de erro
- ✅ Tempo de resposta otimizado (<50ms)
- ✅ Lógica simplificada e performática
- ✅ Priorização: SITE_B > SITE_C > SITE_A