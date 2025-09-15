const detectionMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Coleta informações básicas da requisição
  const requestInfo = {
    ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
    userAgent: req.headers['user-agent'] || 'Unknown',
    referer: req.headers.referer || req.headers.referrer || 'Direct',
    acceptLanguage: req.headers['accept-language'] || 'Unknown',
    source: req.query.source || 'default',
    timestamp: new Date().toISOString()
  };

  // Adiciona informações ao objeto de requisição
  req.detection = requestInfo;
  
  // Log da detecção
  console.log('[DETECTION]', {
    ip: requestInfo.ip,
    source: requestInfo.source,
    userAgent: requestInfo.userAgent.substring(0, 100) + '...',
    referer: requestInfo.referer
  });

  // Middleware para medir tempo de resposta
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    console.log(`[PERFORMANCE] Response time: ${responseTime}ms`);
  });

  next();
};

module.exports = detectionMiddleware;