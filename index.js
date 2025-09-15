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
    const source = req.query.source;
    const targetUrl = config.getRedirectUrl(source);
    
    console.log(`[REDIRECT] Source: ${source || 'default'} -> ${targetUrl}`);
    
    // Redirecionamento 302 (temporário)
    res.status(302).redirect(targetUrl);
  } catch (error) {
    console.error('[ERROR]', error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`[404] Path not found: ${req.originalUrl}`);
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`[SERVER] Router running on port ${PORT}`);
  console.log(`[CONFIG] Default URL: ${config.getRedirectUrl()}`);
});

module.exports = app;