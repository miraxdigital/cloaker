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
  const vParam = query.v || null;
  
  // Adiciona informações de detecção ao objeto de requisição
  req.detection = {
    ...requestInfo,
    isMobile: isMobile,
    vParam: vParam,
    allParams: query
  };
  
  // Log detalhado da detecção
  console.log('[DETECTION]', {
    ip: requestInfo.ip,
    mobile: isMobile ? 'YES' : 'NO',
    vParam: vParam || 'not present',
    userAgent: userAgent.substring(0, 80) + '...',
    referer: requestInfo.referer
  });

  // Log dos parâmetros se existirem
  if (Object.keys(query).length > 0) {
    console.log('[PARAMS DETECTED]', query);
  }

  // Middleware para medir tempo de resposta
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    console.log(`[PERFORMANCE] Response time: ${responseTime}ms`);
  });

  next();
};

module.exports = detectionMiddleware;