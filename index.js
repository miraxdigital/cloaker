const express = require('express');
const cors = require('cors');
const detectionMiddleware = require('./middleware/detection');
const config = require('./config/routes');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors());
app.use(express.json());
app.use(logger);

// Headers de segurança globais
app.use((req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  next();
});

// Rota principal de redirecionamento
app.get('/', detectionMiddleware, (req, res) => {
  try {
    const userAgent = req.headers['user-agent'] || '';
    const query = req.query || {};
    
    // Determina URL de redirecionamento baseado na lógica
    const targetUrl = config.getRedirectUrl(userAgent, query);
    
    // Log da decisão de redirecionamento
    const debugInfo = config.getDebugInfo(userAgent, query);
    console.log('[REDIRECT DECISION]', {
      mobile: debugInfo.isMobile,
      hasUTM: debugInfo.hasRequiredUTM,
      hasVariant: debugInfo.hasVariant,
      target: targetUrl === config.urls.SITE_B_URL ? 'SITE_B (Rutina Tés)' : 
              targetUrl === config.urls.SITE_C_URL ? 'SITE_C (Chás Vercel)' : 'SITE_A (Receita Viva)'
    });
    
    // Redirecionamento 302 (temporário)
    res.status(302).redirect(targetUrl);
  } catch (error) {
    console.error('[ERROR]', error.message);
    // Em caso de erro, redireciona para SITE_A_URL como fallback
    res.status(302).redirect(config.urls.SITE_A_URL);
  }
});

// Rota de debug (para testes)
app.get('/debug', detectionMiddleware, (req, res) => {
  const userAgent = req.headers['user-agent'] || '';
  const query = req.query || {};
  const debugInfo = config.getDebugInfo(userAgent, query);
  
  res.status(200).json({
    ...debugInfo,
    urls: config.urls,
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    urls: {
      SITE_A: config.urls.SITE_A_URL,
      SITE_B: config.urls.SITE_B_URL,
      SITE_C: config.urls.SITE_C_URL
    }
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  // Em caso de erro, redireciona para SITE_A_URL
  res.status(302).redirect(config.urls.SITE_A_URL);
});

// 404 handler - redireciona para SITE_A_URL
app.use('*', (req, res) => {
  console.log(`[404] Path not found: ${req.originalUrl} - Redirecting to SITE_A`);
  res.status(302).redirect(config.urls.SITE_A_URL);
});

app.listen(PORT, () => {
  console.log(`[SERVER] Mobile UTM Router running on port ${PORT}`);
  console.log(`[CONFIG] SITE_A_URL: ${config.urls.SITE_A_URL}`);
  console.log(`[CONFIG] SITE_B_URL: ${config.urls.SITE_B_URL}`);
  console.log(`[LOGIC] Mobile + UTM (4 params) = SITE_B | Others = SITE_A`);
});

module.exports = app;