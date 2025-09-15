// Configuração de rotas e URLs de redirecionamento
const config = {
  // URLs padrão (podem ser sobrescritas por variáveis de ambiente)
  defaultUrls: {
    SITE_A_URL: 'https://example.com',
    SITE_B_URL: 'https://quiz-example.com'
  },

  // Mapeamento de sources para URLs
  routeMap: {
    'A': 'SITE_A_URL',
    'B': 'SITE_B_URL',
    'quiz': 'SITE_B_URL',
    'landing': 'SITE_A_URL'
  },

  // Função para obter URL de redirecionamento
  getRedirectUrl(source) {
    // Se não há source, usa o padrão
    if (!source) {
      return this.getEnvUrl('SITE_A_URL');
    }

    // Verifica se existe mapeamento para a source
    const urlKey = this.routeMap[source.toUpperCase()];
    
    if (urlKey) {
      return this.getEnvUrl(urlKey);
    }

    // Se source não é reconhecida, usa padrão
    console.log(`[CONFIG] Unknown source: ${source}, using default`);
    return this.getEnvUrl('SITE_A_URL');
  },

  // Função para obter URL do ambiente ou usar padrão
  getEnvUrl(key) {
    return process.env[key] || this.defaultUrls[key];
  },

  // Função para listar todas as configurações
  getAllUrls() {
    return {
      SITE_A_URL: this.getEnvUrl('SITE_A_URL'),
      SITE_B_URL: this.getEnvUrl('SITE_B_URL'),
      routes: this.routeMap
    };
  }
};

module.exports = config;