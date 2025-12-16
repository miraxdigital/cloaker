// Configuração de rotas e URLs de redirecionamento
const config = {
  // URLs configuradas
  urls: {
    SITE_A_URL: process.env.SITE_A_URL || 'https://www.instagram.com/becarecenter_spa/',
    SITE_B_URL: process.env.SITE_B_URL || 'https://cafequemagrasa.lovable.app/',
    SITE_C_URL: process.env.SITE_C_URL || 'https://tesmetabolicos.xpages.co/'
  },

  // Função para detectar dispositivo móvel
  isMobileDevice(userAgent) {
    if (!userAgent) return false;
    
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  },

  // Função para verificar se possui parâmetros UTM necessários
  hasRequiredUTMParams(query) {
    const requiredParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content'];
    
    // Verifica se todos os parâmetros obrigatórios estão presentes
    return requiredParams.every(param => {
      const hasParam = query[param] && query[param].trim() !== '';
      if (!hasParam) {
        console.log(`[UTM CHECK] Missing required parameter: ${param}`);
      }
      return hasParam;
    });
  },

  // Função para verificar se deve ir para SITE_C (usando parâmetro 'v')
  shouldRedirectToSiteB(query) {
    // Verifica se existe o parâmetro 'v' (versão/variant)
    const hasVariant = query.v && query.v.trim() !== '';
    
    console.log(`[VARIANT CHECK] Parameter 'v': ${query.v || 'not present'}, Redirect to SITE_B: ${hasVariant}`);
    return hasVariant;
  },

  // Função principal para determinar URL de redirecionamento
  getRedirectUrl(userAgent, query) {
    const isMobile = this.isMobileDevice(userAgent);
    const hasUTM = this.hasRequiredUTMParams(query);
    const shouldGoToSiteB = this.shouldRedirectToSiteB(query);
    
    console.log(`[REDIRECT LOGIC] Mobile: ${isMobile}, UTM: ${hasUTM}, Has Variant: ${shouldGoToSiteB}`);
    
    // Log dos parâmetros recebidos
    const allParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term', 'v'];
    const receivedParams = {};
    allParams.forEach(param => {
      if (query[param]) {
        receivedParams[param] = query[param];
      }
    });
    
    if (Object.keys(receivedParams).length > 0) {
      console.log('[PARAMS RECEIVED]', receivedParams);
    }

    // PRIORIDADE 1: Mobile + UTM + Parâmetro 'v' = SITE_B_URL
    if (isMobile && hasUTM && shouldGoToSiteB) {
      console.log('[REDIRECT] Mobile + UTM + Variant -> SITE_B_URL');
      return this.urls.SITE_B_URL;
    }

    // PRIORIDADE 2: Mobile + UTM (sem parâmetro 'v') = SITE_C_URL
    if (isMobile && hasUTM) {
      console.log('[REDIRECT] Mobile + UTM (no variant) -> SITE_C_URL');
      return this.urls.SITE_C_URL;
    }

    // FALLBACK: Qualquer outra condição = SITE_A_URL
    console.log('[REDIRECT] Default conditions -> SITE_A_URL');
    return this.urls.SITE_A_URL;
  },

  // Função para obter informações de debug
  getDebugInfo(userAgent, query) {
    return {
      isMobile: this.isMobileDevice(userAgent),
      hasRequiredUTM: this.hasRequiredUTMParams(query),
      hasVariant: this.shouldRedirectToSiteB(query),
      variantParam: query.v || null,
      utmParams: {
        utm_source: query.utm_source || null,
        utm_campaign: query.utm_campaign || null,
        utm_medium: query.utm_medium || null,
        utm_content: query.utm_content || null,
        utm_term: query.utm_term || null,
        v: query.v || null
      },
      userAgent: userAgent ? userAgent.substring(0, 100) + '...' : 'Unknown',
      redirectUrl: this.getRedirectUrl(userAgent, query)
    };
  }
};

module.exports = config;