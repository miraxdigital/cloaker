const detectionMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Coleta informações básicas da requisição
  const userAgent = req.headers['user-agent'] || '';
  const query = req.query || {};
  
  const requestInfo = {
    ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
    userAgent: userAgent,
    referer: req.headers.referer || req.headers.referrer || 'Direct',
    acceptLanguage: req.headers['accept-language'] || 'Unknown',
    timestamp: new Date().toISOString(),
    query: query
  };

  // Detecção específica de dispositivo móvel
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  const isMobile = mobileRegex.test(userAgent);
  
  // Análise de parâmetros UTM
  const utmParams = ['utm_source', 'utm_campaign', 'utm_medium', 'utm_content', 'utm_term'];
  const detectedUTMs = {};
  let utmCount = 0;
  
  utmParams.forEach(param => {
    if (query[param]) {
      detectedUTMs[param] = query[param];
      utmCount++;
    }
  });

  // Adiciona informações de detecção ao objeto de requisição
  req.detection = {
    ...requestInfo,
    isMobile: isMobile,
    utmParams: detectedUTMs,
    utmCount: utmCount,
    hasRequiredUTMs: utmCount >= 4 // Precisa de pelo menos 4 UTMs obrigatórios
  };
  
  // Log detalhado da detecção
  console.log('[DETECTION]', {
    ip: requestInfo.ip,
    mobile: isMobile ? 'YES' : 'NO',
    utmCount: utmCount,
    userAgent: userAgent.substring(0, 80) + '...',
    referer: requestInfo.referer
  });

  // Log dos UTMs se existirem
  if (utmCount > 0) {
    console.log('[UTM DETECTED]', detectedUTMs);
  }

  // Middleware para medir tempo de resposta
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    console.log(`[PERFORMANCE] Response time: ${responseTime}ms`);
  });

  next();
};

module.exports = detectionMiddleware;