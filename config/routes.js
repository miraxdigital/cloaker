// Configuração de rotas e URLs de redirecionamento
const config = {
  // URLs configuradas
  urls: {
    SITE_A_URL: process.env.SITE_A_URL || 'https://quiz.pilatesencasa.lat',
    SITE_B_URL: process.env.SITE_B_URL || 'https://chas-bariatricos.vercel.app',
    SITE_C_URL: process.env.SITE_C_URL || 'https://app.receitaviva.online/', // Fallback
    FALLBACK_URL: process.env.FALLBACK_URL || 'https://app.receitaviva.online/' // URL padrão quando não há parâmetro v
  },

  // Função para detectar dispositivo móvel
  isMobileDevice(userAgent) {
    if (!userAgent) return false;
    
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  },

  // Função para determinar URL baseada no parâmetro v
  getUrlByVariant(vParam) {
    if (!vParam || vParam.trim() === '') {
      console.log(`[VARIANT CHECK] No 'v' parameter -> FALLBACK`);
      return this.urls.FALLBACK_URL;
    }

    const variant = vParam.toLowerCase().trim();
    console.log(`[VARIANT CHECK] Parameter 'v': ${vParam} (normalized: ${variant})`);

    switch (variant) {
      case 'a':
        console.log(`[VARIANT CHECK] v=a -> SITE_A (Pilates en Casa)`);
        return this.urls.SITE_A_URL;
      
      case 'b':
        console.log(`[VARIANT CHECK] v=b -> SITE_B (Chás Bariátricos)`);
        return this.urls.SITE_B_URL;
      
      case 'c':
        console.log(`[VARIANT CHECK] v=c -> SITE_C (Receita Viva)`);
        return this.urls.SITE_C_URL;
      
      default:
        console.log(`[VARIANT CHECK] Unknown variant '${variant}' -> FALLBACK`);
        return this.urls.FALLBACK_URL;
    }
  },

  // Função principal para determinar URL de redirecionamento
  getRedirectUrl(userAgent, query) {
    const isMobile = this.isMobileDevice(userAgent);
    const vParam = query.v || null;
    
    console.log(`[REDIRECT LOGIC] Mobile: ${isMobile}, v parameter: ${vParam || 'not present'}`);
    
    // Log dos parâmetros recebidos (para debug)
    const allParams = Object.keys(query);
    if (allParams.length > 0) {
      console.log('[PARAMS RECEIVED]', query);
    }

    // NOVA LÓGICA: Mobile + parâmetro v válido
    if (isMobile && vParam) {
      const targetUrl = this.getUrlByVariant(vParam);
      // Se o parâmetro v é válido (não retorna fallback), usa o site específico
      if (targetUrl !== this.urls.FALLBACK_URL) {
        const siteName = targetUrl === this.urls.SITE_A_URL ? 'SITE_A (Pilates en Casa)' :
                         targetUrl === this.urls.SITE_B_URL ? 'SITE_B (Chás Bariátricos)' :
                         targetUrl === this.urls.SITE_C_URL ? 'SITE_C (Receita Viva)' : 'UNKNOWN';
        
        console.log(`[REDIRECT DECISION] Mobile + v=${vParam} -> ${siteName}`);
        return targetUrl;
      }
    }
    
    // FALLBACK: Desktop OU Mobile sem v válido
    console.log(`[REDIRECT DECISION] ${isMobile ? 'Mobile' : 'Desktop'} without valid v -> FALLBACK`);
    return this.urls.FALLBACK_URL;
  },
    
    // Log da decisão final
    const siteName = targetUrl === this.urls.SITE_A_URL ? 'SITE_A (Pilates en Casa)' :
                     targetUrl === this.urls.SITE_B_URL ? 'SITE_B (Chás Bariátricos)' :
                     targetUrl === this.urls.SITE_C_URL ? 'SITE_C (Receita Viva)' : 'FALLBACK';
    
    console.log(`[REDIRECT DECISION] Target: ${siteName}`);
    
    return targetUrl;
  },

  // Função para obter informações de debug
  getDebugInfo(userAgent, query) {
    const vParam = query.v || null;
    const targetUrl = this.getRedirectUrl(userAgent, query);
    const isMobile = this.isMobileDevice(userAgent);
    
    return {
      isMobile: isMobile,
      vParam: vParam,
      vParamNormalized: vParam ? vParam.toLowerCase().trim() : null,
      allParams: query,
      userAgent: userAgent ? userAgent.substring(0, 100) + '...' : 'Unknown',
      redirectUrl: targetUrl,
      siteMapped: targetUrl === this.urls.SITE_A_URL ? 'SITE_A (Pilates en Casa)' :
                  targetUrl === this.urls.SITE_B_URL ? 'SITE_B (Chás Bariátricos)' :
                  targetUrl === this.urls.SITE_C_URL ? 'SITE_C (Receita Viva)' : 'FALLBACK',
      logic: isMobile ? 
        (vParam && this.getUrlByVariant(vParam) !== this.urls.FALLBACK_URL ? `Mobile + v=${vParam} -> Specific Site` : 'Mobile without valid v -> Fallback') :
        'Desktop -> Fallback'
    };
  }
};

module.exports = config;